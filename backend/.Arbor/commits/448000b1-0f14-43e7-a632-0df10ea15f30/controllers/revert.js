import fs from "fs/promises";
import path from "path";
import { applyDelta } from "fossil-delta";

async function reconstructFile(commitId, relativePath, repoPath) {
  const commitPath = path.join(repoPath, "commits");
  const currentCommitDir = path.join(commitPath, commitId);
  const manifestPath = path.join(currentCommitDir, "commit.json");

  let manifest;
  try {
    const data = await fs.readFile(manifestPath, "utf-8");
    manifest = JSON.parse(data);
  } catch {
    return null;
  }

  const fileInfo = manifest.files[relativePath];
  if (!fileInfo) return null;

  const tempPath = path.join(repoPath, ".temp");
  await fs.mkdir(tempPath, { recursive: true });
  const outPath = path.join(
    tempPath,
    `${commitId}-${path.basename(relativePath)}`,
  );

  if (fileInfo.type === "full") {
    const fullFilePath = path.join(currentCommitDir, relativePath);
    await fs.copyFile(fullFilePath, outPath);
    return outPath;
  }

  if (fileInfo.type === "vcdiff") {
    const parentFile = await reconstructFile(
      manifest.parentCommit,
      relativePath,
      repoPath,
    );
    if (!parentFile) return null;

    const patchFile = path.join(currentCommitDir, relativePath + ".vcdiff");

    // Apply delta in pure JS — no system binary needed
    const parentBuffer = await fs.readFile(parentFile);
    const patchBuffer = await fs.readFile(patchFile);
    const result = applyDelta(
      new Uint8Array(parentBuffer),
      new Uint8Array(patchBuffer),
    );
    await fs.writeFile(outPath, Buffer.from(result));

    return outPath;
  }
  return null;
}

export async function revertRepo(commitId) {
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const commitPath = path.join(repoPath, "commits");
  const projectRoot = path.resolve(repoPath, "../");

  try {
    const commitDir = path.join(commitPath, commitId);
    await fs.access(commitDir);

    const manifestPath = path.join(commitDir, "commit.json");
    const data = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(data);

    const tempPath = path.join(repoPath, ".temp");
    await fs.mkdir(tempPath, { recursive: true });

    for (const relativePath of Object.keys(manifest.files)) {
      const reconstructedPath = await reconstructFile(
        commitId,
        relativePath,
        repoPath,
      );
      if (reconstructedPath) {
        const destPath = path.join(projectRoot, relativePath);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(reconstructedPath, destPath);
      }
    }

    await fs.rm(tempPath, { recursive: true, force: true });
    console.log(`Successfully Reverted to the Commit ${commitId}`);
  } catch (error) {
    console.error(error);
  }
}
