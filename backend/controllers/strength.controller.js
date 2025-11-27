import Strength from "../models/strength.model.js";

// Create a new strength workout
export async function createStrength(req, res) {
  try {
    const strength = new Strength({
      ...req.body,
      user_id: req.user.user_id,
    });
    await strength.save();
    res.status(201).json(strength);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Strength workout ID already exists." });
    }
    res.status(500).json({ error: "Failed to create strength workout." });
  }
}

// Get all strength workouts for the authenticated user
export async function getStrengthWorkouts(req, res) {
  try {
    const { page = 1, limit = 10, sort = '-date' } = req.query;
    
    const strengthWorkouts = await Strength.find({
      user_id: req.user.user_id,
    })
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Strength.countDocuments({ user_id: req.user.user_id });

    res.json({
      strengthWorkouts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalWorkouts: total
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch strength workouts." });
  }
}

// Get a specific strength workout by ID
export async function getStrengthWorkout(req, res) {
  try {
    const strength = await Strength.findOne({
      strength_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!strength) {
      return res.status(404).json({ error: "Strength workout not found." });
    }

    res.json(strength);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch strength workout." });
  }
}

// Update a strength workout by ID
export async function updateStrength(req, res) {
  try {
    const strength = await Strength.findOneAndUpdate(
      {
        strength_id: parseInt(req.params.id),
        user_id: req.user.user_id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!strength) {
      return res.status(404).json({ error: "Strength workout not found." });
    }

    res.json(strength);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Strength workout ID conflict." });
    }
    res.status(500).json({ error: "Failed to update strength workout." });
  }
}

// Delete a strength workout by ID
export async function deleteStrength(req, res) {
  try {
    const deleted = await Strength.findOneAndDelete({
      strength_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Strength workout not found." });
    }
    res.json({ message: "Strength workout deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete strength workout." });
  }
}

// Get strength statistics
export async function getStrengthStats(req, res) {
  try {
    const strengthWorkouts = await Strength.find({ user_id: req.user.user_id });

    // Total statistics
    const totalStats = {
      totalWorkouts: strengthWorkouts.length,
      totalVolume: strengthWorkouts.reduce((sum, workout) => sum + workout.totalVolume, 0),
      totalDuration: strengthWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
      averageRPE: strengthWorkouts.length > 0 
        ? strengthWorkouts.reduce((sum, workout) => sum + (workout.rpe || 0), 0) / strengthWorkouts.length 
        : 0,
    };

    // Exercise progression (latest PR for each exercise)
    const exerciseProgress = {};
    strengthWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (!exerciseProgress[exercise.name]) {
          exerciseProgress[exercise.name] = {
            name: exercise.name,
            maxWeight: 0,
            maxVolume: 0,
            totalSets: 0,
            totalReps: 0,
            workoutCount: 0
          };
        }

        const exerciseData = exerciseProgress[exercise.name];
        exerciseData.workoutCount++;

        exercise.sets.forEach(set => {
          exerciseData.totalSets++;
          exerciseData.totalReps += set.reps;
          exerciseData.maxWeight = Math.max(exerciseData.maxWeight, set.weight);
          exerciseData.maxVolume = Math.max(exerciseData.maxVolume, set.weight * set.reps);
        });
      });
    });

    // Recent progress (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentWorkouts = strengthWorkouts.filter(workout => 
      new Date(workout.date) >= thirtyDaysAgo
    );

    const volumeByDay = {};
    recentWorkouts.forEach(workout => {
      const dateStr = workout.date.toISOString().split('T')[0];
      if (!volumeByDay[dateStr]) {
        volumeByDay[dateStr] = 0;
      }
      volumeByDay[dateStr] += workout.totalVolume;
    });

    res.json({
      summary: totalStats,
      exerciseProgress: Object.values(exerciseProgress),
      recentVolume: Object.keys(volumeByDay).map(date => ({
        date,
        volume: volumeByDay[date]
      })).sort((a, b) => a.date.localeCompare(b.date)),
      workoutFrequency: {
        weekly: Math.round(recentWorkouts.length / 4.2857), // average per week
        monthly: recentWorkouts.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch strength statistics." });
  }
}

// Get personal records (PRs)
export async function getPersonalRecords(req, res) {
  try {
    const strengthWorkouts = await Strength.find({ user_id: req.user.user_id });

    const personalRecords = {
      maxWeight: {},
      maxVolume: {}
    };

    strengthWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          const exerciseName = exercise.name;
          const weight = set.weight;
          const volume = set.weight * set.reps;

          // Max weight PR
          if (!personalRecords.maxWeight[exerciseName] || weight > personalRecords.maxWeight[exerciseName].weight) {
            personalRecords.maxWeight[exerciseName] = {
              weight: weight,
              reps: set.reps,
              date: workout.date,
              workoutName: workout.name
            };
          }

          // Max volume PR
          if (!personalRecords.maxVolume[exerciseName] || volume > personalRecords.maxVolume[exerciseName].volume) {
            personalRecords.maxVolume[exerciseName] = {
              volume: volume,
              weight: set.weight,
              reps: set.reps,
              date: workout.date,
              workoutName: workout.name
            };
          }
        });
      });
    });

    res.json(personalRecords);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch personal records." });
  }
}