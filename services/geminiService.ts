
import { GoogleGenAI } from "@google/genai";
import type { Article, GroundingSource } from '../types';

/**
 * Generates an image based on the article title. This is a non-critical step.
 * If it fails, it will return undefined and log a warning.
 * @param ai The initialized GoogleGenAI instance.
 * @param title The title of the news article.
 * @returns A base64 data URL for the image, or undefined if generation fails.
 */
const generateImageForArticle = async (ai: GoogleGenAI, title: string): Promise<string | undefined> => {
  try {
    console.log(`Generating image for article: "${title}"`);
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
      console.log("Image generation successful.");
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    console.warn("Image generation response did not contain images.");
    return undefined;
  } catch (error) {
    console.warn("Image generation failed, proceeding without an image:", error);
    return undefined; // Non-critical, so we don't throw.
  }
};


export const generateNewsArticle = async (topic: string): Promise<Article> => {
  // Check for the API key from environment variables at the point of action.
  // This is a secure way to handle secrets in a deployment environment like Vercel.
  if (!process.env.API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable in your deployment settings.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `As an AI news assistant, write a neutral, factual, and engaging news article about the following topic: "${topic}".
The article must be well-structured. Start with a compelling headline on the very first line.
After the headline, add a blank line, then begin the body of the article.
Use paragraphs to structure the article content. The tone must be professional and suitable for a general audience on a social media platform.
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
    
    // Transform the raw grounding chunks from the API into our strongly-typed GroundingSource format.
    const rawChunks = textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = rawChunks
      .map(chunk => {
        // A valid source for our app requires a web source with a URI.
        if (chunk.web?.uri) {
          return {
            web: {
              uri: chunk.web.uri,
              // Provide a fallback title to satisfy the GroundingSource type.
              title: chunk.web.title || 'Untitled Source',
            },
          };
        }
        return null;
      })
      // Filter out invalid chunks and use a type guard for type safety.
      .filter((source): source is GroundingSource => source !== null);

    if (!content) {
        throw new Error("The generated content was empty. The topic may have been too ambiguous or restrictive.");
    }
    
    // After successfully generating the article, generate an image for it.
    const imageUrl = await generateImageForArticle(ai, title);

    return { 
        id: crypto.randomUUID(),
        title, 
        content, 
        sources, 
        imageUrl 
    };
  } catch (error) {
    console.error("Error generating news article:", error);
    if (error instanceof Error) {
        // Prevent leaking raw API error details to the user, but provide a helpful message.
        if (error.message.includes("API key not valid")) {
             throw new Error("The configured Gemini API key is invalid. Please check it in your deployment settings.");
        }
        throw new Error(`Failed to generate news from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the news article.");
  }
};
