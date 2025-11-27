import { Router } from "express";
const router = Router();
import {
  getCardioWorkouts,
  getCardioWorkout,
  createCardio,
  updateCardio,
  deleteCardio,
  getCardioStats,
  getCardioPRs,
} from "../controllers/cardio.controller.js";
import validateCardio from "../middleware/validate.cardio.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Get all cardio workouts
router.get("/", verifyToken, getCardioWorkouts);

// Get single cardio workout
router.get("/:id", verifyToken, getCardioWorkout);

// Create new cardio workout
router.post("/", verifyToken, validateCardio, createCardio);

// Update cardio workout
router.put("/:id", verifyToken, validateCardio, updateCardio);

// Delete cardio workout
router.delete("/:id", verifyToken, deleteCardio);

// Get cardio statistics
router.get("/stats/summary", verifyToken, getCardioStats);

// Get cardio personal records
router.get("/stats/prs", verifyToken, getCardioPRs);

export default router;