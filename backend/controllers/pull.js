import fs from "fs/promises";
import path from "path";
import {
  apiHeaders,
  getApiUrl,
  requireLinkedConfig,
} from "../config/arbor-config.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".Arbor");

  try {
    const config = await requireLinkedConfig();
    if (!config) return;

    const { userId, repoId } = config;
    console.log(`Pulling commits for User: ${userId}, Repo: ${repoId}...`);

    const response = await fetch(
      `${getApiUrl()}/repo/sync/pull/${userId}/${repoId}`,
      {
        headers: apiHeaders(config),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error(`❌ Pull failed: ${data.error || response.statusText}`);
      return;
    }

    const { files } = data;
    if (!files?.length) {
      console.log("No commits found on the remote repository.");
      return;
    }

    for (const file of files) {
      const localFilePath = path.join(
        repoPath,
        "commits",
        file.commitId,
        file.path,
      );

      await fs.mkdir(path.dirname(localFilePath), { recursive: true });

      const fileResponse = await fetch(file.url);
      if (!fileResponse.ok) {
        throw new Error(`Download failed for ${file.path}`);
      }

      const content = Buffer.from(await fileResponse.arrayBuffer());
      await fs.writeFile(localFilePath, content);
    }

    console.log("Pull successfully completed!");
  } catch (error) {
    console.error("An error occurred during pull execution:", error.message);
  }
}
