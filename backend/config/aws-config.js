import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

// Force load the .env file from the root directory
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const S3_BUCKET = process.env.S3_BUCKET;

export const s3 = new S3Client({
  region: region || "ap-south-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});
