import express from "express";
import {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity
} from "../controllers/activity.controller.js";
import { validateActivity } from "../middleware/validate.activity.js";

const router = express.Router();

router.post("/", validateActivity, createActivity);
router.get("/", getActivities);
router.get("/:id", getActivity);
router.put("/:id", validateActivity, updateActivity);
router.delete("/:id", deleteActivity);

export default router;