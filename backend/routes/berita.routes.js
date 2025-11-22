import { Router } from "express";
const router = Router();
import {
  createBerita,
  getAllBerita,
  getBeritaById,
  updateBerita,
  deleteBerita
} from "../controllers/berita.controller.js";
import validateBerita from "../middleware/validate.berita.js";

// Create new berita
router.post("/", validateBerita, createBerita);

// Get all berita
router.get("/", getAllBerita);

// Get single berita by ID
router.get("/:id", getBeritaById);

// Update berita
router.put("/:id", validateBerita, updateBerita);

// Delete berita
router.delete("/:id", deleteBerita);

export default router;