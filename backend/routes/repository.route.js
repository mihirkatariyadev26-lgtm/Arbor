import express from "express";
import { repositoryController } from "../controllers/repository.controller.js";

export const reporouter = express.Router();

reporouter.post("/repo/create", repositoryController.createRepository);
reporouter.get("/repo/all", repositoryController.getAllRepository);
reporouter.get("/repo/name/:name", repositoryController.getRepositoryByName);
reporouter.get(
  "/repo/user/:userid",
  repositoryController.fetchRepositoriesForCurrentUser,
);
reporouter.put("/repo/update/:id", repositoryController.updateRepositoryByID);
reporouter.delete(
  "/repo/delete/:id",
  repositoryController.deleteRepositoryByID,
);
reporouter.get("/repo/:id", repositoryController.getRepositoryByID);
reporouter.patch("/repo/toggle/:id", repositoryController.toggleVisibilityByID);
reporouter.post("/repo/star", repositoryController.starRepository);
