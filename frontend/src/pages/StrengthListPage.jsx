import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Dumbbell,
  Plus,
  Search,
  ChevronDown,
  TrendingUp,
  Award,
  Calendar,
  SlidersHorizontal,
  Loader,
  AlertCircle,
  RefreshCw,
  ArrowLeft, 
} from "lucide-react";
import { useStrength } from "../hooks/useStrength";

const StrengthListPage = ({ 
  setModalType, 
  setShowModal
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    strengthWorkouts,
    loading,
    error,
    stats,
    personalRecords,
    refreshData,
    deleteStrengthWorkout
  } = useStrength();
  
      const token = localStorage.getItem("token");
      useEffect(() => {
        if (!token) {
          navigate("/");
        }
      }, [token, navigate]);

  // Filter and sort workouts
  const filteredWorkouts = strengthWorkouts
    .filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           w.exercises.some(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'push') return matchesSearch && w.name.toLowerCase().includes('push');
      if (filterType === 'pull') return matchesSearch && w.name.toLowerCase().includes('pull');
      if (filterType === 'legs') return matchesSearch && w.name.toLowerCase().includes('leg');
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'volume':
          return b.totalVolume - a.totalVolume;
        case 'duration':
          return b.duration - a.duration;
        case 'rpe':
          return (b.rpe || 0) - (a.rpe || 0);
        default:
          return 0;
      }
    });

  // Handle delete workout
   const handleDeleteWorkout = async (workoutId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteStrengthWorkout(workoutId);
      } catch (err) {
        alert('Failed to delete workout: ' + err.message);
      }
    }
  };

  // Handle refresh data
   const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  // Navigate to workout detail
  const handleViewWorkout = (workoutId) => {
    navigate(`/strength-detail/${workoutId}`);
  };

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading && strengthWorkouts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading workouts...</span>
      </div>
    );
  }

    if (error && strengthWorkouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Error loading workouts: {error}</p>
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
          <button 
            onClick={handleBackToHome}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
       {/* Header dengan back button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Dumbbell className="w-8 h-8 mr-3 text-indigo-600" />
              Strength Training Log
            </h1>
            <p className="text-gray-600 mt-1">Track and analyze your strength training progress</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <button
          onClick={() => { setModalType('strength'); setShowModal(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Workout</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Dumbbell className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Workouts</p>
          <p className="text-3xl font-bold mt-1">{strengthWorkouts.length}</p>
          <p className="text-xs opacity-75 mt-1">All time sessions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Volume</p>
          <p className="text-3xl font-bold mt-1">
            {stats ? `${(stats.summary?.totalVolume / 1000).toFixed(1)}k` : '0k'}
          </p>
          <p className="text-xs opacity-75 mt-1">kg lifted total</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Avg Volume</p>
          <p className="text-3xl font-bold mt-1">
            {stats ? `${(stats.summary?.totalVolume / (strengthWorkouts.length * 1000) || 0).toFixed(1)}k` : '0k'}
          </p>
          <p className="text-xs opacity-75 mt-1">kg per session</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Time</p>
          <p className="text-3xl font-bold mt-1">
            {stats ? `${(stats.summary?.totalDuration / 60).toFixed(1)}h` : '0h'}
          </p>
          <p className="text-xs opacity-75 mt-1">training hours</p>
        </div>
      </div>

      {/* 1RM Estimates */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Personal Records
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Bench Press</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.maxWeight?.['Bench Press']?.weight || 'N/A'} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">Max weight recorded</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Squat</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.maxWeight?.['Squat']?.weight || 'N/A'} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">Max weight recorded</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Deadlift</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.maxWeight?.['Deadlift']?.weight || 'N/A'} kg
            </p>
            <p className="text-xs text-gray-500 mt-1">Max weight recorded</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search workouts or exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="volume">Sort by Volume</option>
              <option value="duration">Sort by Duration</option>
              <option value="rpe">Sort by RPE</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${
              showFilters ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by workout type:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Workouts' },
                { value: 'push', label: 'Push Days' },
                { value: 'pull', label: 'Pull Days' },
                { value: 'legs', label: 'Leg Days' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === filter.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing <span className="font-semibold text-indigo-600">{filteredWorkouts.length}</span> of{' '}
          <span className="font-semibold">{strengthWorkouts.length}</span> workouts
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Workouts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Workout Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Exercises
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  RPE
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((workout) => (
                  <tr 
                    key={workout.strength_id} 
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                    onClick={() => handleViewWorkout(workout.strength_id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {new Date(workout.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="bg-indigo-100 p-2 rounded">
                          <Dumbbell className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{workout.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {workout.exercises.length} exercises
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-indigo-600">
                        {workout.totalVolume.toLocaleString()} kg
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {workout.duration} min
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        workout.rpe >= 9 ? 'bg-red-100 text-red-700' :
                        workout.rpe >= 7 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {workout.rpe || 'N/A'}/10
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWorkout(workout.strength_id);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDeleteWorkout(workout.strength_id, e)}
                          className="text-red-600 hover:text-red-800 font-semibold hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Dumbbell className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-lg font-medium">No workouts found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StrengthListPage;