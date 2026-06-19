import mongoose from "mongoose";
import { Repository } from "../models/repomodel.js";
import { Issue } from "../models/issuemodel.js";
import { User } from "../models/usermodel.js";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, getS3Bucket } from "../config/aws-config.js";
const createRepository = async (req, res) => {
  const { owner, name, description, content, visibility, issues } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ error: "Repository Name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid owner id format" });
    }
    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res
        .status(404)
        .json({ error: "Owner user not found. Pass a valid user _id." });
    }
    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });
    const result = await newRepository.save();
    res
      .status(201)
      .json({ messege: "repository is created", repositoryID: result._id });
  } catch (error) {
    console.error("error occured in creating  the repository ", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({ visibility: true })
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (error) {
    console.error("error occured in fetching  the repository ", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getRepositoryByID = async (req, res) => {
  const repoId = req.params.id;

  try {
    res.set("Cache-Control", "no-store");
    const repository = await Repository.find({ _id: repoId })
      .populate("owner")
      .populate("issues");
    return res.json(repository);
  } catch (error) {
    console.log("Error during fetching the repository(ID)", error);
    res.status(500).send("internal server error");
  }
  res.send("Resitory detail is fetched");
};
const getRepositoryByName = async (req, res) => {
  const repoName = req.params.name;

  try {
    const repository = await Repository.find({ name: repoName })
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (E) {
    console.log("error during fetching repository(name)", E);
    return res.status(500).send("Internal server error");
  }
};
const fetchRepositoriesForCurrentUser = async (req, res) => {
  const { userid } = req.params;

  // Validate userid is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userid)) {
    return res.status(400).json({ error: "Invalid user id format" });
  }

  try {
    const repositories = await Repository.find({ owner: userid })
      .populate("owner", "-password")
      .populate("issues");

    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ message: "No repositories found!" });
    }

    return res.json(repositories);
  } catch (error) {
    console.log("error during fetching user repository", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
const updateRepositoryByID = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.send("repository doesn't exists");
    }
    repository.content = content;
    repository.description = description;
    const updatedRepository = await repository.save();
    return res.json({ message: "Repository Updated", updatedRepository });
  } catch (E) {
    console.log("error during Updating repository", E);
    return res.status(500).send("Internal server error");
  }
};
const toggleVisibilityByID = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    // console.log(id);
    if (!repository) {
      return res.status(404).send("Repository doent Exist");
    }
    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();
    return res.json({
      message: "Visibility toggled successfully",
      updatedRepository,
    });
  } catch (E) {
    console.log("error during Updating repository", E);
    return res.status(500).send("Internal server error");
  }
};
const deleteRepositoryByID = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.json("message repository not found");
    }
    return res.send("Repository Deleted!");
  } catch (E) {
    console.log("error during deleting repository", E);
    return res.status(500).send("Internal server error");
  }
};
const starRepository = async (req, res) => {
  const { repoId, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isStarred = user.starRepos.some(
      (id) => id.toString() === repoId.toString(),
    );

    const update = isStarred
      ? { $pull: { starRepos: repoId } }
      : { $addToSet: { starRepos: repoId } };

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

function buildNestedTree(fileEntries) {
  const root = [];
  for (const item of fileEntries) {
    const parts = item.path.split("/");
    let currentLevel = root;
    let accumulatedPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
      const isFile = i === parts.length - 1;

      let existingNode = currentLevel.find((node) => node.name === part);

      if (!existingNode) {
        existingNode = {
          name: part,
          type: isFile ? "file" : "folder",
          path: accumulatedPath,
          children: isFile ? null : [],
        };
        if (isFile) {
          existingNode.commitId = item.commitId;
        }
        currentLevel.push(existingNode);
      } else if (isFile) {
        existingNode.commitId = item.commitId;
      }

      if (!isFile) {
        currentLevel = existingNode.children;
      }
    }
  }

  const sortTreeNodes = (nodes) => {
    if (!nodes) return;
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => sortTreeNodes(node.children));
  };

  sortTreeNodes(root);
  return root;
}

async function getLatestCommitFromRemote(req, res) {
  const { userId, repoId } = req.params;

  if (!userId || !repoId) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  const prefix = `users/${userId}/${repoId}/commits/`;

  try {
    res.set("Cache-Control", "no-store");
    const command = new ListObjectsV2Command({
      Bucket: getS3Bucket(),
      Prefix: prefix,
    });
    const data = await s3.send(command);
    const objects = data.Contents || [];

    if (objects.length === 0) {
      return res
        .status(404)
        .json({ message: "No commits found on remote storage." });
    }

    const commitTimes = new Map();
    for (const obj of objects) {
      if (!obj.Key) continue;
      const relative = obj.Key.slice(prefix.length);
      const slashIndex = relative.indexOf("/");
      if (slashIndex === -1) continue;

      const commitId = relative.slice(0, slashIndex);
      const lastModified = obj.LastModified || new Date(0);
      const previous = commitTimes.get(commitId);
      if (!previous || lastModified > previous) {
        commitTimes.set(commitId, lastModified);
      }
    }

    if (commitTimes.size === 0) {
      return res
        .status(404)
        .json({ message: "No commits found on remote storage." });
    }

    let latestCommit = null;
    let latestTime = null;
    for (const [commitId, modifiedAt] of commitTimes) {
      if (!latestTime || modifiedAt > latestTime) {
        latestTime = modifiedAt;
        latestCommit = commitId;
      }
    }

    return res.status(200).json({ latestCommit });
  } catch (error) {
    console.error("getLatestCommitFromRemote:", error);
    return res
      .status(500)
      .json({ error: "Failed to resolve latest commit from storage." });
  }
}

async function getRepositoryTree(req, res) {
  // Extract all three identifiers from the request URL
  const { userId, repoId, commitId } = req.params;

  if (!userId || !repoId || !commitId) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // Instead of querying just one commit, we list all commits for the repo
    const targetPrefix = `users/${userId}/${repoId}/commits/`;

    const command = new ListObjectsV2Command({
      Bucket: getS3Bucket(),
      Prefix: targetPrefix,
    });

    const data = await s3.send(command);

    if (!data.Contents || data.Contents.length === 0) {
      return res
        .status(404)
        .json({ message: "No files found for this commit." });
    }

    const fileMap = new Map();

    for (const obj of data.Contents) {
      if (!obj.Key) continue;
      const relative = obj.Key.slice(targetPrefix.length);
      const slashIndex = relative.indexOf("/");
      if (slashIndex === -1) continue;

      const fileCommitId = relative.slice(0, slashIndex);
      const filePath = relative.slice(slashIndex + 1);
      const lastModified = obj.LastModified || new Date(0);

      const existing = fileMap.get(filePath);
      if (!existing || lastModified > existing.lastModified) {
        fileMap.set(filePath, { fileCommitId, lastModified });
      }
    }

    const fileEntries = Array.from(fileMap.entries()).map(([path, fileData]) => ({
      path,
      commitId: fileData.fileCommitId,
    }));

    const structuredFolderTree = buildNestedTree(fileEntries);

    return res.status(200).json({ tree: structuredFolderTree });
  } catch (error) {
    console.error("Error inside getRepositoryTree backend controller:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate repository file tree." });
  }
}
const getFileContent = async (req, res) => {
  // 1. Extract IDs from the URL params
  const { userId, repoId, commitId } = req.params;

  // 2. Extract the file path from the Query string (e.g., ?path=package.json)
  const filePath = req.query.path;

  if (!userId || !repoId || !commitId || !filePath) {
    return res
      .status(400)
      .json({ error: "Missing required parameters or file path." });
  }

  try {
    // 3. Construct the exact exact S3 key for this specific file
    const targetKey = `users/${userId}/${repoId}/commits/${commitId}/${filePath}`;

    const command = new GetObjectCommand({
      Bucket: getS3Bucket(),
      Key: targetKey,
    });

    const data = await s3.send(command);

    // 4. AWS SDK v3 provides a handy method to convert the stream directly to a string
    const fileContent = await data.Body.transformToString("utf-8");

    // 5. Send the raw text content back to the frontend
    return res.status(200).json({ content: fileContent });
  } catch (error) {
    // AWS throws a specific error name if the file doesn't exist
    if (error.name === "NoSuchKey") {
      return res.status(404).json({ error: "File not found in S3 storage." });
    }

    console.error("Error fetching file content from S3:", error);
    return res.status(500).json({ error: "Failed to fetch file content." });
  }
};
export const repositoryController = {
  createRepository,
  getAllRepository,
  getRepositoryByID,
  getRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryByID,
  toggleVisibilityByID,
  deleteRepositoryByID,
  starRepository,
  getLatestCommitFromRemote,
  getRepositoryTree,
  getFileContent,
};
