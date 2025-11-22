// guru.controller.js
import Guru from "../models/guru.model.js";

// Create a new guru
export async function createGuru(req, res) {
  try {
    const guru = new Guru({
      nama: req.body.nama,
      nip: req.body.nip,
      pelajaran: req.body.pelajaran,
      gambar: req.body.gambar
    });
    await guru.save();
    res.status(201).json(guru);
  } catch (err) {
    res.status(500).json({ error: "Failed to create guru." });
  }
}

// Get all gurus
export async function getGurus(req, res) {
  try {
    const gurus = await Guru.find().sort({ nama: 1 });
    res.json(gurus);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gurus." });
  }
}

// Update a guru by ID
export async function updateGuru(req, res) {
  try {
    const guru = await Guru.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!guru) {
      return res.status(404).json({ error: "Guru not found." });
    }

    res.json(guru);
  } catch (err) {
    res.status(500).json({ error: "Failed to update guru." });
  }
}

// Delete a guru by ID
export async function deleteGuru(req, res) {
  try {
    const deleted = await Guru.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Guru not found." });
    }
    res.json({ message: "Guru deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete guru." });
  }
}