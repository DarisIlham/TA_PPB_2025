// models/goal.model.js - HAPUS schedule_id sepenuhnya
import mongoose from "mongoose";
import { Schema } from "mongoose";

if (mongoose.models.Goal) {
  delete mongoose.models.Goal;
}

if (mongoose.models.WeeklySchedule) {
  delete mongoose.models.WeeklySchedule;
}

if (mongoose.models.RecommendedSchedule) {
  delete mongoose.models.RecommendedSchedule;
}

// Schema untuk history progress goal
const historySchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: ""
  }
});

// Schema untuk goals
const goalSchema = new Schema(
  {
    goal_id: { type: Number, unique: true },
    user_id: { type: Number, required: true },
    name: { type: String, required: true, trim: true },
    metric: {
      type: String,
      required: true,
      enum: ['Strength', 'Cardio', 'Endurance', 'Weight Loss', 'Muscle Gain', 'Flexibility', 'Other']
    },
    // FIELD BARU: Tipe Goal (Naik/Turun)
    type: {
      type: String,
      required: true,
      enum: ['ascending', 'descending'],
      default: 'ascending'
    },
    // FIELD BARU: Nilai Awal
    startValue: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    target: { type: Number, required: true, min: 0 },
    current: { type: Number, required: true, min: 0, default: 0 },
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'paused'],
      default: 'active'
    },
    description: { type: String, default: "" },
    history: [historySchema],
    progress: { type: Number, min: 0, max: 100, default: 0 },
    category: {
      type: String,
      enum: ['fitness', 'nutrition', 'lifestyle', 'sports'],
      default: 'fitness'
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Schema untuk weekly schedule - HAPUS schedule_id
const weeklyScheduleSchema = new Schema(
  {
    // HAPUS schedule_id field sepenuhnya
    user_id: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    type: {
      type: String,
      required: true,
      enum: ['Workout', 'Rest', 'Cardio', 'Strength', 'Recovery']
    },
    details: {
      type: String,
      required: true
    },
    exercises: [{
      name: String,
      sets: Number,
      reps: String,
      duration: String
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    weekStartDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Schema untuk recommended schedules
const recommendedScheduleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  fullUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'bodybuilding', 'weightloss'],
    default: 'intermediate'
  },
  duration: {
    type: String,
    default: "30-45 minutes"
  },
  equipment: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
});

// Auto-increment untuk goal_id (tetap pertahankan untuk goals)
goalSchema.pre('save', async function (next) {
  if (this.isNew && !this.goal_id) {
    try {
      const lastGoal = await mongoose.model('Goal').findOne().sort({ goal_id: -1 });
      this.goal_id = lastGoal ? lastGoal.goal_id + 1 : 1;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// HAPUS auto-increment untuk schedule_id karena field-nya sudah dihapus

// Calculate progress percentage before saving
goalSchema.pre('save', function (next) {
  const start = this.startValue || 0;
  const current = this.current;
  const target = this.target;
  const type = this.type || 'ascending';
  
  let percentage = 0;

  if (type === 'descending') {
    // Logika Weight Loss (Makin kecil makin baik)
    const totalToLose = start - target;
    const lostSoFar = start - current;
    
    // Cegah pembagian nol atau logika aneh
    if (totalToLose <= 0) {
       percentage = (current <= target) ? 100 : 0;
    } else {
       percentage = (lostSoFar / totalToLose) * 100;
    }
  } else {
    // Logika Ascending (Default)
    const totalToGain = target - start;
    const gainedSoFar = current - start;
    
    if (start === 0 && totalToGain > 0) {
       // Jika start 0, hitung simple
       percentage = (current / target) * 100;
    } else if (totalToGain > 0) {
       percentage = (gainedSoFar / totalToGain) * 100;
    } else {
       percentage = (current >= target) ? 100 : 0;
    }
  }

  // Pastikan range 0 - 100
  this.progress = Math.min(100, Math.max(0, Math.round(percentage)));
  next();
});

export const Goal = mongoose.model("Goal", goalSchema);
export const WeeklySchedule = mongoose.model("WeeklySchedule", weeklyScheduleSchema); // Pastikan variable weeklyScheduleSchema tersedia di file asli
export const RecommendedSchedule = mongoose.model("RecommendedSchedule", recommendedScheduleSchema); // Pastikan variable tersedia