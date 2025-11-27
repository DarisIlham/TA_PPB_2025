import { Router } from "express";
const router = Router();
import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  addGoalProgress,
  getGoalsStats,
  getWeeklySchedule,
  updateWeeklySchedule,
  getRecommendedSchedules,
  addRecommendedSchedule,
} from "../controllers/goal.controller.js";
import validate from "../middleware/validate.goal.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// Goal routes
router.get("/", verifyToken, getGoals);
router.get("/stats/summary", verifyToken, getGoalsStats);
router.get("/:id", verifyToken, getGoal);
router.post("/", verifyToken, validate.validateGoal, createGoal);
router.put("/:id", verifyToken, validate.validateGoal, updateGoal);
router.delete("/:id", verifyToken, deleteGoal);
router.post("/:id/progress", verifyToken, validate.validateGoalProgress, addGoalProgress);

// Weekly schedule routes
router.get("/schedule/weekly", verifyToken, getWeeklySchedule);
router.post("/schedule/weekly", verifyToken, validate.validateWeeklySchedule, updateWeeklySchedule);

// Recommended schedules routes
router.get("/schedules/recommended", verifyToken, getRecommendedSchedules);
router.post("/schedules/recommended", verifyToken, addRecommendedSchedule); // Admin only in production

export default router;