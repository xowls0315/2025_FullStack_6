import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controller/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validatePostBody,
  validatePostParams,
  validatePostParamsAndBody,
} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, validatePostBody, createPost);
router.get("/", getPosts);
router.get("/:postId", validatePostParams, getPostById);
router.patch("/:postId", authMiddleware, validatePostParamsAndBody, updatePost);
router.delete("/:postId", authMiddleware, validatePostParams, deletePost);

export default router;
