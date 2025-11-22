import { Router } from "express";
const router = Router();
import {
  updateHomeContent,
  getHomeContent,
  deleteHomeContent
} from "../controllers/home.controller.js";
import validateHome from "../middleware/validate.home.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Admin-only routes
router.put("/", verifyToken, validateHome, updateHomeContent);
router.delete("/", verifyToken, deleteHomeContent);

// Public route
router.get("/", getHomeContent);

export default router;