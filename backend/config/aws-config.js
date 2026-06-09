import { S3Client } from "@aws-sdk/client-s3";
import "./load-env.js";

function env(name) {
  return process.env[name]?.trim() || undefined;
}

export function getS3Bucket() {
  return env("S3_BUCKET");
}

export function getAwsRegion() {
  return env("AWS_REGION") || "ap-south-1";
}

export function getAwsCredentials() {
  return {
    accessKeyId: env("AWS_ACCESS_KEY_ID"),
    secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
  };
}

export const s3 = new S3Client({
  region: getAwsRegion(),
  credentials: getAwsCredentials(),
});
