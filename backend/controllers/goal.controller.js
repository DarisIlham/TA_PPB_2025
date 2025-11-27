import { Goal, WeeklySchedule, RecommendedSchedule } from "../models/goal.model.js";

// Create a new goal
export async function createGoal(req, res) {
  try {
    const goal = new Goal({
      ...req.body,
      user_id: req.user.user_id,
    });
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Goal ID already exists." });
    }
    res.status(500).json({ error: "Failed to create goal." });
  }
}

// Get all goals for the authenticated user
export async function getGoals(req, res) {
  try {
    const { page = 1, limit = 10, sort = '-created_at', status, priority, metric } = req.query;
    
    const filter = { user_id: req.user.user_id };
    
    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (metric) filter.metric = metric;

    const goals = await Goal.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Goal.countDocuments(filter);

    res.json({
      goals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalGoals: total
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals." });
  }
}

// Get a specific goal by ID
export async function getGoal(req, res) {
  try {
    const goal = await Goal.findOne({
      goal_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goal." });
  }
}

// Update a goal by ID
export async function updateGoal(req, res) {
  try {
    const goal = await Goal.findOneAndUpdate(
      {
        goal_id: parseInt(req.params.id),
        user_id: req.user.user_id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.json(goal);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Goal ID conflict." });
    }
    res.status(500).json({ error: "Failed to update goal." });
  }
}

// Delete a goal by ID
export async function deleteGoal(req, res) {
  try {
    const deleted = await Goal.findOneAndDelete({
      goal_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Goal not found." });
    }
    res.json({ message: "Goal deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal." });
  }
}

// Add progress history to a goal
export async function addGoalProgress(req, res) {
  try {
    const { date, value, notes } = req.body;
    
    const goal = await Goal.findOne({
      goal_id: parseInt(req.params.id),
      user_id: req.user.user_id,
    });

    if (!goal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    // Add new history entry
    goal.history.push({
      date: date || new Date(),
      value,
      notes: notes || ""
    });

    // Update current value
    goal.current = value;
    
    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: "Failed to add goal progress." });
  }
}

// Get goals statistics
export async function getGoalsStats(req, res) {
  try {
    const goals = await Goal.find({ user_id: req.user.user_id });

    // Overall statistics
    const totalStats = {
      totalGoals: goals.length,
      activeGoals: goals.filter(g => g.status === 'active').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      averageProgress: goals.length > 0 
        ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
        : 0,
    };

    // Goals by priority
    const goalsByPriority = {
      High: goals.filter(g => g.priority === 'High').length,
      Medium: goals.filter(g => g.priority === 'Medium').length,
      Low: goals.filter(g => g.priority === 'Low').length,
    };

    // Goals by metric
    const goalsByMetric = {};
    goals.forEach(goal => {
      if (!goalsByMetric[goal.metric]) {
        goalsByMetric[goal.metric] = 0;
      }
      goalsByMetric[goal.metric]++;
    });

    // Upcoming deadlines (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const upcomingDeadlines = goals
      .filter(goal => goal.status === 'active' && new Date(goal.deadline) <= thirtyDaysFromNow)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    res.json({
      summary: totalStats,
      byPriority: goalsByPriority,
      byMetric: goalsByMetric,
      upcomingDeadlines
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals statistics." });
  }
}

// Weekly Schedule Controllers

// Get weekly schedule for user
export async function getWeeklySchedule(req, res) {
  try {
    const { weekStartDate } = req.query;
    const user_id = req.user.user_id;
    
    let filter = { user_id: user_id };
    
    if (weekStartDate) {
      const weekStart = new Date(weekStartDate);
      weekStart.setHours(0, 0, 0, 0);
      filter.weekStartDate = weekStart;
    } else {
      // Get current week's schedule (most recent)
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);
      
      filter.weekStartDate = currentWeekStart;
    }

    console.log('📅 Fetching schedule with filter:', filter);
    
    const schedule = await WeeklySchedule.find(filter).sort({ day: 1 });

    console.log('✅ Found schedules:', schedule.length);
    
    res.json(schedule);
  } catch (err) {
    console.error('❌ Error fetching weekly schedule:', err);
    res.status(500).json({ error: "Failed to fetch weekly schedule." });
  }
}

// Create or update weekly schedule
// goal.controller.js - Perbaiki fungsi updateWeeklySchedule
// controllers/goal.controller.js - PERBAIKI updateWeeklySchedule
export async function updateWeeklySchedule(req, res) {
  try {
    const { schedules, weekStartDate } = req.body;
    const user_id = req.user.user_id;

   

    if (!schedules || !Array.isArray(schedules)) {
      return res.status(400).json({ error: "Schedules must be an array" });
    }

    if (!weekStartDate) {
      return res.status(400).json({ error: "Week start date is required" });
    }

    const weekStart = new Date(weekStartDate);
    weekStart.setHours(0, 0, 0, 0);

   
    
    // Delete existing schedule for this week and user
    const deleteResult = await WeeklySchedule.deleteMany({ 
      user_id: user_id, 
      weekStartDate: weekStart 
    });
    
    

    // Create new schedules
    const newSchedules = schedules.map(schedule => ({
      user_id: user_id,
      day: schedule.day,
      type: schedule.type,
      details: schedule.details,
      weekStartDate: weekStart,
      exercises: schedule.exercises || [],
      isActive: true
    }));

    const savedSchedules = await WeeklySchedule.insertMany(newSchedules);
    


    res.json(savedSchedules);
  } catch (err) {
    console.error('❌ Error updating weekly schedule:', err);
    res.status(500).json({ error: "Failed to update weekly schedule." });
  }
}

// Get recommended schedules
export async function getRecommendedSchedules(req, res) {
  try {
    const { category, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;

    const schedules = await RecommendedSchedule.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recommended schedules." });
  }
}

// Add recommended schedule (admin function)
export async function addRecommendedSchedule(req, res) {
  try {
    const schedule = new RecommendedSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: "Failed to add recommended schedule." });
  }
}