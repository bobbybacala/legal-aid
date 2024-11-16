// script for Open Ai services

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// our models used
const EMBEDDING_MODEL = "text-embedding-ada-002";  
const COMPLETION_MODEL = "gpt-3.5-turbo";  

// export the get embedding and get completion functions, as we need them in fileprocess api

// function to get the embeddings from the embedding model
export const getEmbeddings = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error getting embeddings:', error);
        throw error;
    }
}

// function to get the complete respose from the completion model
export const getCompletion = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: COMPLETION_MODEL,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0
        });
        console.log(completion.choices);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error getting completion:', error);
        throw error;
    }
}