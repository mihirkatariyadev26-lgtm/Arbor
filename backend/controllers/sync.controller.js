import {
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, getS3Bucket } from "../config/aws-config.js";
import { Repository } from "../models/repomodel.js";

const PRESIGN_TTL_SECONDS = 3600;

function s3Key(userId, repoId, commitId, filePath) {
  return `users/${userId}/${repoId}/commits/${commitId}/${filePath.replace(/\\/g, "/")}`;
}

async function getPushUploadUrls(req, res) {
  const { userId, repoId } = req.params;
  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "files array is required." });
  }

  const bucket = getS3Bucket();
  if (!bucket) {
    return res.status(500).json({ error: "S3 is not configured on the server." });
  }

  try {
    const uploads = await Promise.all(
      files.map(async ({ commitId, path: filePath }) => {
        if (!commitId || !filePath) {
          throw new Error("Each file needs commitId and path.");
        }

        const key = s3Key(userId, repoId, commitId, filePath);
        const command = new PutObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(s3, command, {
          expiresIn: PRESIGN_TTL_SECONDS,
        });

        return { commitId, path: filePath, key, url };
      }),
    );

    await syncCommitMetadataToDb(repoId, files);

    return res.status(200).json({ uploads });
  } catch (error) {
    console.error("getPushUploadUrls:", error.message);
    return res.status(500).json({ error: "Failed to prepare upload URLs." });
  }
}

async function syncCommitMetadataToDb(repoId, files) {
  const commitIds = [...new Set(files.map((f) => f.commitId).filter(Boolean))];
  if (commitIds.length === 0) return;

  try {
    const repo = await Repository.findById(repoId);
    if (!repo) return;

    const knownCommits = new Set(
      repo.commits.flatMap((entry) => [
        entry.latestCommit,
        ...(entry.commitIdList || []),
      ]),
    );

    for (const commitId of commitIds) {
      if (knownCommits.has(commitId)) continue;
      repo.commits.push({
        commitDate: new Date(),
        commitIdList: [commitId],
        latestCommit: commitId,
      });
      knownCommits.add(commitId);
    }

    await repo.save();
  } catch (error) {
    console.error("syncCommitMetadataToDb:", error.message);
  }
}

async function getPullManifest(req, res) {
  const { userId, repoId } = req.params;
  const bucket = getS3Bucket();

  if (!bucket) {
    return res.status(500).json({ error: "S3 is not configured on the server." });
  }

  const prefix = `users/${userId}/${repoId}/commits/`;

  try {
    const data = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }),
    );

    const objects = data.Contents || [];
    if (objects.length === 0) {
      return res.status(200).json({ files: [] });
    }

    const files = await Promise.all(
      objects
        .filter((obj) => obj.Key && !obj.Key.endsWith("/"))
        .map(async (obj) => {
          const relative = obj.Key.replace(prefix, "");
          const slashIndex = relative.indexOf("/");
          const commitId = relative.slice(0, slashIndex);
          const filePath = relative.slice(slashIndex + 1);

          const command = new GetObjectCommand({ Bucket: bucket, Key: obj.Key });
          const url = await getSignedUrl(s3, command, {
            expiresIn: PRESIGN_TTL_SECONDS,
          });

          return { commitId, path: filePath, url };
        }),
    );

    return res.status(200).json({ files });
  } catch (error) {
    console.error("getPullManifest:", error.message);
    return res.status(500).json({ error: "Failed to list remote commits." });
  }
}

export const syncController = {
  getPushUploadUrls,
  getPullManifest,
};
