// to get the list of the file names in the mongo db

import { connectDB, disconnectDB } from "@/src/db";
import MyFileModel from "@/src/models/myfile";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let dbConnection = false;

    try {
        // Connect to MongoDB
        await connectDB();
        dbConnection = true;

        const files = await MyFileModel.find({});

        return res.status(200).json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        return res.status(500).json({ message: 'Error fetching files' });
    } finally {
        // Always disconnect from DB if we connected
        if (dbConnection) {
            // await disconnectDB();
        }
    }
}