import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';

export const useCardio = () => {
  const [cardioWorkouts, setCardioWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [personalRecords, setPersonalRecords] = useState(null);

  const loadCardioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [workoutsData, statsData] = await Promise.all([
        fetchWithAuth('/cardio'),
        fetchWithAuth('/cardio/stats')
      ]);

      setCardioWorkouts(workoutsData || []);
      setStats(statsData || {});

      // Calculate personal records
      if (workoutsData && workoutsData.length > 0) {
        const records = {
          fastest5K: workoutsData
            .filter(w => w.distance >= 5 && w.distance <= 5.5)
            .sort((a, b) => a.duration - b.duration)[0],
          longestDistance: workoutsData
            .sort((a, b) => b.distance - a.distance)[0],
          bestPace: workoutsData
            .filter(w => w.distance > 0)
            .sort((a, b) => (a.duration / a.distance) - (b.duration / b.distance))[0]
        };
        setPersonalRecords(records);
      }
    } catch (err) {
      setError(err.message || 'Failed to load cardio data');
      console.error('Error loading cardio data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCardioWorkout = async (workoutId) => {
    try {
      await fetchWithAuth(`/cardio/${workoutId}`, {
        method: 'DELETE'
      });
      // Remove from local state
      setCardioWorkouts(prev => prev.filter(w => w.cardio_id !== workoutId));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete workout');
    }
  };

  useEffect(() => {
    loadCardioData();
  }, []);

  return {
    cardioWorkouts,
    loading,
    error,
    stats,
    personalRecords,
    refreshData: loadCardioData,
    deleteCardioWorkout
  };
};