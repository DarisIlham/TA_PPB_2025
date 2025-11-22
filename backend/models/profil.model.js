// profil.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";

const profilSchema = new Schema(
  {
    deskripsi: {
      type: String,
      required: true,
    },
    gambar : {
      type: String,
      required: false,
    },
    visi: {
      type: String,
      required: true,
    },
    misi: {
      type: [String],
      required: true,
    },
    tujuan: {
      type: [String],
      required: true,
    },
    strategi: {
      type: String,
      required: true,
    },
    map: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Profil", profilSchema);