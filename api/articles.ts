import { get, put, del } from '@vercel/blob';
import type { Article } from '../types';

export const config = {
  runtime: 'edge',
};

const ARTICLES_PATH = 'articles.json';

// Helper to get all articles, returns empty array if not found
async function getArticles(): Promise<Article[]> {
    try {
        const blob = await get(ARTICLES_PATH);
        return await blob.json();
    } catch (error: any) {
        if (error.status === 404) {
            return []; // Not an error, just no articles yet
        }
        throw error; // Re-throw other errors
    }
}

export default async function handler(req: Request) {
    const requestUrl = new URL(req.url);

    try {
        if (req.method === 'GET') {
            const articles = await getArticles();
            return new Response(JSON.stringify(articles), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (req.method === 'POST') {
            const newArticle = (await req.json()) as Article;
            if (!newArticle || !newArticle.id) {
                return new Response(JSON.stringify({ error: 'Invalid article data' }), { status: 400 });
            }
            const articles = await getArticles();
            if (articles.some(a => a.id === newArticle.id)) {
                return new Response(JSON.stringify({ error: 'Article already exists' }), { status: 409 });
            }
            const updatedArticles = [...articles, newArticle];
            await put(ARTICLES_PATH, JSON.stringify(updatedArticles), { access: 'protected' });
            return new Response(JSON.stringify({ success: true }), { status: 201 });
        }

        if (req.method === 'DELETE') {
            const { id } = await req.json();
            if (!id) {
                return new Response(JSON.stringify({ error: 'Article ID is required' }), { status: 400 });
            }
            const articles = await getArticles();
            const updatedArticles = articles.filter(a => a.id !== id);
            
            if (articles.length === updatedArticles.length) {
                 return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
            }

            await put(ARTICLES_PATH, JSON.stringify(updatedArticles), { access: 'protected' });
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }
    } catch (error) {
        console.error("Error in /api/articles:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}