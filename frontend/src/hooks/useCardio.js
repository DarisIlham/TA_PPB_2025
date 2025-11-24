import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';

export const useCardio = () => {
  const [cardioWorkouts, setCardioWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [personalRecords, setPersonalRecords] = useState(null);

  // Get all cardio workouts
  const fetchCardioWorkouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/cardio?limit=100&sort=-date');
      // Handle both response formats
      const workouts = data.cardioWorkouts || data;
      setCardioWorkouts(Array.isArray(workouts) ? workouts : []);
      return workouts;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch cardio workouts';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single cardio workout
  const fetchCardioWorkout = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/cardio/${id}`);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch cardio workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create new cardio workout
  const createCardioWorkout = async (workoutData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/cardio', {
        method: 'POST',
        body: JSON.stringify(workoutData),
      });
      setCardioWorkouts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create cardio workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cardio workout
  const updateCardioWorkout = async (id, workoutData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth(`/cardio/${id}`, {
        method: 'PUT',
        body: JSON.stringify(workoutData),
      });
      setCardioWorkouts(prev => 
        prev.map(workout => 
          workout.cardio_id === parseInt(id) ? data : workout
        )
      );
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update cardio workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete cardio workout
  const deleteCardioWorkout = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await fetchWithAuth(`/cardio/${id}`, {
        method: 'DELETE',
      });
      setCardioWorkouts(prev => 
        prev.filter(workout => workout.cardio_id !== parseInt(id))
      );
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete cardio workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get cardio statistics
  const fetchCardioStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth('/cardio/stats/summary');
      setStats(data);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch cardio stats';
      setError(errorMsg);
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
      const data = await fetchWithAuth('/cardio/stats/prs');
      setPersonalRecords(data);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch cardio PRs';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    try {
      await Promise.all([
        fetchCardioWorkouts(),
        fetchCardioStats(),
        fetchPersonalRecords()
      ]);
    } catch (err) {
      console.error('Error refreshing cardio data:', err);
      throw err;
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCardioWorkouts(),
          fetchCardioStats(),
          fetchPersonalRecords()
        ]);
      } catch (err) {
        console.error('Error loading initial cardio data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return {
    cardioWorkouts,
    loading,
    error,
    stats,
    personalRecords,
    fetchCardioWorkouts,
    fetchCardioWorkout,
    createCardioWorkout,
    updateCardioWorkout,
    deleteCardioWorkout,
    fetchCardioStats,
    fetchPersonalRecords,
    refreshData
  };
};