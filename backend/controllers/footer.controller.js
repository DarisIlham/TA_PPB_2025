import FooterModel from "../models/footer.model.js";

// Get footer content
export const getFooterContent = async (req, res) => {
  try {
    const footerContent = await FooterModel.findOne();
    
    if (!footerContent) {
      // Return default structure if no content exists
      return res.status(200).json({
        logo: "",
        nama_sekolah: "",
        alamat: "",
        no_telepon: 0,
        email: "",
        facebook: "",
        youtube: "",
        instagram: ""
      });
    }

    res.status(200).json(footerContent);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch footer content", 
      error: error.message 
    });
  }
};

// Update footer content
export const updateFooterContent = async (req, res) => {
  try {
    // Find existing content or create new if doesn't exist
    const footerContent = await FooterModel.findOneAndUpdate(
      {},
      { $set: req.body },
      { 
        new: true,
        upsert: true,
        runValidators: true 
      }
    );

    res.status(200).json(footerContent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle Mongoose validation errors
      const errors = Object.values(error.errors).map(err => ({
        msg: err.message,
        param: err.path
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ 
      message: "Failed to update footer content", 
      error: error.message 
    });
  }
};

// Delete footer content
export const deleteFooterContent = async (req, res) => {
  try {
    await FooterModel.deleteOne({});
    res.status(200).json({ message: "Footer content deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to delete footer content", 
      error: error.message 
    });
  }
};