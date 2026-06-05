import fs from "fs/promises";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/aws-config.js";

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

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) {
      const currentCommitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(currentCommitPath);
      if (!stat.isDirectory()) continue;

      const files = await getFilesRecursively(currentCommitPath);
      for (const file of files) {
        const relativePath = path.relative(currentCommitPath, file);
        const fileContent = await fs.readFile(file);
        const s3Key = `commits/${commitDir}/${relativePath.replace(/\\/g, "/")}`;

        const params = {
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: fileContent,
        };

        await s3.send(new PutObjectCommand(params));
      }
    }
  } catch (error) {
    console.error(error);
  }
}
