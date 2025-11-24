import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award,
  Edit,
  Trash2,
  Loader,
  AlertCircle,
  BarChart3,
  MapPin
} from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';
import WorkoutModal from '../components/WorkoutModal'; // Import WorkoutModal instead of CardioModal

const CardioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Fetch workout data
  useEffect(() => {
    const loadWorkoutData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching cardio workout with ID:', id);
        
        const workoutData = await fetchWithAuth(`/cardio/${id}`);
        console.log('Cardio workout data received:', workoutData);
        
        if (workoutData) {
          setWorkout(workoutData);
        } else {
          setError('Cardio workout not found');
        }
      } catch (err) {
        console.error('Error loading cardio workout:', err);
        setError(err.message || 'Failed to load cardio workout data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadWorkoutData();
    }
  }, [id]);

  // Handle delete workout
  const handleDeleteWorkout = async () => {
    if (window.confirm('Are you sure you want to delete this cardio workout? This action cannot be undone.')) {
      try {
        setLoading(true);
        await fetchWithAuth(`/cardio/${id}`, {
          method: 'DELETE'
        });
        navigate('/cardio');
      } catch (err) {
        alert('Failed to delete cardio workout: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit workout - FIXED
  const handleEditWorkout = () => {
    if (workout) {
      console.log('Editing workout:', workout);
      setEditingWorkout(workout);
      setShowEditModal(true);
    }
  };

  // Handle success edit
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingWorkout(null);
    // Refresh data by refetching
    const loadWorkoutData = async () => {
      try {
        setLoading(true);
        const workoutData = await fetchWithAuth(`/cardio/${id}`);
        setWorkout(workoutData);
      } catch (err) {
        console.error('Error refreshing workout data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkoutData();
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingWorkout(null);
  };

  const handleExportPDF = () => {
    if (!workout) return;
    
    const printWindow = window.open('', '_blank');
    const workoutDate = new Date(workout.date).toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${workout.type} - ${workoutDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
            .metric { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${workout.type} Session</h1>
            <p>${workoutDate}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <strong>Distance</strong><br>
              ${workout.distance} km
            </div>
            <div class="metric">
              <strong>Duration</strong><br>
              ${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m
            </div>
            <div class="metric">
              <strong>Pace</strong><br>
              ${workout.pace || 'N/A'}
            </div>
            <div class="metric">
              <strong>Calories</strong><br>
              ${workout.calories || 'N/A'}
            </div>
          </div>

          <div class="details">
            <h2>Session Details</h2>
            <table>
              <tr>
                <th>Activity Type</th>
                <td>${workout.type}</td>
              </tr>
              <tr>
                <th>Distance</th>
                <td>${workout.distance} km</td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>${Math.floor(workout.duration / 60)}h ${workout.duration % 60}m</td>
              </tr>
              ${workout.pace ? `<tr><th>Pace</th><td>${workout.pace}</td></tr>` : ''}
              ${workout.calories ? `<tr><th>Calories</th><td>${workout.calories} cal</td></tr>` : ''}
              ${workout.location ? `<tr><th>Location</th><td>${workout.location}</td></tr>` : ''}
              ${workout.notes ? `<tr><th>Notes</th><td>${workout.notes}</td></tr>` : ''}
            </table>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Calculate average speed
  const calculateSpeed = () => {
    if (!workout || !workout.distance || !workout.duration) return null;
    const hours = workout.duration / 60;
    return (workout.distance / hours).toFixed(2);
  };

  // Loading state
  if (loading && !workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading cardio workout details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error ? 'Error Loading Workout' : 'Workout Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The cardio workout you are looking for does not exist.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/cardio')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Cardio
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/cardio"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cardio
              </Link>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleEditWorkout}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDeleteWorkout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 capitalize">{workout.type}</h1>
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(workout.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(workout.duration)}</span>
                    </div>
                    {workout.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{workout.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white px-4 py-3 rounded-lg">
                  <div className="text-sm font-medium opacity-90">Distance</div>
                  <div className="text-2xl font-bold">
                    {workout.distance} km
                  </div>
                </div>
              </div>
            </div>

            {workout.notes && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Notes</h3>
                <p className="text-blue-800">{workout.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Session Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Session Details
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Activity Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{workout.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Distance</span>
                  <span className="font-semibold text-blue-600">{workout.distance} km</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration</span>
                  <span className="font-semibold text-gray-900">{formatDuration(workout.duration)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {workout.pace && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Pace</span>
                    <span className="font-semibold text-green-600">{workout.pace}</span>
                  </div>
                )}
                {workout.calories && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Calories Burned</span>
                    <span className="font-semibold text-orange-600">{workout.calories} cal</span>
                  </div>
                )}
                {workout.location && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Location</span>
                    <span className="font-semibold text-gray-900">{workout.location}</span>
                  </div>
                )}
                {calculateSpeed() && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Average Speed</span>
                    <span className="font-semibold text-purple-600">{calculateSpeed()} km/h</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Distance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Distance</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Distance</span>
                <span className="font-semibold text-blue-600">
                  {workout.distance} km
                </span>
              </div>
              {workout.pace && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Pace</span>
                  <span className="font-semibold text-green-600">{workout.pace}</span>
                </div>
              )}
            </div>
          </div>

          {/* Duration Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Duration</h3>
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time</span>
                <span className="font-semibold text-purple-600">
                  {formatDuration(workout.duration)}
                </span>
              </div>
              {calculateSpeed() && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Speed</span>
                  <span className="font-semibold text-gray-900">
                    {calculateSpeed()} km/h
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Calories Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Energy</h3>
              <Award className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-2">
              {workout.calories ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories Burned</span>
                    <span className="font-semibold text-orange-600">{workout.calories} cal</span>
                  </div>
                  {workout.duration > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calories/Hour</span>
                      <span className="font-semibold text-gray-900">
                        {Math.round((workout.calories / workout.duration) * 60)} cal/h
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">No calorie data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/cardio')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Cardio
          </button>
          <button
            onClick={handleEditWorkout}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Edit Workout
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Export as PDF
          </button>
        </div>
      </div>

      {/* Edit Workout Modal */}
      {showEditModal && (
        <WorkoutModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          modalType="cardio"
          selectedWorkoutId={id}
          setSelectedWorkoutId={() => {}}
          editingWorkout={editingWorkout}
          onSuccess={handleEditSuccess}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CardioDetailPage;