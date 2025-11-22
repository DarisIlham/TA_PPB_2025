import mongoose from "mongoose";

const beritaSchema = new mongoose.Schema({
  id_berita: {
    type: Number,
    unique: true,
    required: true
  },
  judul: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  isi: {
    type: String,
    required: true,
    trim: true
  },
  tanggal_publikasi: {
    type: Date,
    required: true
  },
  gambar_utama: {
    type: String,
    required: true,
    trim: true
  },
  gambar1: {
    type: String,
    trim: true,
    default: null
  },
  gambar2: {
    type: String,
    trim: true,
    default: null
  },
  gambar3: {
    type: String,
    trim: true,
    default: null
  },
  gambar4: {
    type: String,
    trim: true,
    default: null
  },
  gambar5: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Auto-increment for id_berita
beritaSchema.pre('save', async function(next) {
  if (!this.id_berita) {
    const lastBerita = await this.constructor.findOne().sort('-id_berita');
    this.id_berita = lastBerita ? lastBerita.id_berita + 1 : 1;
  }
  next();
});

export default mongoose.model("Berita", beritaSchema);