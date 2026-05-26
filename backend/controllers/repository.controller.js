import mongoose from "mongoose";
import { Repository } from "../models/repomodel.js";
import { Issue } from "../models/issuemodel.js";
import { User } from "../models/usermodel.js";
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
  const { id } = req.params.id;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.send("Repository doent Exist");
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
};
