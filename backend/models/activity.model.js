import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },

}, {
  timestamps: true
});


export default mongoose.model("Activity", activitySchema);