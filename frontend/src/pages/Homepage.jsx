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
const Homepage = ({
  userProfile,
  setModalType,
  setShowModal,
  strengthWorkouts,
  cardioWorkouts,
  setSelectedWorkoutId,
  // setCurrentPage, // Remove if using React Router navigation
}) => {
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
      (sum, w) => sum + w.totalVolume,
      0
    );
    const totalDistance = weeklyCardio.reduce((sum, w) => sum + w.distance, 0);
    const totalCalories = weeklyCardio.reduce((sum, w) => sum + w.calories, 0);
    return {
      totalVolume,
      totalDistance,
      totalCalories,
      workouts: weeklyStrength.length + weeklyCardio.length,
    };
  };
  const summary = getWeeklySummary();
  const lastWorkout = [...strengthWorkouts, ...cardioWorkouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {userProfile.name}!
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
              <p className="text-sm text-gray-600">{lastWorkout.date}</p>
            </div>
            <button
              onClick={() => {
                setSelectedWorkoutId(lastWorkout.id);
                setCurrentPage(
                  lastWorkout.name ? "strength-detail" : "cardio-detail"
                );
              }}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View Details <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

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
