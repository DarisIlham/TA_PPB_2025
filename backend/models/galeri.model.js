import mongoose from "mongoose";

const galeriSchema = new mongoose.Schema({
  id_galeri: {
    type: Number,
    unique: true,
  },
  gambar: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: true
});

// Auto-increment id_galeri
galeriSchema.pre('save', async function(next) {
  if (!this.id_galeri) {
    const lastGaleri = await this.constructor.findOne().sort('-id_galeri');
    this.id_galeri = lastGaleri ? lastGaleri.id_galeri + 1 : 1;
  }
  next();
});

export default mongoose.model("Galeri", galeriSchema);  