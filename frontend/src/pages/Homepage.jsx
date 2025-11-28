// Home Page
import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Info,
  Dumbbell,
  Heart,
  BarChart3,
  Target,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Activity,
  ChevronRight,
  Edit,
  Trash2,
  Save,
  X,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStrength } from "../hooks/useStrength";
import { useCardio } from "../hooks/useCardio";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Homepage = ({
  userProfile,
  setModalType,
  setShowModal,
  setSelectedWorkoutId,
}) => {
  const { strengthWorkouts, loading: strengthLoading, error: strengthError } = useStrength();
  const { cardioWorkouts, loading: cardioLoading, error: cardioError } = useCardio();
  const [currentUserProfile, setCurrentUserProfile] = useState(userProfile);
  const navigate = useNavigate();
    const token = localStorage.getItem("token");
    useEffect(() => {
      if (!token) {
        navigate("/");
      }
    }, [token, navigate]);

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUserProfile(prev => ({
            ...prev,
            name: data.user.name,
            email: data.user.email
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Only fetch if userProfile doesn't have name or we want to refresh
    if (!userProfile?.name) {
      fetchUserProfile();
    } else {
      setCurrentUserProfile(userProfile);
    }
  }, [userProfile]);

  // Calculate Weekly Summary
  const getWeeklySummary = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyStrength = strengthWorkouts.filter(
      (w) => new Date(w.date) >= weekAgo
    );
    const weeklyCardio = cardioWorkouts.filter(
      (w) => new Date(w.date) >= weekAgo
    );
    
    const totalVolume = weeklyStrength.reduce(
      (sum, w) => sum + (w.totalVolume || 0),
      0
    );
    const totalDistance = weeklyCardio.reduce(
      (sum, w) => sum + (w.distance || 0),
      0
    );
    const totalCalories = weeklyCardio.reduce(
      (sum, w) => sum + (w.calories || 0),
      0
    );
    
    return {
      totalVolume,
      totalDistance,
      totalCalories,
      workouts: weeklyStrength.length + weeklyCardio.length,
    };
  };

  const summary = getWeeklySummary();
  
  // Get latest workout
  const lastWorkout = [...strengthWorkouts, ...cardioWorkouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (strengthLoading || cardioLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading workouts...</span>
      </div>
    );
  }

  // Error state
  if (strengthError || cardioError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-red-600">
        <div className="text-lg font-semibold mb-2">Error loading data</div>
        <p className="text-sm text-center">
          {strengthError || cardioError}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUserProfile?.name || 'User'}!
        </h1>
        <p className="text-indigo-100">Ready to forge your fitness journey?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setModalType("strength");
            setShowModal(true);
          }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-indigo-200 hover:border-indigo-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Dumbbell className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Log Strength Workout</h3>
                <p className="text-sm text-gray-600">
                  Track your lifting session
                </p>
              </div>
            </div>
            <Plus className="w-6 h-6 text-indigo-600" />
          </div>
        </button>

        <button
          onClick={() => {
            setModalType("cardio");
            setShowModal(true);
          }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-purple-200 hover:border-purple-400"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Log Cardio Session</h3>
                <p className="text-sm text-gray-600">
                  Record your cardio activity
                </p>
              </div>
            </div>
            <Plus className="w-6 h-6 text-purple-600" />
          </div>
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
          This Week's Progress
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Workouts</p>
            <p className="text-2xl font-bold text-indigo-600">
              {summary.workouts}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Volume Lifted</p>
            <p className="text-2xl font-bold text-purple-600">
              {summary.totalVolume.toLocaleString()} kg
            </p>
          </div>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Distance</p>
            <p className="text-2xl font-bold text-pink-600">
              {summary.totalDistance.toFixed(1)} km
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Calories</p>
            <p className="text-2xl font-bold text-orange-600">
              {summary.totalCalories.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Workout Count Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-indigo-600" />
            Strength Workouts
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {strengthWorkouts.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total sessions logged</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-purple-600" />
            Cardio Sessions
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {cardioWorkouts.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total sessions logged</p>
        </div>
      </div>

      {/* Latest Session */}
      {lastWorkout && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-600" />
            Latest Session
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-lg">
                {lastWorkout.name || lastWorkout.type}
              </p>
              <p className="text-sm text-gray-600">
                {formatDate(lastWorkout.date)}
              </p>
              {lastWorkout.strength_id && (
                <p className="text-xs text-gray-500 mt-1">
                  {lastWorkout.exercises?.length || 0} exercises • {lastWorkout.totalVolume?.toLocaleString() || 0} kg volume
                </p>
              )}
              {lastWorkout.cardio_id && (
                <p className="text-xs text-gray-500 mt-1">
                  {lastWorkout.distance} km • {lastWorkout.duration} min
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedWorkoutId(lastWorkout.strength_id || lastWorkout.cardio_id);
                // Navigate to appropriate detail page based on workout type
                if (lastWorkout.strength_id) {
                  window.location.href = `/strength-detail/${lastWorkout.strength_id}`;
                } else {
                  window.location.href = `/cardio-detail/${lastWorkout.cardio_id}`;
                }
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity Preview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[...strengthWorkouts, ...cardioWorkouts]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map((workout, index) => (
              <div key={workout.strength_id || workout.cardio_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {workout.strength_id ? (
                    <Dumbbell className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Heart className="w-4 h-4 text-purple-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {workout.name || workout.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(workout.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {workout.strength_id ? (
                    <p className="text-sm font-semibold text-indigo-600">
                      {workout.totalVolume?.toLocaleString()} kg
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-purple-600">
                      {workout.distance} km
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-lg mb-2">💪 Daily Motivation</h3>
        <p className="text-amber-50">
          "Success is the sum of small efforts repeated day in and day out."
        </p>
      </div>
    </div>
  );
};

export default Homepage;