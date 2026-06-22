import fs from "fs/promises";
import path from "path";
import { createDelta } from "fossil-delta";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"; // <-- NEW: Node.js built-in hashing library

// HELPER: Generate a unique fingerprint for a file
async function getFileHash(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

async function getFilesRecursively(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getFilesRecursively(res) : res;
      }),
    );
    return files.flat();
  } catch {
    return [];
  }
}

export async function commitRepo(Message) {
  const repoPath = path.resolve(process.cwd(), ".Arbor");
  const stagePath = path.join(repoPath, ".Staging");
  const commitPath = path.join(repoPath, "commits");
  const headPath = path.join(repoPath, "HEAD");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);

    const stagedFiles = await getFilesRecursively(stagePath);
    if (stagedFiles.length === 0) {
      console.log("Nothing to commit, staging area is empty.");
      return;
    }

    let lastCommitId = null;
    let parentCommitMeta = null;

    // Load the last commit's metadata so we can compare fingerprints
    try {
      const headContent = await fs.readFile(headPath, "utf-8");
      if (headContent.trim()) {
        lastCommitId = headContent.trim();
        const parentMetaStr = await fs.readFile(
          path.join(commitPath, lastCommitId, "commit.json"),
          "utf-8",
        );
        parentCommitMeta = JSON.parse(parentMetaStr);
      }
    } catch (e) {}

    await fs.mkdir(commitDir, { recursive: true });
    const fileTrackingMap = {};
    let newlyModifiedCount = 0;

    for (const file of stagedFiles) {
      const relativePath = path.relative(stagePath, file);
      const destPath = path.join(commitDir, relativePath);

      // 1. Calculate the fingerprint of the file currently in staging
      const currentHash = await getFileHash(file);

      // 2. SMART CHECK: Did this file actually change since the last commit?
      if (parentCommitMeta && parentCommitMeta.files[relativePath]) {
        const previousHash = parentCommitMeta.files[relativePath].hash;

        if (currentHash === previousHash) {
          // FILE IS UNCHANGED!
          // We completely skip creating a file in the new commit folder.
          fileTrackingMap[relativePath] = {
            type: "unchanged",
            hash: currentHash,
            originalCommit:
              parentCommitMeta.files[relativePath].originalCommit ||
              lastCommitId,
          };
          continue; // Skip the rest of the loop for this file
        }
      }

      // 3. If we reach here, the file is either BRAND NEW or MODIFIED
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      newlyModifiedCount++;

      let parentFilePath = lastCommitId
        ? path.join(commitPath, lastCommitId, relativePath)
        : null;
      let fileExistedBefore = false;

      // Check if a previous version exists to diff against
      if (parentFilePath) {
        try {
          await fs.access(parentFilePath);
          fileExistedBefore = true;
        } catch {
          try {
            await fs.access(parentFilePath + ".vcdiff");
            parentFilePath = parentFilePath + ".vcdiff";
            fileExistedBefore = true;
          } catch {}
        }
      }

      if (fileExistedBefore) {
        const patchDestPath = destPath + ".vcdiff";
        try {
          // Read both files as Buffers and compute delta in pure JS
          const parentBuffer = await fs.readFile(parentFilePath);
          const currentBuffer = await fs.readFile(file);
          const delta = createDelta(
            new Uint8Array(parentBuffer),
            new Uint8Array(currentBuffer),
          );
          await fs.writeFile(patchDestPath, Buffer.from(delta));
          fileTrackingMap[relativePath] = {
            type: "vcdiff",
            hash: currentHash,
            originalCommit: commitId,
          };
        } catch (error) {
          // Fallback if binary diff fails
          await fs.copyFile(file, destPath);
          fileTrackingMap[relativePath] = {
            type: "full",
            hash: currentHash,
            originalCommit: commitId,
          };
        }
      } else {
        await fs.copyFile(file, destPath);
        fileTrackingMap[relativePath] = {
          type: "full",
          hash: currentHash,
          originalCommit: commitId,
        };
      }
    }

    // Identify files that were in the parent commit but are no longer in staging (deleted files)
    if (parentCommitMeta && parentCommitMeta.files) {
      for (const oldFilePath in parentCommitMeta.files) {
        if (!fileTrackingMap[oldFilePath]) {
          const oldFileMeta = parentCommitMeta.files[oldFilePath];
          // Only mark as deleted if it wasn't already deleted in the parent
          if (oldFileMeta.type !== "deleted") {
            fileTrackingMap[oldFilePath] = {
              type: "deleted",
              hash: oldFileMeta.hash,
              originalCommit: lastCommitId,
            };
          }
        }
      }
    }

    // Save the new metadata blueprint
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(
        {
          Message,
          date: new Date().toISOString(),
          parentCommit: lastCommitId,
          files: fileTrackingMap,
        },
        null,
        2,
      ),
    );

    await fs.writeFile(headPath, commitId);

    // Clear staging area for the next time
    await fs.rm(stagePath, { recursive: true, force: true });
    await fs.mkdir(stagePath, { recursive: true });

    console.log(`✅ Commit successful! ID: ${commitId}`);
    console.log(
      `📊 Processed ${stagedFiles.length} files (${newlyModifiedCount} modified, ${stagedFiles.length - newlyModifiedCount} unchanged)`,
    );
  } catch (error) {
    console.error("Error during commit process:", error);
  }
}
