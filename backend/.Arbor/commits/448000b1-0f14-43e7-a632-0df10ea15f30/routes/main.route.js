import express from "express";
import { userRouter } from "./user.router.js";
import { reporouter } from "./repository.route.js";
import { issueRourter } from "./issue.router.js";

export const mainRouter = express.Router();
mainRouter.use(userRouter);
mainRouter.use(reporouter);
mainRouter.use(issueRourter);
mainRouter.get("/", (req, res) => {
  res.send("welcome");
});
