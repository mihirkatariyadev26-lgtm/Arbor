import mongoose, { Schema } from "mongoose";
import { Repository } from "./repomodel.js";

const IssueSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  Repository: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
    required: true,
  },
});
export const Issue = mongoose.model("Issue", IssueSchema);
