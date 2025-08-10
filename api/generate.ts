// Vercel Edge Functions run in a special environment, hence the 'edge' runtime.
export const config = {
  runtime: 'edge',
};

import { GoogleGenAI } from "@google/genai";
import type { Article, GroundingSource } from '../types';

const generateImageForArticle = async (ai: GoogleGenAI, title: string): Promise<string | undefined> => {
  try {
    const prompt = `A photorealistic image for a news article with the headline: "${title}". The image should have a professional, high-quality news photography style. Avoid text and logos.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return undefined;
  } catch (error) {
    console.warn("Image generation failed, proceeding without an image:", error);
    return undefined; // Non-critical
  }
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const { topic } = await req.json();
  if (!topic) {
    return new Response(JSON.stringify({ error: 'Topic is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  
  if (!process.env.API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API key is not configured. Please set the API_KEY environment variable in your deployment settings.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `As an AI news assistant, write a neutral, factual, and engaging news article about the following topic: "${topic}".
The article must be well-structured. Start with a compelling headline on the very first line.
After the headline, add a blank line, then begin the body of the article.
Use paragraphs to structure the article content. The tone must be professional and suitable for a general audience.
Do not add any personal opinions or embellishments. Stick to the facts provided by the search results.`;

    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = textResponse.text;
    const lines = rawText.split('\n');
    const title = lines[0]?.trim() || 'Untitled Article';
    const content = lines.slice(2).join('\n').trim();
    
    const rawChunks = textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = rawChunks
      .map(chunk => chunk.web?.uri ? { web: { uri: chunk.web.uri, title: chunk.web.title || 'Untitled Source' } } : null)
      .filter((source): source is GroundingSource => source !== null);

    if (!content) {
        throw new Error("The generated content was empty.");
    }
    
    const imageUrl = await generateImageForArticle(ai, title);

    const article: Article = { 
        id: crypto.randomUUID(),
        title, 
        content, 
        sources, 
        imageUrl 
    };

    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return new Response(JSON.stringify({ error: `Failed to generate news from AI: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}