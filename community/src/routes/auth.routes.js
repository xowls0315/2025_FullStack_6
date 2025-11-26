import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validateLogin,
  validateRegister,
} from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;
