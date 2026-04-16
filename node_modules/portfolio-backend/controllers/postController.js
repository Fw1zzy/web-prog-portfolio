import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Post from "../models/Post.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "fullname username email role")
    .sort({ createdAt: -1 });
  const postsWithLikes = posts.map((post) => ({
    ...post.toObject(),
    likes: post.likes.map((id) => id.toString()),
  }));
  res.json(postsWithLikes);
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "user",
    "fullname username email role",
  );
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.json(post);
});

export const createPost = asyncHandler(async (req, res) => {
  const { caption, description, imageData } = req.body;
  if (!caption) {
    res.status(400);
    throw new Error("Caption is required");
  }

  const imageUrl = imageData || "/assets/images/placeholder.png";

  const post = await Post.create({
    user: req.user.id,
    caption,
    description: description || "",
    imageUrl,
  });

  const populatedPost = await post.populate(
    "user",
    "fullname username email role",
  );
  res.status(201).json(populatedPost);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { caption, description, imageUrl } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to update this post");
  }

  post.caption = caption || post.caption;
  post.description = description !== undefined ? description : post.description;
  post.imageUrl = imageUrl || post.imageUrl;
  await post.save();

  res.json(post);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to delete this post");
  }

  await post.deleteOne();
  res.json({ message: "Post deleted successfully" });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const userObjectId = new mongoose.Types.ObjectId(req.user.id);
  const isLiked = post.likes.some((id) => id.equals(userObjectId));

  if (isLiked) {
    post.likes = post.likes.filter((id) => !id.equals(userObjectId));
  } else {
    post.likes.push(userObjectId);
  }

  await post.save();

  res.json({ likes: post.likes.length, isLiked: !isLiked });
});
