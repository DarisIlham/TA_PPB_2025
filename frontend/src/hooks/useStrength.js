import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';

export const useStrength = () => {
  const [strengthWorkouts, setStrengthWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [personalRecords, setPersonalRecords] = useState(null);

  // Get all strength workouts
  const fetchStrengthWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/strength?limit=100&sort=-date');
      setStrengthWorkouts(data.strengthWorkouts || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch workouts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single strength workout
  const fetchStrengthWorkout = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/strength/${id}`);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new strength workout
  const createStrengthWorkout = async (workoutData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/strength', {
        method: 'POST',
        body: JSON.stringify(workoutData),
      });
      setStrengthWorkouts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update strength workout
  const updateStrengthWorkout = async (id, workoutData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/strength/${id}`, {
        method: 'PUT',
        body: JSON.stringify(workoutData),
      });
      setStrengthWorkouts(prev => 
        prev.map(workout => 
          workout.strength_id === parseInt(id) ? data : workout
        )
      );
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete strength workout
  const deleteStrengthWorkout = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await fetchWithAuth(`/strength/${id}`, {
        method: 'DELETE',
      });
      setStrengthWorkouts(prev => 
        prev.filter(workout => workout.strength_id !== parseInt(id))
      );
    } catch (err) {
      setError(err.message || 'Failed to delete workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get strength statistics
  const fetchStrengthStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/strength/stats/summary');
      setStats(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get personal records
  const fetchPersonalRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/strength/stats/prs');
      setPersonalRecords(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch PRs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchStrengthWorkouts(),
      fetchStrengthStats(),
      fetchPersonalRecords()
    ]);
  };

  useEffect(() => {
    fetchStrengthWorkouts();
    fetchStrengthStats();
    fetchPersonalRecords();
  }, []);

  return {
    strengthWorkouts,
    loading,
    error,
    stats,
    personalRecords,
    fetchStrengthWorkouts,
    fetchStrengthWorkout,
    createStrengthWorkout,
    updateStrengthWorkout,
    deleteStrengthWorkout,
    fetchStrengthStats,
    fetchPersonalRecords,
    refreshData
  };
};