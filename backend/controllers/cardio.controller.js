import Cardio from "../models/cardio.model.js";

// Create a new cardio workout
export async function createCardio(req, res) {
  try {
    const cardio = new Cardio({
      ...req.body,
      user_id: req.user.user_id,
    });
    await cardio.save();
    res.status(201).json(cardio);
  } catch (err) {
    console.error('Error creating cardio:', err);
    res.status(500).json({ error: "Failed to create cardio workout." });
  }
}

// Get all cardio workouts for the authenticated user
export async function getCardioWorkouts(req, res) {
  try {
    const { limit = 100, sort = '-date' } = req.query;
    
    const cardioWorkouts = await Cardio.find({
      user_id: req.user.user_id,
    })
    .sort(sort)
    .limit(parseInt(limit));
    
    res.json({
      cardioWorkouts,
      success: true
    });
  } catch (err) {
    console.error('Error fetching cardio workouts:', err);
    res.status(500).json({ error: "Failed to fetch cardio workouts." });
  }
}

// Get single cardio workout by ID
export async function getCardioWorkout(req, res) {
  try {
    const cardio = await Cardio.findOne({
      cardio_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!cardio) {
      return res.status(404).json({ error: "Cardio workout not found." });
    }

    res.json(cardio);
  } catch (err) {
    console.error('Error fetching cardio workout:', err);
    res.status(500).json({ error: "Failed to fetch cardio workout." });
  }
}

// Update a cardio workout by ID
export async function updateCardio(req, res) {
  try {
    const cardio = await Cardio.findOneAndUpdate(
      {
        cardio_id: parseInt(req.params.id), // Fixed typo: was 'ccardio_id'
        user_id: req.user.user_id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!cardio) {
      return res.status(404).json({ error: "Cardio workout not found." });
    }

    res.json(cardio);
  } catch (err) {
    console.error('Error updating cardio:', err);
    res.status(500).json({ error: "Failed to update cardio workout." });
  }
}

// Delete a cardio workout by ID
export async function deleteCardio(req, res) {
  try {
    const deleted = await Cardio.findOneAndDelete({
      cardio_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Cardio workout not found." });
    }
    res.json({ message: "Cardio workout deleted.", success: true });
  } catch (err) {
    console.error('Error deleting cardio:', err);
    res.status(500).json({ error: "Failed to delete cardio workout." });
  }
}

// Get cardio statistics summary
export async function getCardioStats(req, res) {
  try {
    const totalStats = await Cardio.aggregate([
      { $match: { user_id: req.user.user_id } },
      {
        $group: {
          _id: null,
          totalDistance: { $sum: "$distance" },
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$calories" },
          workoutCount: { $sum: 1 },
          avgDistance: { $avg: "$distance" },
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    const typeStats = await Cardio.aggregate([
      { $match: { user_id: req.user.user_id } },
      {
        $group: {
          _id: "$type",
          totalDistance: { $sum: "$distance" },
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$calories" },
          workoutCount: { $sum: 1 },
          avgPace: { $avg: { $convert: { input: "$pace", to: "double", onError: 0, onNull: 0 } } },
        },
      },
    ]);

    res.json({
      summary: totalStats[0] || {
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        workoutCount: 0,
        avgDistance: 0,
        avgDuration: 0,
      },
      byType: typeStats,
    });
  } catch (err) {
    console.error('Error fetching cardio stats:', err);
    res.status(500).json({ error: "Failed to fetch cardio statistics." });
  }
}

// Get cardio personal records
export async function getCardioPRs(req, res) {
  try {
    // Max distance
    const maxDistance = await Cardio.findOne({
      user_id: req.user.user_id
    }).sort({ distance: -1 });

    // Best pace (lowest pace value)
    const bestPace = await Cardio.findOne({
      user_id: req.user.user_id,
      pace: { $exists: true, $ne: null }
    }).sort({ pace: 1 });

    // Max calories
    const maxCalories = await Cardio.findOne({
      user_id: req.user.user_id,
      calories: { $exists: true, $ne: null }
    }).sort({ calories: -1 });

    res.json({
      maxDistance: maxDistance ? {
        distance: maxDistance.distance,
        type: maxDistance.type,
        date: maxDistance.date
      } : null,
      bestPace: bestPace ? {
        pace: bestPace.pace,
        type: bestPace.type,
        date: bestPace.date
      } : null,
      maxCalories: maxCalories ? {
        calories: maxCalories.calories,
        type: maxCalories.type,
        date: maxCalories.date
      } : null,
    });
  } catch (err) {
    console.error('Error fetching cardio PRs:', err);
    res.status(500).json({ error: "Failed to fetch personal records." });
  }
}