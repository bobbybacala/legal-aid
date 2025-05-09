import * as PDFJS from 'pdfjs-dist/legacy/build/pdf';
import MyFileModel from "@/src/models/myfile";
import { connectDB, disconnectDB } from "@/src/db";
// import { getEmbeddings } from "@/src/openaiServices";
import { getEmbeddings } from "@/src/geminiServices";
import pc from "@/src/pinecone";

// function to pparse legal cases files
function parseLegalDocument(text) {
    // Result object to store clauses (heading will be included as a clause)
    const result = {
        clauses: []
    };

    // First, normalize line endings and whitespace
    const normalizedText = text
        .replace(/\r\n/g, '\n')
        .trim();

    // Extract heading (everything before the first numbered clause)
    const lines = normalizedText.split('\n');
    let headingLines = [];
    let documentLines = [];
    let headingEnded = false;

    // Find where the numbered clauses begin (usually after "JUDGEMENT" or similar)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Look for markers that typically indicate the end of heading
        if (!headingEnded &&
            (line.match(/^JUDGEMENT/i) ||
                line.match(/^ORDER/i) ||
                line.match(/^CORAM:/i) ||
                line.match(/^[0-9]{1,3}\.\s/))) {
            headingEnded = true;
        }

        // Add to appropriate section
        if (!headingEnded) {
            headingLines.push(line);
        } else {
            documentLines.push(line);
        }
    }

    // Join heading lines and add as first clause
    const headingText = headingLines.join(' ').replace(/\s+/g, ' ').trim();
    if (headingText) {
        result.clauses.push({
            number: 0,
            text: headingText
        });
    }

    // Process the document body to extract numbered clauses
    const bodyText = documentLines.join('\n');

    // Pattern to match numbered clauses (patterns like "1.", "2.", etc.)
    // Limited to 1-3 digits to avoid matching years
    const clausePattern = /(?:^|\n)(\d{1,3}\.)\s+([^\n]+(?:\n(?!\d{1,3}\.)[^\n]+)*)/g;


    let match;
    while ((match = clausePattern.exec(bodyText)) !== null) {
        const clauseNumber = parseInt(match[1]); // The number with period (e.g., "1.")
        const clauseText = match[2].replace(/\n\s*/g, ' ').trim(); // The clause text with newlines normalized

        result.clauses.push({
            number: clauseNumber,
            text: clauseText
        });
    }

    return result;
}

// function to parse the contract files
function parseContractDocument(text) {
    // Normalize line endings, multiple spaces and remove extra whitespace
    const normalizedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\n\s*\n/g, '\n')
        .replace(/\s+/g, ' ')  // Normalize multiple spaces to single space
        .trim();

    // Identify where clauses start — we look for "1." followed by a space and a capital letter or word
    const clauseStartMatch = normalizedText.match(/(?:^|\s)(1\.\s*[A-Za-z])/);
    if (!clauseStartMatch || !clauseStartMatch.index) {
        return [];
    }

    // Trim everything before the first clause
    const clausesText = normalizedText.slice(clauseStartMatch.index).trim();

    // Match all top-level clause headings (e.g., 1., 2., 3., etc.)
    const mainClausePattern = /(?:^|\s)(\d+\.\s*[A-Za-z])/g;
    const matches = [...clausesText.matchAll(mainClausePattern)];

    if (matches.length === 0) {
        return [];
    }

    // Split text into clauses using match positions
    const clauses = matches.map((match, index) => {
        const startPos = match.index;
        const endPos = index < matches.length - 1 ? matches[index + 1].index : clausesText.length;

        // Extract clause text
        let clauseText = clausesText.slice(startPos, endPos).trim();

        // Clean up formatting
        clauseText = clauseText
            .replace(/\s+/g, ' ')
            .replace(/\s+([.,)])/g, '$1')
            .replace(/\(\s+/g, '(')
            .replace(/\s+\)/g, ')')
            .trim();

        return clauseText;
    });

    // Filter out any invalid or empty clause entries
    return clauses.filter(clause => clause.length > 0 && !/^\d+$/.test(clause));
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

        // clause count of a document, initially set to 0
        let clauses_len = 0

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

        // Extract text from each page and concatenate extraction will be slightly different for each file type
        if (myFile.fileType === 'legal_case') {
            // if the file is a legal case file, we will extract the text using a different method
            for (let i = 0; i < pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i + 1);
                const textContent = await page.getTextContent();

                // Group text items by y-coordinate (line) to preserve line structure
                const lines = {};
                for (const item of textContent.items) {
                    const y = Math.round(item.transform[5]); // y-position
                    if (!lines[y]) lines[y] = [];
                    lines[y].push(item.str);
                }

                const sortedLines = Object.keys(lines)
                    .sort((a, b) => b - a) // higher y => top of the page
                    .map(y => lines[y].join(' '));

                fullText += sortedLines.join('\n') + '\n'; // preserve line breaks
            }

        } else {
            for (let i = 0; i < pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i + 1);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => item.str).join(' ').trim();
                fullText += ' ' + text;
            }
        }

        // log the full text for debugging
        // console.log(`Full text extracted from PDF: ${fullText}`);

        // make a check what the file type is
        if (myFile.fileType === 'contract') {
            // if it is a contract find, we will process if using the contract parser
            const clauses = parseContractDocument(fullText);

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

            clauses_len = clauses.length; // Set the clause count to the number of clauses found

        } else {
            console.log('Legal case file detected, parsing with legal case parser...');
            // it is a legal case file we will parse it using the legal case parser
            const legalCase_parsed = parseLegalDocument(fullText);

            for (const clause of legalCase_parsed.clauses) {

                const embedding = await getEmbeddings(clause.text);
                vectors.push({
                    id: `${myFile._id}_clause${clause.number}`,
                    values: embedding,
                    metadata: {
                        fileId: myFile._id,
                        clauseNum: clause.number,
                        text: clause.text,
                    },
                });
            }

            // log the parsed legal case for debugging
            console.log('Parsed legal case:', legalCase_parsed);
            clauses_len = legalCase_parsed.clauses.length; // Set the clause count to the number of clauses found
        }

        // Check if any vectors were created (vectors = embeddings)
        // If no vectors were created, throw an error
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
        myFile.clauseCount = clauses_len;
        myFile.processedAt = new Date();
        await myFile.save();

        return res.status(200).json({
            message: 'File processed successfully',
            clauses: clauses_len,
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
