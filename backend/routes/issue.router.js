import express from "express";
import { issueController } from "../controllers/issue.controller.js";
export const issueRourter = express.Router();
issueRourter.post("/issue/create/:id", issueController.createIssue);
issueRourter.put("/issue/update/:id", issueController.updateIssue);
issueRourter.delete("/issue/delete/:id", issueController.deleteIssue);
issueRourter.get("/issue/all/:id", issueController.getAllIssues);
issueRourter.get("/issue/repo/:repoId", issueController.getIssueForRepository);
issueRourter.get("/issue/:id", issueController.getIssue);
