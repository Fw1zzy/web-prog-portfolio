import express from "express";
import {
  getUsers,
  getPostsAdmin,
  getMessages,
  updateUser,
  deleteUser,
  deleteMessage,
  deletePostAdmin,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/users", getUsers);
router.get("/posts", getPostsAdmin);
router.get("/messages", getMessages);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.delete("/posts/:id", deletePostAdmin);
router.delete("/messages/:id", deleteMessage);

export default router;
