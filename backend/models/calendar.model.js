import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
}, {
  timestamps: true
});

// Pre-save hook to combine date and time
calendarSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isModified('time')) {
    const [hours, minutes] = this.time.split(':');
    const newDate = new Date(this.date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    this.datetime = newDate;
  }
  next();
});

export default mongoose.model("Calendar", calendarSchema);