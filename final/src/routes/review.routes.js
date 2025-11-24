import express from "express";
import {
  createReview,
  deleteReview,
  getReviewsById,
  updateReview,
} from "../controller/review.controller.js";

const router = express.Router();

router.post("/", createReview);
router.get("/movie/:movieId", getReviewsById);
router.delete("/:id", deleteReview);
router.put("/:id", updateReview);

export default router;
