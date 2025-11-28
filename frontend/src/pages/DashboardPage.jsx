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
  AreaChart,
  Area,
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({
  userProfile,
  setModalType,
  setShowModal,
  strengthWorkouts,
  cardioWorkouts,
  setSelectedWorkoutId,
}) => {
  const [timeRange, setTimeRange] = useState('3months');
  const [chartType, setChartType] = useState('volume');
  const [processedData, setProcessedData] = useState({
    volumeData: [],
    distanceData: [],
    combinedData: [],
    stats: {}
  });
   const navigate = useNavigate();
  const token = localStorage.getItem("token");
    
      useEffect(() => {
        if (!token) {
          navigate("/");
        }
      }, [token, navigate]);

  // Process data when workouts change
  useEffect(() => {
    const processData = () => {
      // Process strength volume data
      const volumeData = (strengthWorkouts ?? [])
        .map(w => ({
          date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: w.date,
          volume: w.totalVolume || 0,
          type: 'strength'
        }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

      // Process cardio distance data
      const distanceData = (cardioWorkouts ?? [])
        .map(w => ({
          date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: w.date,
          distance: w.distance || 0,
          duration: w.duration || 0,
          type: 'cardio'
        }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

      // Combine data for mixed charts
      const combinedData = [...volumeData, ...distanceData]
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        .slice(-30); // Last 30 entries

      // Calculate statistics
      const totalStrengthVolume = volumeData.reduce((sum, item) => sum + item.volume, 0);
      const totalCardioDistance = distanceData.reduce((sum, item) => sum + item.distance, 0);
      const totalCardioDuration = distanceData.reduce((sum, item) => sum + item.duration, 0);
      const totalWorkouts = (strengthWorkouts?.length || 0) + (cardioWorkouts?.length || 0);

      // Calculate streak (simplified - you might want to implement more sophisticated logic)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const hasWorkoutToday = combinedData.some(item => 
        new Date(item.fullDate).toDateString() === today.toDateString()
      );
      const hasWorkoutYesterday = combinedData.some(item => 
        new Date(item.fullDate).toDateString() === yesterday.toDateString()
      );

      const streak = hasWorkoutToday && hasWorkoutYesterday ? 2 : hasWorkoutToday ? 1 : 0;

      // Calculate consistency (percentage of days with workouts in last 30 days)
      const last30Days = new Array(30).fill().map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toDateString();
      });

      const workoutDays = last30Days.filter(day => 
        combinedData.some(item => new Date(item.fullDate).toDateString() === day)
      ).length;

      const consistency = Math.round((workoutDays / 30) * 100);

      setProcessedData({
        volumeData,
        distanceData,
        combinedData,
        stats: {
          totalStrengthVolume,
          totalCardioDistance,
          totalCardioDuration,
          totalWorkouts,
          streak,
          consistency,
          strengthWorkouts: strengthWorkouts?.length || 0,
          cardioWorkouts: cardioWorkouts?.length || 0
        }
      });
    };

    processData();
  }, [strengthWorkouts, cardioWorkouts]);

  // Filter data based on time range
  const filterDataByTimeRange = (data) => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
      default:
        return data;
    }

    return data.filter(item => new Date(item.fullDate) >= cutoffDate);
  };

  // Calculate 1RM estimates (simplified - using Epley formula)
  const calculate1RMData = () => {
    if (!strengthWorkouts?.length) return [];

    const exercises = {};
    
    strengthWorkouts.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        if (!exercises[exercise.name]) {
          exercises[exercise.name] = [];
        }

        // Find heaviest set for this exercise
        const maxSet = exercise.sets?.reduce((max, set) => {
          const weight = set.weight || 0;
          const reps = set.reps || 0;
          // Epley formula: 1RM = weight × (1 + reps/30)
          const estimated1RM = weight * (1 + reps / 30);
          return estimated1RM > max.estimated1RM ? { weight, reps, estimated1RM } : max;
        }, { weight: 0, reps: 0, estimated1RM: 0 });

        if (maxSet.estimated1RM > 0) {
          exercises[exercise.name].push({
            date: workout.date,
            estimated1RM: Math.round(maxSet.estimated1RM),
            weight: maxSet.weight,
            reps: maxSet.reps
          });
        }
      });
    });

    // Get latest 1RM for each exercise
    const latest1RM = Object.entries(exercises).map(([exercise, data]) => {
      const latest = data.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      return {
        exercise,
        '1RM': latest.estimated1RM,
        date: latest.date
      };
    });

    return latest1RM.slice(0, 5); // Top 5 exercises
  };

  const filteredVolumeData = filterDataByTimeRange(processedData.volumeData);
  const filteredDistanceData = filterDataByTimeRange(processedData.distanceData);
  const oneRMData = calculate1RMData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Progress Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Chart Type:</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="volume">Training Volume</option>
              <option value="distance">Cardio Distance</option>
              <option value="1rm">1RM Progress</option>
              <option value="combined">Combined Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Strength Volume</p>
          <p className="text-2xl font-bold mt-1">
            {Math.round(processedData.stats.totalStrengthVolume / 1000)}k kg
          </p>
          <p className="text-xs opacity-75 mt-1">{processedData.stats.strengthWorkouts} workouts</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Cardio Distance</p>
          <p className="text-2xl font-bold mt-1">
            {processedData.stats.totalCardioDistance} km
          </p>
          <p className="text-xs opacity-75 mt-1">{processedData.stats.cardioWorkouts} sessions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Current Streak</p>
          <p className="text-2xl font-bold mt-1">
            {processedData.stats.streak} days
          </p>
          <p className="text-xs opacity-75 mt-1">Keep going!</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Consistency</p>
          <p className="text-2xl font-bold mt-1">
            {processedData.stats.consistency}%
          </p>
          <p className="text-xs opacity-75 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {chartType === 'volume' && 'Strength Training Volume Trend'}
          {chartType === 'distance' && 'Cardio Distance Trend'}
          {chartType === '1rm' && 'Estimated 1RM Progress'}
          {chartType === 'combined' && 'Combined Training Progress'}
        </h2>
        
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'volume' && (
            <LineChart data={filteredVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} kg`, 'Volume']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                name="Volume (kg)" 
              />
            </LineChart>
          )}

          {chartType === 'distance' && (
            <LineChart data={filteredDistanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value} km`, 'Distance']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="distance" 
                stroke="#a855f7" 
                strokeWidth={3} 
                dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 2 }}
                name="Distance (km)" 
              />
            </LineChart>
          )}

          {chartType === '1rm' && oneRMData.length > 0 && (
            <BarChart data={oneRMData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="exercise" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value} kg`, '1RM']}
              />
              <Legend />
              <Bar 
                dataKey="1RM" 
                fill="#6366f1" 
                name="Estimated 1RM (kg)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}

          {chartType === '1rm' && oneRMData.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No strength data available for 1RM calculation</p>
              </div>
            </div>
          )}

          {chartType === 'combined' && (
            <AreaChart data={processedData.combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stackId="1"
                stroke="#6366f1" 
                fill="#6366f1" 
                fillOpacity={0.6}
                name="Strength Volume (kg)" 
              />
              <Area 
                type="monotone" 
                dataKey="distance" 
                stackId="2"
                stroke="#a855f7" 
                fill="#a855f7" 
                fillOpacity={0.6}
                name="Cardio Distance (km)" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Additional Cardio Progress Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Cardio Performance Overview</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={filteredDistanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'distance') return [`${value} km`, 'Distance'];
                if (name === 'duration') return [`${value} min`, 'Duration'];
                return [value, name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="distance" 
              fill="#a855f7" 
              name="Distance (km)"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="duration" 
              fill="#f59e0b" 
              name="Duration (min)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => { setModalType('strength'); setShowModal(true); }}
              className="w-full flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span className="font-medium">Add Strength Workout</span>
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setModalType('cardio'); setShowModal(true); }}
              className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="font-medium">Add Cardio Session</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
          <div className="space-y-3">
            {processedData.combinedData.slice(-3).reverse().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    item.type === 'strength' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {item.type === 'strength' ? <Dumbbell className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {item.type === 'strength' ? 'Strength Training' : 'Cardio Session'}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {item.type === 'strength' ? `${item.volume.toLocaleString()} kg` : `${item.distance} km`}
                  </p>
                </div>
              </div>
            ))}
            {processedData.combinedData.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;