import mongoose, { Schema } from "mongoose";
import { Repository } from "./repomodel.js";
import { User } from "./usermodel.js";
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
});
export const Issue = mongoose.model("Issue", IssueSchema);
