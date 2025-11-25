import express from "express";
import { createMember, login } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", createMember);
router.post("/login", login);

export default router;
