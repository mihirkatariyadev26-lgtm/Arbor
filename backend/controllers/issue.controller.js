import mongoose from "mongoose";
import { Repository } from "../models/repomodel.js";
import { Issue } from "../models/issuemodel.js";
import { User } from "../models/usermodel.js";
const createIssue = async (req, res) => {
  const { title, description, owner, ownerName } = req.body;
  const { id } = req.params; //repository id
  try {
    const issue = new Issue({
      title,
      description,
      Repository: id,
      owner: owner,
      ownerName: ownerName,
    });
    await issue.save();
    await Repository.findByIdAndUpdate(id, {
      $push: { issues: issue._id },
    });
    return res.status(201).json(issue);
  } catch (e) {
    console.log("error during creating an issue", e);
    return res.status(500).send("Internal Server Error");
  }
};
const updateIssue = async (req, res) => {
  const { id } = req.params; //issue id
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json("Issue not found");
    }
    issue.title = title;
    issue.description = description;
    issue.status = status;
    const updatedIssue = await issue.save();
    return res.json(updatedIssue);
  } catch (e) {
    console.log("error during updating an issue", e);
    return res.status(500).send("Internal Server Error");
  }
};
const deleteIssue = async (req, res) => {
  const { id } = req.params; //issue id
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      return res.json({ messege: "Issue not found", issue });
    }
    return res.json({ messege: "Issue is deleted" });
  } catch (e) {
    console.log("Error during deleting an issue", e);
    return res.json({ error: "internal server error" });
  }
};
const getIssueForRepository = async (req, res) => {
  try {
    const { repoId } = req.params;
    if (!repoId) {
      return res.status(400).send("Inefficient Data:[repository ID]");
    }
    const issues = await Issue.find({ Repository: repoId });
    res.json(issues);
  } catch (e) {
    console.log("Error while Fetching repository Specific Issues", e);
    res.status(500).send("Internal Server Error");
  }
};
const getAllIssues = async (req, res) => {
  const { id } = req.params; //repository id
  try {
    const issues = await Issue.find({ Repository: id });
    if (!issues) {
      return res.status(404).json({ messege: "No issues found" });
    }
    return res.status(200).json(issues);
  } catch (e) {
    console.log("Error during getting all issues", e);
    return res.status(500).json({ messege: "Internal Server Error" });
  }
};
const getIssue = async (req, res) => {
  const { id } = req.params; //issue id
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json("Issue not found");
    }
    return res.json(issue);
  } catch (e) {
    console.log("error during findind an issue by id", e);
    return res.status(500).send("Internal Server Error");
  }
};
export const issueController = {
  createIssue,
  updateIssue,
  deleteIssue,
  getAllIssues,
  getIssue,
  getIssueForRepository,
};
