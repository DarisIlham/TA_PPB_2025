import mongoose from "mongoose";
import { Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    no_telepon: {  // Fixed typo from no_teelp to no_telepon
      type: String,  // Changed to String to handle international numbers
      required: true,
      trim: true,
      match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please fill a valid phone number']
    },
    isi: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000
    }
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model("Feedback", feedbackSchema);