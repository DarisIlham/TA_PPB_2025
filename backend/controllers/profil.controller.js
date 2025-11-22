// profil.controller.js
import Profil from "../models/profil.model.js";

// Create or update profil (since there's typically only one profil)
export async function createOrUpdateProfil(req, res) {
  try {
    // Assuming we only have one profil document
    const profil = await Profil.findOneAndUpdate(
      {}, // empty filter to find first document
      req.body,
      { 
        new: true,
        upsert: true // create if doesn't exist
      }
    );
    res.status(200).json(profil);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profil." });
  }
}

// Get profil
export async function getProfil(req, res) {
  try {
    const profil = await Profil.findOne({});
    if (!profil) {
      return res.status(404).json({ error: "Profil not found." });
    }
    res.json(profil);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profil." });
  }
}