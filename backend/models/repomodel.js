import mongoose, { Schema } from "mongoose";

const RepositorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: [
    {
      type: String,
    },
  ],
  visibility: {
    type: Boolean,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  commits: [
    {
      commitDate: Date.now(),
      commitIdList: [String],
      latestCommit: String,
    },
  ],
});

export const Repository = mongoose.model("Repository", RepositorySchema);
