import fs from "fs/promises";
import path from "path";
import {
  apiHeaders,
  getApiUrl,
  requireLinkedConfig,
} from "../config/arbor-config.js";

const UPLOAD_BATCH_SIZE = 100;

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

async function requestUploadUrls(config, files) {
  const { userId, repoId } = config;
  const response = await fetch(
    `${getApiUrl()}/repo/sync/push/${userId}/${repoId}`,
    {
      method: "POST",
      headers: apiHeaders(config, { "Content-Type": "application/json" }),
      body: JSON.stringify({ files }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to prepare upload.");
  }

  return data.uploads;
}

export async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const config = await requireLinkedConfig();
    if (!config) return;

    const { userId, repoId } = config;
    console.log(`Pushing commits for User: ${userId}, Repo: ${repoId}...`);

    const commitDirs = await fs.readdir(commitsPath);
    const pendingUploads = [];

    for (const commitDir of commitDirs) {
      const currentCommitPath = path.join(commitsPath, commitDir);
      const stat = await fs.stat(currentCommitPath);
      if (!stat.isDirectory()) continue;

      const files = await getFilesRecursively(currentCommitPath);
      for (const file of files) {
        const relativePath = path.relative(currentCommitPath, file);
        pendingUploads.push({
          commitId: commitDir,
          path: relativePath.replace(/\\/g, "/"),
          localPath: file,
        });
      }
    }

    if (pendingUploads.length === 0) {
      console.log("No commits to push.");
      return;
    }

    for (let i = 0; i < pendingUploads.length; i += UPLOAD_BATCH_SIZE) {
      const batch = pendingUploads.slice(i, i + UPLOAD_BATCH_SIZE);
      const uploads = await requestUploadUrls(
        config,
        batch.map(({ commitId, path: filePath }) => ({
          commitId,
          path: filePath,
        })),
      );

      await Promise.all(
        uploads.map(async (upload) => {
          const local = batch.find(
            (item) =>
              item.commitId === upload.commitId && item.path === upload.path,
          );
          if (!local) return;

          const body = await fs.readFile(local.localPath);
          const response = await fetch(upload.url, {
            method: "PUT",
            body,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${upload.path}`);
          }
        }),
      );
    }

    console.log("🚀 Push successfully completed!");
  } catch (error) {
    console.error("❌ An error occurred during push execution:", error.message);
  }
}
