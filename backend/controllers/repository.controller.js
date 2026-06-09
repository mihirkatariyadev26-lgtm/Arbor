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

function buildNestedTree(flatPaths) {
  const root = [];
  for (const item of flatPaths) {
    const parts = item.split("/");
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
        currentLevel.push(existingNode);
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

async function getRepositoryTree(req, res) {
  // 1. Extract all three identifiers from the request URL
  const { userId, repoId, commitId } = req.params;

  if (!userId || !repoId || !commitId) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    // 2. Build the precise S3 prefix matching your push.js architecture
    const targetPrefix = `users/${userId}/${repoId}/commits/${commitId}/`;

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

    // 3. Strip out the long AWS user/repo prefix so the frontend just gets the file tree
    const flatPaths = data.Contents.map((obj) =>
      obj.Key.replace(targetPrefix, ""),
    ).filter((path) => path.trim() !== "");

    const structuredFolderTree = buildNestedTree(flatPaths);

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
  getRepositoryTree,
  getFileContent,
};
