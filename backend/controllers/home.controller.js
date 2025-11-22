import HomeModel from "../models/home.model.js";

// Get home content
export const getHomeContent = async (req, res) => {
  try {
    const homeContent = await HomeModel.findOne();
    
    if (!homeContent) {
      // Return default structure if no content exists
      return res.status(200).json({
        header: "",
        judul: "",
        subjudul: "",
        deskripsi: "",
        gambar: "",
        namajumlah1: "",
        jumlah1: 0,
        namajumlah2: "",
        jumlah2: 0,
        namajumlah3: "",
        jumlah3: 0,
        judulfeature: "",
        feature1: "",
        deskripsifeature1: "",
        feature2: "",
        deskripsifeature2: "",
        feature3: "",
        deskripsifeature3: "",
        feature4: "",
        deskripsifeature4: ""
      });
    }

    res.status(200).json(homeContent);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch home content", error: error.message });
  }
};

// Update home content
export const updateHomeContent = async (req, res) => {
  try {
    // Find existing content or create new if doesn't exist
    const homeContent = await HomeModel.findOneAndUpdate(
      {},
      { $set: req.body },
      { 
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json(homeContent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      const errors = Object.values(error.errors).map(err => ({
        msg: err.message,
        param: err.path
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Failed to update home content", error: error.message });
  }
};

// Delete home content
export const deleteHomeContent = async (req, res) => {
  try {
    await HomeModel.deleteOne({});
    res.status(200).json({ message: "Home content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete home content", error: error.message });
  }
};