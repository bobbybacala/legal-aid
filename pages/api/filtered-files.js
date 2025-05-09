import { connectDB } from "@/src/db";
import MyFileModel from "@/src/models/myfile.js";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fileType, filterKey, filterValue } = req.query;

    if (!fileType || !['contract', 'legal_case'].includes(fileType)) {
        return res.status(400).json({ message: 'Invalid or missing fileType. Must be "contract" or "legal_case".' });
    }

    try {
        await connectDB();

        const query = { fileType };

        if (filterKey && filterValue) {
            if (filterKey === 'date') {
                // ensure the date is in the correct format
                query.date = new Date(filterValue);
            } else {
                query[filterKey] = { $regex: filterValue, $options: 'i' }; // case-insensitive search
            }
        }

        const files = await MyFileModel.find(query).sort({ createdAt: -1 });     // Sort by most recent first
        return res.status(200).json({ files })
    } catch (error) {
        console.error('Error fetching filtered files:', error);
        return res.status(500).json({ error: 'Failed to fetch filtered files' });
    }
}