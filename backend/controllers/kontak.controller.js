import Feedback from "../models/kontak.model.js";

// Submit new feedback
export async function createFeedback(req, res) {
  try {
    const feedback = new Feedback({
      nama: req.body.nama,
      email: req.body.email,
      no_telepon: req.body.no_telepon,
      isi: req.body.isi
    });
    
    await feedback.save();
    res.status(201).json({
      success: true,
      message: "Terima kasih atas feedback Anda",
      data: feedback
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
}

// Get all feedback (admin only)
export async function getAllFeedback(req, res) {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data feedback"
    });
  }
}

// Get single feedback (admin only)
export async function getFeedbackById(req, res) {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback tidak ditemukan"
      });
    }
    res.json({
      success: true,
      data: feedback
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Gagal mengambil data feedback"
    });
  }
}

// Delete feedback (admin only)
export async function deleteFeedback(req, res) {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: "Feedback tidak ditemukan"
      });
    }
    res.json({
      success: true,
      message: "Feedback berhasil dihapus"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Gagal menghapus feedback"
    });
  }
}