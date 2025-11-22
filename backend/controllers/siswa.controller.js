// siswa.controller.js
import Siswa from "../models/siswa.model.js";

// Create a new siswa
export async function createSiswa(req, res) {
  try {
    const siswa = new Siswa({
      nama: req.body.nama,
      kelas: req.body.kelas,
      nisn: req.body.nisn,
    });
    await siswa.save();
    res.status(201).json(siswa);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error (for unique nisn)
      return res.status(400).json({ error: "NISN already exists" });
    }
    res.status(500).json({ error: "Failed to create siswa." });
  }
}

// Get all siswa
export async function getSiswas(req, res) {
  try {
    const siswas = await Siswa.find().sort({ nama: 1 });
    res.json(siswas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch siswas." });
  }
}

// Get siswa by ID
export async function getSiswaById(req, res) {
  try {
    const siswa = await Siswa.findById(req.params.id);
    if (!siswa) {
      return res.status(404).json({ error: "Siswa not found." });
    }
    res.json(siswa);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch siswa." });
  }
}

// Update a siswa by ID
export async function updateSiswa(req, res) {
  try {
    const siswa = await Siswa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!siswa) {
      return res.status(404).json({ error: "Siswa not found." });
    }

    res.json(siswa);
  } catch (err) {
    if (err.code === 11000) { // Duplicate key error (for unique nisn)
      return res.status(400).json({ error: "NISN already exists" });
    }
    res.status(500).json({ error: "Failed to update siswa." });
  }
}

// Delete a siswa by ID
export async function deleteSiswa(req, res) {
  try {
    const deleted = await Siswa.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Siswa not found." });
    }
    res.json({ message: "Siswa deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete siswa." });
  }
}