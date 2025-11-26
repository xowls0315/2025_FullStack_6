import express from "express";
import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
} from "../controller/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validatePostIdInParams,
  validateCommentBody,
  validateCommentParams,
  validateCommentParamsAndBody,
} from "../middleware/validate.middleware.js";

const router = express.Router();

// /posts/:postId/comments
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  validatePostIdInParams,
  validateCommentBody,
  createComment
);
router.get(
  "/posts/:postId/comments",
  validatePostIdInParams,
  getCommentsByPost
);

// /comments/:commentId
router.patch(
  "/comments/:commentId",
  authMiddleware,
  validateCommentParamsAndBody,
  updateComment
);
router.delete(
  "/comments/:commentId",
  authMiddleware,
  validateCommentParams,
  deleteComment
);

export default router;
