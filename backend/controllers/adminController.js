import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Message from "../models/Message.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    "-password -resetPasswordToken -resetPasswordExpires",
  );
  res.json(users);
});

export const getPostsAdmin = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user", "fullname username email");
  res.json(posts);
});

export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.remove();
  res.json({ message: "User deleted successfully" });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      res.status(400);
      throw new Error("Email address is already in use");
    }
    user.email = email.toLowerCase();
  }

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400);
      throw new Error("Username is already taken");
    }
    user.username = username;
  }

  user.fullname = fullname || user.fullname;
  user.role = role || user.role;
  const updatedUser = await user.save();

  res.json({
    id: updatedUser._id,
    fullname: updatedUser.fullname,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  await message.remove();
  res.json({ message: "Message deleted successfully" });
});

export const deletePostAdmin = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  await post.remove();
  res.json({ message: "Post deleted successfully" });
});
