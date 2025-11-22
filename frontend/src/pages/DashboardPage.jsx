  // Dashboard Page
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
  const DashboardPage = ({
  userProfile,
  setModalType,
  setShowModal,
  strengthWorkouts,
  cardioWorkouts,
  setSelectedWorkoutId,
  // setCurrentPage, // Remove if using React Router navigation
}) => {
    const [timeRange, setTimeRange] = useState('3months');
    const [chartType, setChartType] = useState('volume');

    // Prepare chart data
    const volumeData = strengthWorkouts.map(w => ({
      date: w.date,
      volume: w.totalVolume
    })).reverse();

    const distanceData = cardioWorkouts.map(w => ({
      date: w.date,
      distance: w.distance
    })).reverse();

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="volume">Training Volume</option>
              <option value="distance">Cardio Distance</option>
              <option value="1rm">1RM Progress</option>
            </select>
          </div>
        </div>

        {/* Volume Chart */}
        {chartType === 'volume' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Training Volume Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={2} name="Volume (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Distance Chart */}
        {chartType === 'distance' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Cardio Distance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="distance" stroke="#a855f7" strokeWidth={2} name="Distance (km)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 1RM Progress */}
        {chartType === '1rm' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Estimated 1RM Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { exercise: 'Bench Press', '1RM': 80 },
                { exercise: 'Squat', '1RM': 100 },
                { exercise: 'Deadlift', '1RM': 120 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exercise" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="1RM" fill="#6366f1" name="1RM (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600">Current Streak</h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-indigo-600">7 days</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600">Total Workouts</h3>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{strengthWorkouts.length + cardioWorkouts.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-600">Consistency</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">87%</p>
          </div>
        </div>
      </div>
    );
  };
export default DashboardPage;