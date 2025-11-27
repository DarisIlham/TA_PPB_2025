import { Router } from "express";
const router = Router();
import {
  getStrengthWorkouts,
  getStrengthWorkout,
  createStrength,
  updateStrength,
  deleteStrength,
  getStrengthStats,
  getPersonalRecords,
} from "../controllers/strength.controller.js";
import validateStrength from "../middleware/validate.strength.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Get all strength workouts with pagination
router.get("/", verifyToken, getStrengthWorkouts);

// Get specific strength workout
router.get("/:id", verifyToken, getStrengthWorkout);

// Create new strength workout
router.post("/", verifyToken, validateStrength, createStrength);

// Update strength workout
router.put("/:id", verifyToken, validateStrength, updateStrength);

// Delete strength workout
router.delete("/:id", verifyToken, deleteStrength);

// Get strength statistics
router.get("/stats/summary", verifyToken, getStrengthStats);

// Get personal records
router.get("/stats/prs", verifyToken, getPersonalRecords);

export default router;