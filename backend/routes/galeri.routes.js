import { Router } from "express";
const router = Router();

import {
  createGaleri,
  getAllGaleri,
  getGaleriById,
  updateGaleri,
  deleteGaleri,
  appendGaleriImage
} from "../controllers/galeri.controller.js";

import validateGaleri from "../middleware/validate.galeri.js";
import { verifyToken } from "../middleware/auth.middleware.js";

// ✅ Tambah gambar satu per satu ke entri galeri terakhir (tanpa token)
router.post("/append", appendGaleriImage);

// ✅ Tambah entri galeri baru (harus admin / pakai token)
router.post("/", verifyToken, validateGaleri, createGaleri);

// ✅ Ambil semua entri galeri (public)
router.get("/", getAllGaleri);

// ✅ Ambil satu entri galeri berdasarkan id_galeri (public)
router.get("/:id", getGaleriById);

// ✅ Perbarui entri galeri berdasarkan id_galeri (admin only)
router.put("/:id", verifyToken, validateGaleri, updateGaleri);

// ✅ Hapus entri galeri berdasarkan id_galeri (admin only)
router.delete("/:id", verifyToken, deleteGaleri);

export default router;
