import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

const generativeAI = new GoogleGenerativeAI(apiKey);

// Define models for embeddings and completions
const EMBEDDING_MODEL = "text-embedding-004";  
const COMPLETION_MODEL = "gemini-1.5-pro";    

// Function to get embeddings from the Gemini embedding model
export const getEmbeddings = async (text) => {
    try {
        const model = generativeAI.getGenerativeModel({
            model: EMBEDDING_MODEL
        });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error('Error getting embeddings:', error);
        throw error;
    }
};

// Function to get completions from the Gemini completion model
export const getCompletion = async (prompt) => {
    try {
        const model = generativeAI.getGenerativeModel({
            model: COMPLETION_MODEL
        });
        const result = await model.generateContent(prompt, { maxTokens: 500, temperature: 0 });
        return result.response.text();
    } catch (error) {
        console.error('Error getting completion:', error);
        throw error;
    }
};
