// src/s3services.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

let s3Client = null;

const initializeS3Client = () => {
	if (!process.env.AWS_ACCESS_ID || !process.env.AWS_ACCESS_KEY) {
		throw new Error('AWS credentials are not properly configured');
	}

	return new S3Client({
		region: 'ap-south-1',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_ID,
			secretAccessKey: process.env.AWS_ACCESS_KEY
		}
	});
};

export const s3Upload = async (bucket, file) => {
	try {
		// Initialize S3 client if not already initialized
		if (!s3Client) {
			console.log('Initializing S3 client...');
			s3Client = initializeS3Client();
		}

		// Verify file exists
		if (!fs.existsSync(file.path)) {
			throw new Error(`File not found at path: ${file.path}`);
		}

		console.log('Reading file for S3 upload:', file.path);
		const fileStream = fs.createReadStream(file.path);

		// Add error handler to file stream
		fileStream.on('error', (error) => {
			console.error('Error reading file:', error);
			throw error;
		});

		// Generate a unique key for S3
		const key = `uploads/${Date.now()}-${path.basename(file.name)}`;

		const params = {
			Bucket: bucket,
			Key: key,
			Body: fileStream,
			ContentType: file.type || 'application/octet-stream'
		};

		console.log('Uploading to S3 with params:', {
			Bucket: params.Bucket,
			Key: params.Key,
			ContentType: params.ContentType
		});

		const data = await s3Client.send(new PutObjectCommand(params));

		// Add the file URL to the response
		data.Location = `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}`;

		console.log('S3 upload successful:', {
			Location: data.Location,
			ETag: data.ETag
		});

		return data;
	} catch (error) {
		console.error('S3 upload error:', error);
		console.error('Error stack:', error.stack);
		throw new Error(`S3 upload failed: ${error.message}`);
	}
};