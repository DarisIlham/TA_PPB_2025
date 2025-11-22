// calendar.controller.js
import Calendar from '../models/calendar.model.js';

// ✅ GET semua kegiatan
export const getAllEvents = async (req, res) => {
  try {
    const events = await Calendar.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data kalender' });
  }
};

// ✅ POST - Tambah kegiatan baru
export const createEvent = async (req, res) => {
  try {
    const event = new Calendar(req.body);
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan kegiatan' });
  }
};

// ✅ PUT - Update kegiatan
export const updateEvent = async (req, res) => {
  try {
    const updated = await Calendar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui kegiatan' });
  }
};

// ✅ DELETE - Hapus kegiatan
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Calendar.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    }
    res.json({ message: 'Kegiatan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kegiatan' });
  }
};
