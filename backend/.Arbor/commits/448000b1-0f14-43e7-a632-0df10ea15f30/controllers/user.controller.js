import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/usermodel.js";
import mongoose from "mongoose";

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedpassword,
      email,
      repository: [],
      followedUsers: [],
      starRepos: [],
    });

    const result = await newUser.save();
    const token = jwt.sign({ id: result._id }, process.env.JWT_SECREAT_KEY, {
      expiresIn: "1hr",
    });
    res.json({ token, userId: result.insertid, userName: result.username });
  } catch (e) {
    console.error("Error during signup", e.message);
    res.status(500).send({ message: "server error" });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECREAT_KEY, {
      expiresIn: "72hr",
    });
    res.json({ token, userId: user._id, userName: user.username });
  } catch (e) {
    console.error("error in login", e.message);
    res.status(500).send({ message: "server error" });
  }
};
const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.error("Error during Fetching", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getUserProfile = async (req, res) => {
  const userID = req.params.id;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json("User Not Found!");
    }
    res.send(user);
  } catch (error) {
    console.error("Error During fetching User", error.message);
    res.status(500).send("Internal server error");
  }
};
const updateProfile = async (req, res) => {
  const { email, password } = req.body;
  const userID = req.params.id;
  try {
    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedpassword;
    }
    const result = await User.findByIdAndUpdate(
      userID,
      { $set: updateFields },
      { new: true },
    );
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }
    res.send(result);
  } catch (e) {
    console.error("Error During fetching User", e.message);
    res.status(500).send("Internal server error");
  }
};
const deleteUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: "user not found!" });
    }
    res.json({ message: "User Profile Deleted!" });
  } catch (error) {
    console.error("Error During deleting the User Profile", error.message);
    res.status(500).send("Internal server error");
  }
};
//TODO:handle edge Case If both id same then Send error
const unfollowUser = async (req, res) => {
  const { currentUser, followingUser } = req.body;
  if (!currentUser || !followingUser) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  if (currentUser == followingUser) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  try {
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.followedUsers = user.followedUsers.filter(
      (id) => id.toString() !== followingUser.toString(),
    );
    await user.save();
    return res.json(user);
  } catch (e) {
    console.error("Error in Unfollowing", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const followUser = async (req, res) => {
  const { currentUser, followingUser } = req.body;
  if (!currentUser || !followingUser) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  if (currentUser == followingUser) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  try {
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = user.followedUsers.some(
      (id) => id.toString() === followingUser.toString()
    );
    if (isFollowing) {
      return await unfollowUser(req, res);
    }
    user.followedUsers.push(followingUser);
    await user.save();
    return res.json(user);
  } catch (e) {
    console.error("Error in Following", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const UserController = {
  getAllUser,
  signup,
  login,
  getUserProfile,
  updateProfile,
  deleteUserProfile,
  followUser,
  unfollowUser,
};
