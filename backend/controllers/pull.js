import fs from "fs/promises";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".Arbor");

  try {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      }),
    );

    const objects = data.Contents;
    if (objects) {
      for (const object of objects) {
        const key = object.Key;
        const localFilePath = path.join(repoPath, key);
        await fs.mkdir(path.dirname(localFilePath), { recursive: true });

        const params = { Bucket: S3_BUCKET, Key: key };
        const fileContent = await s3.send(new GetObjectCommand(params));
        const byteArray = await fileContent.Body.transformToByteArray();
        await fs.writeFile(localFilePath, Buffer.from(byteArray));
      }
    }
  } catch (error) {
    console.error(error);
  }
}
