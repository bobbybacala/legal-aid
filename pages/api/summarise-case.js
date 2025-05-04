// api to summarise a legal case, will only be called when a legal case is selected on the frontend

import pc from "@/src/pinecone";
import { getCompletion } from "@/src/geminiServices";
import { connectDB } from "@/src/db";
import MyFileModel from "@/src/models/myfile";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        // get the file id from the request body
        const { id } = req.body;    // short for id = req.body.id
        if (!id) {
            return res.status(400).json({ message: 'File ID is required' });
        }

        const myFile = await MyFileModel.findById(id);
        if (!myFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // get all the vectors for the file from pinecone
        const index = pc.index(myFile.vectorIndex);

        // fetch the number of the embeddings to return
        const topK = Math.min(Math.max(1, parseInt(myFile.clauseCount) || 100), 1000);

        // build the request body for querying the index
        const queryRequest = {
            vector: new Array(768).fill(0),
            filter: {
                fileId: myFile._id.toString()
            },
            includeMetadata: true,
            topK: topK
        }

        const allProceedings = await index.query(queryRequest);

        // combine the text of all the proceedings into a single string
        const documentText = allProceedings.matches.map((match) => match.metadata.text).join(" ");

        // construct the prompt for the LLM
        const prompt = `Please Summarize the following legal case document in a concise and clear manner:\n\n"${documentText}" \n\n Also Give AI point of view on the case in short.`;

        // get the response from the LLM
        let summary_response = await getCompletion(prompt)

        // trim it
        summary_response = summary_response.trim()

        // send the response back to the client
        return res.status(200).json({
            message: 'Summarization completed successfully',
            summary: summary_response,
            summarizedAt: new Date()
        });
    } catch (error) {
        console.error('Summarization error:', error);
        return res.status(500).json({
            message: 'Error performing summarization',
            error: error.message
        });
    }
}