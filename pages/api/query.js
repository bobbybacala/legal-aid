
// to query the completion model by building the prompt
import pc from "@/src/pinecone";
// import { getCompletion, getEmbeddings } from "@/src/openaiServices";
import { getCompletion, getEmbeddings } from "@/src/geminiServices";
import { connectDB, disconnectDB } from "@/src/db";
import MyFileModel from "@/src/models/myfile";

// Helper function to clean special characters from text
function cleanResponse(text) {
    if (!text) return text;

    // Remove asterisks, bullets, and other common special characters
    // Add or remove characters from this regex based on your needs
    return text
        .replace(/[*•\-_~`'"]+/g, '')  // Remove specific special characters
        .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
        .trim();                       // Remove leading/trailing whitespace
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let dbConnection = false;
    
    try {
        // Connect to MongoDB
        await connectDB();
        dbConnection = true;

        const { query, id } = req.body;
        if (!query || !id) {
            return res.status(400).json({ message: 'Query and file ID are required' });
        }

        const myFile = await MyFileModel.findById(id);
        if (!myFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Get embeddings for the query
        const questionEmb = await getEmbeddings(query);

        // Query the Pinecone index
        const index = pc.index(myFile.vectorIndex);
        const queryRequest = {
            vector: questionEmb,
            topK: 5,
            includeValues: true,
            includeMetadata: true,
        };

        const result = await index.query(queryRequest);

        // Extract relevant context from the results
        const contexts = result.matches.map(item => item.metadata.text).join("\n\n---\n\n");

        // Build the prompt
        const promptStart = `Answer the question based on the context below:\n\n`;
        const promptEnd = `\n\nQuestion: ${query}\n\nAnswer:`;
        const prompt = `${promptStart}${contexts}${promptEnd}`;

        // Generate response using OpenAI
        let response = await getCompletion(prompt);

        // clean the response, if special characters are there before sending the response
        response = cleanResponse(response)

        return res.status(200).json({ response });
    } catch (error) {
        console.error('Query response error:', error);
        return res.status(500).json({
            message: 'Error generating response',
            error: error.message
        });
    } finally {
        // Always disconnect from DB if we connected
        if (dbConnection) {
            // await disconnectDB();
        }
    }
}