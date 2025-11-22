// guru.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Pass mongoose to plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const guruSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    nip: {
      type: Number,
      required: true,
      unique: true
    },
    pelajaran: {
      type: String,
      required: true,
    },
    gambar: {
      type: String,  // Changed from Image to String (store URL or base64)
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Add auto-increment for id_guru if needed
guruSchema.plugin(AutoIncrement, { inc_field: 'id_guru' });

export default mongoose.model("Guru", guruSchema);