import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Activity,
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
  Clock,
  MapPin
} from "lucide-react";
import { useCardio } from "../hooks/useCardio";

const CardioListPage = ({ 
  setModalType, 
  setShowModal
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    cardioWorkouts,
    loading,
    error,
    stats,
    personalRecords,
    refreshData,
    deleteCardioWorkout
  } = useCardio();

  // Filter and sort workouts
  const filteredWorkouts = cardioWorkouts
    .filter(w => {
      const matchesSearch = w.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           w.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'running') return matchesSearch && w.activityType.toLowerCase().includes('running');
      if (filterType === 'cycling') return matchesSearch && w.activityType.toLowerCase().includes('cycling');
      if (filterType === 'swimming') return matchesSearch && w.activityType.toLowerCase().includes('swimming');
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'distance':
          return b.distance - a.distance;
        case 'duration':
          return b.duration - a.duration;
        case 'pace':
          return (a.duration / a.distance) - (b.duration / b.distance);
        default:
          return 0;
      }
    });

  // Calculate pace (min/km)
  const calculatePace = (workout) => {
    if (!workout.distance || !workout.duration) return 0;
    return (workout.duration / workout.distance).toFixed(2);
  };

  // Handle delete workout
  const handleDeleteWorkout = async (workoutId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteCardioWorkout(workoutId);
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
    navigate(`/cardio-detail/${workoutId}`);
  };

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/home');
  };

  // Calculate total distance
  const totalDistance = cardioWorkouts.reduce((sum, w) => sum + w.distance, 0);
  
  // Calculate total duration
  const totalDuration = cardioWorkouts.reduce((sum, w) => sum + w.duration, 0);

  if (loading && cardioWorkouts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-2 text-gray-600">Loading workouts...</span>
      </div>
    );
  }

  if (error && cardioWorkouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-red-600">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Error loading workouts: {error}</p>
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <div className="border-l border-gray-300 h-6"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Activity className="w-8 h-8 mr-3 text-purple-600" />
              Cardio Training Log
            </h1>
            <p className="text-gray-600 mt-1">Track and analyze your cardio training progress</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <button
          onClick={() => { setModalType('cardio'); setShowModal(true); }}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Session</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Sessions</p>
          <p className="text-3xl font-bold mt-1">{cardioWorkouts.length}</p>
          <p className="text-xs opacity-75 mt-1">All time sessions</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Distance</p>
          <p className="text-3xl font-bold mt-1">{totalDistance.toFixed(1)}</p>
          <p className="text-xs opacity-75 mt-1">kilometers total</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Total Time</p>
          <p className="text-3xl font-bold mt-1">
            {Math.round(totalDuration / 60)}h {totalDuration % 60}m
          </p>
          <p className="text-xs opacity-75 mt-1">training time</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-6 h-6 opacity-80" />
            <TrendingUp className="w-4 h-4 opacity-60" />
          </div>
          <p className="text-sm opacity-90 font-medium">Avg Pace</p>
          <p className="text-3xl font-bold mt-1">
            {cardioWorkouts.length > 0 ? (totalDuration / totalDistance).toFixed(2) : '0'}/km
          </p>
          <p className="text-xs opacity-75 mt-1">minutes per km</p>
        </div>
      </div>

      {/* Personal Records */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <Award className="w-5 h-5 mr-2 text-yellow-500" />
          Personal Records
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Fastest 5K</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.fastest5K ? `${personalRecords.fastest5K.duration} min` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Best 5K time</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Longest Run</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.longestDistance ? `${personalRecords.longestDistance.distance} km` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Longest distance</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
            <p className="text-sm text-gray-600 font-medium mb-1">Best Pace</p>
            <p className="text-3xl font-bold text-yellow-700">
              {personalRecords?.bestPace ? `${personalRecords.bestPace.pace}/km` : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Fastest pace</p>
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
              placeholder="Search by activity type or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="distance">Sort by Distance</option>
              <option value="duration">Sort by Duration</option>
              <option value="pace">Sort by Pace</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${
              showFilters ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Filter by activity type:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Activities' },
                { value: 'running', label: 'Running' },
                { value: 'cycling', label: 'Cycling' },
                { value: 'swimming', label: 'Swimming' },
                { value: 'rowing', label: 'Rowing' },
                { value: 'walking', label: 'Walking' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterType(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === filter.value
                      ? 'bg-purple-600 text-white'
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
          Showing <span className="font-semibold text-purple-600">{filteredWorkouts.length}</span> of{' '}
          <span className="font-semibold">{cardioWorkouts.length}</span> sessions
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-purple-600 hover:text-purple-800 font-medium"
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
                  Activity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Pace
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
                    key={workout.cardio_id} 
                    className="hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleViewWorkout(workout.cardio_id)}
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
                        <div className="bg-purple-100 p-2 rounded">
                          <Activity className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{workout.activityType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{workout.location || 'Not specified'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-purple-600">
                        {workout.distance} km
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {workout.duration} min
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {calculatePace(workout)}/km
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWorkout(workout.cardio_id);
                          }}
                          className="text-purple-600 hover:text-purple-800 font-semibold hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => handleDeleteWorkout(workout.cardio_id, e)}
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
                      <Activity className="w-12 h-12 mb-3 opacity-30" />
                      <p className="text-lg font-medium">No sessions found</p>
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

export default CardioListPage;