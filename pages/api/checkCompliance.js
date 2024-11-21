

// for every clause in the legal document we are going to create a compliance report 
import pc from "@/src/pinecone";
import { getCompletion } from "@/src/geminiServices";
import { connectDB } from "@/src/db";
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

        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'File ID is required' });
        }

        const myFile = await MyFileModel.findById(id);
        if (!myFile) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Get all vectors for this file from Pinecone
        const index = pc.index(myFile.vectorIndex);

        // Ensure topK is a valid integer with a reasonable maximum
        const topK = Math.min(Math.max(1, parseInt(myFile.clauseCount) || 100), 1000);

        const queryRequest = {
            vector: new Array(768).fill(0),
            filter: {
                fileId: myFile._id.toString()
            },
            includeMetadata: true,
            topK: topK
        };

        const allClauses = await index.query(queryRequest);

        // Process each clause for compliance
        const complianceResults = [];
        for (const clause of allClauses.matches) {
            const prompt = `Categorize the clause: "${clause.metadata.text}" as 'Compliant', 'Risky', or 'Non Compliant' compared to legal standards, give a very short reason`;

            let response = await getCompletion(prompt);

            // Clean the response before storing
            response = cleanResponse(response);

            complianceResults.push({
                clauseNumber: clause.metadata.clauseNumber,
                text: cleanResponse(clause.metadata.text),  // Clean the clause text as well
                analysis: response
            });

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Sort results by clause number
        complianceResults.sort((a, b) => a.clauseNumber - b.clauseNumber);

        return res.status(200).json({
            message: 'Compliance check completed successfully',
            results: complianceResults,
            checkedAt: new Date()
        });

    } catch (error) {
        console.error('Compliance check error:', error);
        return res.status(500).json({
            message: 'Error performing compliance check',
            error: error.message
        });
    } finally {
        if (dbConnection) {
            // await disconnectDB();
        }
    }
}