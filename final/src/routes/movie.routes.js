import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
} from "../controller/movie.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  movieBodyValidator,
  movieParamsAndBodyValidator,
  movieParamsValidator,
} from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", movieParamsValidator, getMovieById);
router.post("/register", movieBodyValidator, authMiddleware, createMovie);
router.delete("/:id", movieParamsValidator, deleteMovie);
router.patch("/:id", movieParamsAndBodyValidator, updateMovie);

export default router;
