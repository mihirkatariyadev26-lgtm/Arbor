import express from "express";
import { userRouter } from "./user.router.js";
import { reporouter } from "./repository.route.js";
import { issueRourter } from "./issue.router.js";
import { syncRouter } from "./sync.route.js";

export const mainRouter = express.Router();
mainRouter.use(express.json({ limit: "2mb" }));
mainRouter.use(userRouter);
mainRouter.use(reporouter);
mainRouter.use(issueRourter);
mainRouter.use(syncRouter);
mainRouter.get("/", (req, res) => {
  res.send("welcome");
});
