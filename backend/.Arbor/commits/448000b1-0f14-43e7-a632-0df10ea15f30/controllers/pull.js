import fs from "fs/promises";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const configPath = path.join(repoPath, "config.json");

  try {
    // 1. Read the config file to get both parameters
    let config;
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      config = JSON.parse(configContent);
    } catch (err) {
      console.error(
        "Error: config.json not found. Please run the login and link commands first.",
      );
      return;
    }

    const { userId, repoId } = config;

    // Guard clauses to ensure the environment is initialized
    if (!userId) {
      console.error(
        "Error: userId not found in config.json. Please run 'node index.js login' first.",
      );
      return;
    }
    if (!repoId) {
      console.error(
        "Error: repoId not found in config.json. Please link your repository URL first.",
      );
      return;
    }

    console.log(`Pulling commits for User: ${userId}, Repo: ${repoId}...`);

    // 2. Fetch object lists using your custom scoped prefix
    const s3Prefix = `users/${userId}/${repoId}/commits/`;

    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: s3Prefix,
      }),
    );

    const objects = data.Contents;
    if (!objects || objects.length === 0) {
      console.log("No commits found on S3 for this repository.");
      return;
    }

    // 3. Process downloads and reconstruct local paths
    for (const object of objects) {
      const key = object.Key;

      // Skip folders metadata keys if any
      if (key.endsWith("/")) continue;

      // Clean the key: Convert "users/userId/repoId/commits/abc/file.txt" -> "commits/abc/file.txt"
      const localRelativePath = key.replace(s3Prefix, "commits/");
      const localFilePath = path.join(repoPath, localRelativePath);

      // Ensure local folders exist inside .Arbor/commits/...
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });

      // Download payload
      const params = { Bucket: S3_BUCKET, Key: key };
      const fileContent = await s3.send(new GetObjectCommand(params));
      const byteArray = await fileContent.Body.transformToByteArray();

      // Save locally
      await fs.writeFile(localFilePath, Buffer.from(byteArray));
    }

    console.log("Pull successfully completed from AWS S3!");
  } catch (error) {
    console.error("An error occurred during pull execution:", error.message);
  }
}
