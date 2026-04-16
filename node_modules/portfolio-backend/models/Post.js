import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true, trim: true },
    published: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
