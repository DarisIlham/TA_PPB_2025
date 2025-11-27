import express from "express";
import { register, login, getUserProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

// Auth routes
router.post("/signup", register);
router.post("/login", login);
router.get("/profile", verifyToken, getUserProfile); // Tambah route ini

// Protected route example



export default router;
