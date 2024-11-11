
// to connect to S3 to amazon
import AWS from "aws-sdk"
import fs from "fs"

// create the s3 object
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    region: 'ap-south-1'
})

// the upload file to s3 function
export const s3Upload = async (bucket, file) => {
	const params = {
		Bucket: bucket,
		Key: file.name,
		Body: fs.createReadStream(file.path),
	};

	return await s3.upload(params).promise()
}