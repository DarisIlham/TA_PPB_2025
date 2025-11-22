// guru.routes.js
import { Router } from "express";
const router = Router();
import {
  getGurus,
  createGuru,
  updateGuru,
  deleteGuru,
} from "../controllers/guru.controller.js";
import validateGuru from "../middleware/validate.guru.js";

// Get all gurus
router.get("/", getGurus);

// Create new guru
router.post("/", validateGuru, createGuru);

// Update guru
router.put("/:id", validateGuru, updateGuru);

// Delete guru
router.delete("/:id", deleteGuru);

export default router;