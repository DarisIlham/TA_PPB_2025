import mongoose from "mongoose";
import { Schema } from "mongoose";

if (mongoose.models.Strength) {
  delete mongoose.models.Strength;
}

const setSchema = new Schema({
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  reps: {
    type: Number,
    required: true,
    min: 1
  }
});

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  sets: [setSchema]
});

const strengthSchema = new Schema(
  {
    strength_id: {
      type: Number,
      unique: true
    },
    user_id: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    exercises: [exerciseSchema],
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    totalVolume: {
      type: Number,
      required: true,
      min: 0
    },
    rpe: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: {
      type: String,
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Auto-increment manual
strengthSchema.pre('save', async function (next) {
  if (this.isNew && !this.strength_id) {
    try {
      const lastStrength = await mongoose.model('Strength').findOne().sort({ strength_id: -1 });
      this.strength_id = lastStrength ? lastStrength.strength_id + 1 : 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Calculate total volume before saving
strengthSchema.pre('save', function (next) {
  if (this.isModified('exercises')) {
    this.totalVolume = this.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((exerciseTotal, set) => {
        return exerciseTotal + (set.weight * set.reps);
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }
  next();
});

export default mongoose.model("Strength", strengthSchema);