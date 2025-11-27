import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';

export const useGoal = () => {
  const [goals, setGoals] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [recommendedSchedules, setRecommendedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Get all goals
  const fetchGoals = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const url = `/goals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await fetchWithAuth(url);
      setGoals(data.goals || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch goals');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single goal
  const fetchGoal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/goals/${id}`);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new goal
  const createGoal = async (goalData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/goals', {
        method: 'POST',
        body: JSON.stringify(goalData),
      });
      setGoals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update goal
  const updateGoal = async (id, goalData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(goalData),
      });
      setGoals(prev => 
        prev.map(goal => 
          goal.goal_id === parseInt(id) ? data : goal
        )
      );
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await fetchWithAuth(`/goals/${id}`, {
        method: 'DELETE',
      });
      setGoals(prev => 
        prev.filter(goal => goal.goal_id !== parseInt(id))
      );
    } catch (err) {
      setError(err.message || 'Failed to delete goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add goal progress
  const addGoalProgress = async (id, progressData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/goals/${id}/progress`, {
        method: 'POST',
        body: JSON.stringify(progressData),
      });
      setGoals(prev => 
        prev.map(goal => 
          goal.goal_id === parseInt(id) ? data : goal
        )
      );
      return data;
    } catch (err) {
      setError(err.message || 'Failed to add progress');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get goals statistics
  const fetchGoalsStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/goals/stats/summary');
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get weekly schedule
  const fetchWeeklySchedule = async (weekStartDate = null) => {
  setLoading(true);
  setError(null);
  try {
    const queryParams = weekStartDate ? `?weekStartDate=${weekStartDate}` : '';
    
    // ENDPOINT YANG BENAR:
    const data = await fetchWithAuth(`/goals/schedule/weekly${queryParams}`);
    
    console.log('📅 Weekly schedule fetched:', data);
    setWeeklySchedule(data || []);
    return data;
  } catch (err) {
    console.error('❌ Error fetching weekly schedule:', err);
    setError(err.message || 'Failed to fetch weekly schedule');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Update weekly schedule
 const updateWeeklySchedule = async (scheduleData) => {
  setLoading(true);
  setError(null);
  try {
    console.log('🔄 [useGoal] Starting updateWeeklySchedule...');
    console.log('📦 [useGoal] Schedule data to send:', scheduleData);
    
    // Validate data before sending
    if (!scheduleData.schedules || !Array.isArray(scheduleData.schedules)) {
      throw new Error('Invalid schedule data: schedules must be an array');
    }

    if (!scheduleData.weekStartDate) {
      throw new Error('Invalid schedule data: weekStartDate is required');
    }

    // Log each schedule item for debugging
    scheduleData.schedules.forEach((schedule, index) => {
      console.log(`📋 [useGoal] Schedule ${index + 1}:`, {
        day: schedule.day,
        type: schedule.type,
        details: schedule.details
      });
    });

    const data = await fetchWithAuth('/goals/schedule/weekly', {
      method: 'POST',
      body: scheduleData, // Sudah di-handle oleh fetchWithAuth
    });
    
    console.log('✅ [useGoal] Schedule updated successfully:', data);
    setWeeklySchedule(data);
    return data;
  } catch (err) {
    console.error('❌ [useGoal] Error updating weekly schedule:', {
      message: err.message,
      stack: err.stack
    });
    setError(err.message || 'Failed to update weekly schedule');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Get recommended schedules
  const fetchRecommendedSchedules = async (category = null) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = category ? `?category=${category}` : '';
      const data = await fetchWithAuth(`/goals/schedules/recommended${queryParams}`);
      setRecommendedSchedules(data || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch recommended schedules');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchGoals(),
      fetchWeeklySchedule(),
      fetchRecommendedSchedules(),
      fetchGoalsStats()
    ]);
  };

  // Initialize data
  useEffect(() => {
    fetchGoals();
    fetchWeeklySchedule();
    fetchRecommendedSchedules();
    fetchGoalsStats();
  }, []);

  return {
    goals,
    weeklySchedule,
    recommendedSchedules,
    loading,
    error,
    stats,
    fetchGoals,
    fetchGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    addGoalProgress,
    fetchGoalsStats,
    fetchWeeklySchedule,
    updateWeeklySchedule,
    fetchRecommendedSchedules,
    refreshData
  };
};