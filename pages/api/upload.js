// pages/api/upload.js
import formidable from 'formidable';
import { connectDB, disconnectDB } from '@/src/db';
import MyFileModel from '@/src/models/myfile.js';
import slugify from 'slugify';
import pinecone from "../../src/pinecone.js";
import { s3Upload } from "@/src/s3services";
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseFile = async (req) => {
    return new Promise((resolve, reject) => {
        // Use OS temp directory instead of hardcoded path
        const uploadDir = path.join(os.tmpdir(), 'uploads');

        // Create upload directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const options = {
            uploadDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB
            filename: (name, ext, part, form) => {
                // Generate unique filename
                return `${Date.now()}-${part.originalFilename}`;
            },
        };

        const form = formidable(options);

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                reject(err);
                return;
            }
            resolve({ fields, files });
        });
    });
};

// function to create index
const createIndex = async (indexName) => {
    // fetch the already created indexes
    const indexesObj = await pinecone.listIndexes()

    // check if there is already an index created of the current indexName
    if (Array.isArray(indexesObj.indexes)) {

        // get the array of indexes
        const indexesArray = indexesObj.indexes

        // check in the array that if already exist or not
        if (!indexesArray.includes(indexName)) {
            console.log(`Index ${indexName} does not exist. Creating it...`);

            // create the index
            await pinecone.createIndex({
                name: indexName,
                dimension: 768, // Fixed for Gemini embeddings

                // the spec attribute
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-east-1'
                    }
                },
                // createRequest: {
                //     name: indexName,
                //     dimension: 1536, // Fixed for OpenAI embeddings
                // },
            });
            console.log(`Index ${indexName} created successfully.`);
        } else {
            console.log(`Index ${indexName} already exists.`);
        }
    } else {
        throw new Error(`Unexpected response from Pinecone: ${JSON.stringify(indexes)}`);
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let uploadedFilePath = null;

    try {
        console.log('Starting file upload process...');

        // Parse the multipart form data
        const { files } = await parseFile(req);
        console.log('Files received:', files);

        // In newer versions of formidable, files.file is an array
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file) {
            console.error('No file found in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        uploadedFilePath = file.filepath;

        console.log('File details:', {
            originalFilename: file.originalFilename,
            filepath: file.filepath,
            mimetype: file.mimetype,
            size: file.size
        });

        // Validate the file
        if (!file.originalFilename || !file.filepath) {
            console.error('Missing file properties:', file);
            return res.status(400).json({ error: 'Invalid file data' });
        }

        // Check file size
        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size too large (max 10MB)' });
        }

        // Check file type
        if (!file.mimetype || !file.mimetype.includes('pdf')) {
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        // Prepare file data for S3
        const fileData = {
            name: file.originalFilename,
            path: file.filepath,
            type: file.mimetype,
            size: file.size
        };

        // Connect to MongoDB
        await connectDB();

        try {
            // Upload to S3
            console.log('Uploading to S3...');
            const s3Response = await s3Upload(process.env.S3_BUCKET, fileData);
            console.log('S3 upload response:', s3Response);

            // Create Pinecone index
            const filenameWithoutExt = fileData.name.split('.')[0];
            const filenameSlug = slugify(filenameWithoutExt, { lower: true, strict: true });

            // await pinecone();
            console.log('Creating Pinecone index:', filenameSlug);
            await createIndex(filenameSlug);

            // Save to MongoDB
            const myFile = new MyFileModel({
                fileName: fileData.name,
                fileUrl: s3Response.Location,
                vectorIndex: filenameSlug,
            });

            await myFile.save();
            console.log('File info saved to MongoDB');

            return res.status(200).json({
                message: 'File uploaded successfully',
                file: {
                    name: fileData.name,
                    url: s3Response.Location,
                    vectorIndex: filenameSlug
                }
            });

        } finally {
            // Clean up the temporary file
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                try {
                    fs.unlinkSync(uploadedFilePath);
                    console.log('Temporary file cleaned up:', uploadedFilePath);
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
            }
        }

    } catch (error) {
        console.error('Upload handler error:', error);
        return res.status(500).json({
            error: error.message || 'File upload failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        try {
            // await disconnectDB();
        } catch (error) {
            console.error('Error disconnecting from DB:', error);
        }
    }
}