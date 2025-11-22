import Berita from "../models/berita.model.js";

// Create new berita
export async function createBerita(req, res) {
  try {
    const berita = new Berita(req.body);
    await berita.save();
    res.status(201).json(berita);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "ID Berita already exists" });
    }
    res.status(400).json({ error: err.message });
  }
}

// Get all berita (sorted by date)
export async function getAllBerita(req, res) {
  try {
    const beritas = await Berita.find().sort({ tanggal_publikasi: -1 });
    res.json(beritas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch berita" });
  }
}

// Get single berita by ID
export async function getBeritaById(req, res) {
  try {
    const berita = await Berita.findOne({ id_berita: req.params.id });
    if (!berita) return res.status(404).json({ error: "Berita not found" });
    res.json(berita);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch berita" });
  }
}

// Update berita
export async function updateBerita(req, res) {
  try {
    const berita = await Berita.findOneAndUpdate(
      { id_berita: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!berita) return res.status(404).json({ error: "Berita not found" });
    res.json(berita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete berita
export async function deleteBerita(req, res) {
  try {
    const berita = await Berita.findOneAndDelete({ id_berita: req.params.id });
    if (!berita) return res.status(404).json({ error: "Berita not found" });
    res.json({ message: "Berita deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete berita" });
  }
}