import type { Article } from '../types';

export const generateNewsArticle = async (topic: string): Promise<Article> => {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate article.');
    }
    return response.json();
};

export const getSavedArticles = async (): Promise<Article[]> => {
    const response = await fetch('/api/articles');
    if (!response.ok) {
        throw new Error('Failed to fetch saved articles.');
    }
    return response.json();
};

export const saveArticle = async (article: Article): Promise<void> => {
    const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });

    if (!response.ok) {
        throw new Error('Failed to save the article.');
    }
};

export const deleteArticle = async (articleId: string): Promise<void> => {
    const response = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: articleId }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete the article.');
    }
};
