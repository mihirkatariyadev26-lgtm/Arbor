import express from "express";
import { syncController } from "../controllers/sync.controller.js";
import { requireAuth, requireMatchingUser } from "../middleware/auth.middleware.js";

export const syncRouter = express.Router();

syncRouter.post(
  "/repo/sync/push/:userId/:repoId",
  requireAuth,
  requireMatchingUser,
  syncController.getPushUploadUrls,
);

syncRouter.get(
  "/repo/sync/pull/:userId/:repoId",
  requireAuth,
  requireMatchingUser,
  syncController.getPullManifest,
);
