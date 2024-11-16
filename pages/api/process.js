import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import MyFileModel from "@/src/models/myfile";
import { connectDB, disconnectDB } from "@/src/db";
// import { getEmbeddings } from "@/src/openaiServices";
import { getEmbeddings } from "@/src/geminiServices";
import pc from "@/src/pinecone";

// Set worker path for PDF.js
// PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

// Helper function to split text into clauses
function splitIntoClauses(text) {

    // Regular expression to identify clause headings
    const clausePattern = /\n?\d+\.\s|\n?[a-zA-Z]\)\s|\n?[A-Za-z]+\. /;

    // Split the text based on the pattern and trim whitespace
    return text.split(clausePattern).map(clause => clause.trim()).filter(clause => clause.length > 0);
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

        if (myFile.isProcessed) {
            return res.status(400).json({ message: 'File is already processed' });
        }

        // Fetch and process PDF
        const response = await fetch(myFile.fileUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const pdfData = await response.arrayBuffer();
        const pdfDoc = await PDFJS.getDocument(pdfData).promise;
        const vectors = [];

        let fullText = '';

        // Extract text from each page and concatenate
        for (let i = 0; i < pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i + 1);
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ').trim();
            fullText += ' ' + text;
        }

        // Split full text into clauses
        const clauses = splitIntoClauses(fullText);

        // Generate embeddings for each clause
        for (let i = 0; i < clauses.length; i++) {
            const clauseText = clauses[i];
            const embedding = await getEmbeddings(clauseText);

            vectors.push({
                id: `${myFile._id}_clause${i + 1}`,
                values: embedding,
                metadata: {
                    fileId: myFile._id,
                    clauseNum: i + 1,
                    text: clauseText,
                },
            });
        }

        if (vectors.length === 0) {
            throw new Error('No valid clause content found in PDF');
        }

        // Initialize Pinecone index
        const index = pc.index(myFile.vectorIndex);

        // Batch upsert to Pinecone (in chunks to avoid size limits)
        const BATCH_SIZE = 100;
        for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
            const batch = vectors.slice(i, i + BATCH_SIZE);
            await index.upsert(batch);
        }

        // Update MongoDB document
        myFile.isProcessed = true;
        myFile.clauseCount = clauses.length;
        myFile.processedAt = new Date();
        await myFile.save();

        return res.status(200).json({
            message: 'File processed successfully',
            clauses: clauses.length,
            vectorsCreated: vectors.length
        });

    } catch (error) {
        console.error('PDF processing error:', error);
        return res.status(500).json({
            message: 'Error processing file',
            error: error.message
        });
    } finally {
        if (dbConnection) {
            // await disconnectDB();
        }
    }
}
