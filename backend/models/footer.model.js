// footer.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";

const footerSchema = new Schema(
  {
    logo: {
      type: String,
      
    },
    nama_sekolah: {
      type: String,
      
    },
    alamat: {
      type: String,
     
    },
    no_telepon: {
      type: Number,
     
    },
    email: {
      type: String,
      
    },
    facebook: {
      type: String,
      
    },
    youtube: {
      type: String,
      
    },
    instagram: {
      type: String,
      
    },
  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);