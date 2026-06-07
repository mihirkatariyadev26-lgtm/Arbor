import fs from "fs/promises";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { configDotenv } from "dotenv";

async function getFilesRecursively(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getFilesRecursively(res) : res;
    }),
  );
  return files.flat();
}

export async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  try {
    // 1. Read the local .Arbor/config.json file for both userId and repoId
    let config;
    try {
      const configContent = await fs.readFile(configPath, "utf-8");
      config = JSON.parse(configContent);
    } catch (err) {
      console.error(
        "❌ Error: config.json not found. Please run the login and link commands first.",
      );
      return;
    }

    const { userId, repoId } = config;

    // 2. Validate that the user is logged in
    if (!userId) {
      console.error(
        "❌ Error: userId not found. Please run 'node index.js login' first.",
      );
      return;
    }

    // 3. Validate that the repo is linked
    if (!repoId) {
      console.error(
        "❌ Error: repoId not found. Please run 'node index.js link <URL>' first.",
      );
      return;
    }

    console.log(`Pushing commits for User: ${userId}, Repo: ${repoId}...`);

    // 4. Scan commits directory and upload files
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const currentCommitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(currentCommitPath);
      if (!stat.isDirectory()) continue;

      const files = await getFilesRecursively(currentCommitPath);
      for (const file of files) {
        const relativePath = path.relative(currentCommitPath, file);
        const fileContent = await fs.readFile(file);

        // Dynamic S3 key structural formatting targeting your exact blueprint requirements
        const s3Key = `users/${userId}/${repoId}/commits/${commitDir}/${relativePath.replace(/\\/g, "/")}`;

        const params = {
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: fileContent,
        };

        await s3.send(new PutObjectCommand(params));
      }
    }
    console.log("🚀 Push successfully completed to AWS S3!");
  } catch (error) {
    console.error("❌ An error occurred during push execution:", error.message);
  }
}
