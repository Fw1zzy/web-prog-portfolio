import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate("user", "fullname username email role")
    .sort({ createdAt: -1 });

  res.json(comments);
});

export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    user: req.user.id,
    text,
  });

  const populatedComment = await comment.populate(
    "user",
    "fullname username email role",
  );
  res.status(201).json(populatedComment);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Unauthorized to delete this comment");
  }

  await comment.deleteOne();
  res.json({ message: "Comment deleted successfully" });
});
