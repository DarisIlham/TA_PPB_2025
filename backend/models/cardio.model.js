import mongoose from "mongoose";
import { Schema } from "mongoose";

if (mongoose.models.Cardio) {
  delete mongoose.models.Cardio;
}

const cardioSchema = new Schema(
  {
    cardio_id: {
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
    type: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    pace: {
      type: String,
      
    },
    calories: {
      type: Number,
      
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Auto-increment manual
cardioSchema.pre('save', async function (next) {
  if (this.isNew && !this.cardio_id) {
    try {
      const lastCardio = await mongoose.model('Cardio').findOne().sort({ cardio_id: -1 });
      this.cardio_id = lastCardio ? lastCardio.cardio_id + 1 : 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

export default mongoose.model("Cardio", cardioSchema);