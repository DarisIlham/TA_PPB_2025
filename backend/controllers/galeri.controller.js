import Galeri from "../models/galeri.model.js";

// Create new gallery entry
export async function createGaleri(req, res) {
  try {
    const galeri = new Galeri(req.body);
    await galeri.save();
    res.status(201).json({
      success: true,
      message: "Galeri created successfully",
      data: galeri
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "ID Galeri already exists" 
      });
    }
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}

// Get all gallery entries
export async function getAllGaleri(req, res) {
  try {
    const galeri = await Galeri.find().sort({ id_galeri: 1 });
    res.json({
      success: true,
      count: galeri.length,
      data: galeri
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch gallery data"
    });
  }
}

// Get single gallery entry
export async function getGaleriById(req, res) {
  try {
    const galeri = await Galeri.findOne({ id_galeri: (req.params.id) });
    if (!galeri) {
      return res.status(404).json({
        success: false,
        error: "Gallery entry not found"
      });
    }
    res.json({
      success: true,
      data: galeri
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch gallery entry"
    });
  }
}

// Update gallery entry
export async function updateGaleri(req, res) {
  try {
    const galeri = await Galeri.findOneAndUpdate(
      { id_galeri: (req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!galeri) {
      return res.status(404).json({
        success: false,
        error: "Gallery entry not found"
      });
    }
    res.json({
      success: true,
      message: "Gallery updated successfully",
      data: galeri
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}

// Delete gallery entry
export async function deleteGaleri(req, res) {
  try {
    const galeri = await Galeri.findOneAndDelete({ id_galeri: (req.params.id) });
    if (!galeri) {
      return res.status(404).json({
        success: false,
        error: "Gallery entry not found"
      });
    }
    res.json({
      success: true,
      message: "Gallery deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to delete gallery entry"
    });
  }
}

export async function appendGaleriImage(req, res) {
  const { gambar } = req.body;

  if (!gambar) {
    return res.status(400).json({ success: false, error: "Gambar kosong" });
  }

  try {
    const galeri = new Galeri({ gambar });

    await galeri.save();
    res.status(201).json({ success: true, data: galeri });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

