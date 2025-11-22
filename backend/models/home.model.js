// guru.model.js
import mongoose from "mongoose";
import { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Pass mongoose to plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const berandaSchema = new Schema(
  {
    header: {
      type: String,
      
    },
    judul: {
      type: String,
      
    },
    subjudul: {
      type: String, 
      
    },
    deskripsi: {
      type: String,
      
    },
    gambar: {
      type: String,
      
    },
    namajumlah1: {
      type: String,
      
    },
    jumlah1: {
      type: Number,
      
    },
    namajumlah2: {
      type: String,
      
    },
    jumlah2: {
      type: Number,
      
    },
    namajumlah3: {
      type: String,
      
    },
    jumlah3: {
      type: Number,
      
    },
    judulfeature: {
      type: String,
      
    },
    feature1: {
      type: String,
      
    },
    deskripsifeature1: {
        type: String,
        
    },
    feature2: {
      type: String,
      
    },
    deskripsifeature2: {
        type: String,
        
    },
    feature3: {
      type: String,
      
    },
    deskripsifeature3: {
        type: String,
        
    },
    feature4: {
      type: String,
      
    },
    deskripsifeature4: {
        type: String,
        
    },
  },
  { timestamps: true }
);


export default mongoose.model("Beranda", berandaSchema);