// profil.routes.js
import { Router } from "express";
const router = Router();

import {
  createOrUpdateProfil,
  getProfil,
} from "../controllers/profil.controller.js";

import validateProfil from "../middleware/validate.profil.js";

// Get profil
router.get("/", getProfil);

// Create or update profil
router.post("/", validateProfil, createOrUpdateProfil);

export default router;