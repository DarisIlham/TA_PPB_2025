// siswa.routes.js
import { Router } from "express";
const router = Router();
import {
  getSiswas,
  getSiswaById,
  createSiswa,
  updateSiswa,
  deleteSiswa,
} from "../controllers/siswa.controller.js";
import validateSiswa from "../middleware/validate.siswa.js";

// Get all siswas
router.get("/", getSiswas);

// Get single siswa by ID
router.get("/:id", getSiswaById);

// Create new siswa
router.post("/", validateSiswa, createSiswa);

// Update siswa
router.put("/:id", validateSiswa, updateSiswa);

// Delete siswa
router.delete("/:id", deleteSiswa);

export default router;