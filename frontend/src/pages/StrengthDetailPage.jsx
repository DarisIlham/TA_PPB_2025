import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Dumbbell, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award,
  Edit,
  Trash2,
  Loader,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react';
import { fetchWithAuth } from '../../utils/api';
import WorkoutModal from '../components/WorkoutModal'; // Import WorkoutModal

const StrengthDetailPage = () => {
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
        console.log('Fetching workout with ID:', id);
        
        const workoutData = await fetchWithAuth(`/strength/${id}`);
        console.log('Workout data received:', workoutData);
        
        if (workoutData) {
          setWorkout(workoutData);
        } else {
          setError('Workout not found');
        }
      } catch (err) {
        console.error('Error loading workout:', err);
        setError(err.message || 'Failed to load workout data');
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
    if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      try {
        setLoading(true);
        await fetchWithAuth(`/strength/${id}`, {
          method: 'DELETE'
        });
        navigate('/strength');
      } catch (err) {
        alert('Failed to delete workout: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit workout
  const handleEditWorkout = () => {
    if (workout) {
      // Format data untuk modal edit
      const formattedWorkout = {
        ...workout,
        // Pastikan format exercises sesuai dengan yang diharapkan WorkoutModal
        exercises: workout.exercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets.map(set => ({
            weight: set.weight.toString(),
            reps: set.reps.toString()
          }))
        }))
      };
      setEditingWorkout(formattedWorkout);
      setShowEditModal(true);
    }
  };

  // Handle success edit
  const handleEditSuccess = () => {
    setShowEditModal(false);
    setEditingWorkout(null);
    // Refresh data
    window.location.reload();
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingWorkout(null);
  };

  const handleExportPDF = () => {
    if (!workout) return;
    
    // Basic PDF export functionality
    const printWindow = window.open('', '_blank');
    const workoutDate = new Date(workout.date).toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${workout.name} - ${workoutDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
            .metric { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .exercise { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${workout.name}</h1>
            <p>${workoutDate}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <strong>Total Volume</strong><br>
              ${workout.totalVolume.toLocaleString()} kg
            </div>
            <div class="metric">
              <strong>Duration</strong><br>
              ${workout.duration} min
            </div>
            <div class="metric">
              <strong>RPE</strong><br>
              ${workout.rpe || 'N/A'}/10
            </div>
            <div class="metric">
              <strong>Exercises</strong><br>
              ${workout.exercises.length}
            </div>
          </div>

          <h2>Exercise Breakdown</h2>
          ${workout.exercises.map(exercise => `
            <div class="exercise">
              <h3>${exercise.name}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Set</th>
                    <th>Weight (kg)</th>
                    <th>Reps</th>
                    <th>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  ${exercise.sets.map((set, setIdx) => `
                    <tr>
                      <td>${setIdx + 1}</td>
                      <td>${set.weight}</td>
                      <td>${set.reps}</td>
                      <td>${set.weight * set.reps} kg</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p><strong>Exercise Total:</strong> ${exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)} kg</p>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  // Calculate exercise volume
  const calculateExerciseVolume = (exercise) => {
    if (!exercise.sets) return 0;
    return exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
  };

  // Calculate total volume for all exercises
  const calculateTotalVolume = () => {
    if (!workout || !workout.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => total + calculateExerciseVolume(exercise), 0);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading workout details...</p>
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
            {error || 'The workout you are looking for does not exist.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/strength')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Workouts
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
                to="/strength"
                className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Workouts
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
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <Dumbbell className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{workout.name}</h1>
                  <div className="flex items-center space-x-4 mt-2 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(workout.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{workout.duration} minutes</span>
                    </div>
                    {workout.rpe && (
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>RPE: {workout.rpe}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg">
                  <div className="text-sm font-medium opacity-90">Total Volume</div>
                  <div className="text-2xl font-bold">
                    {(workout.totalVolume || calculateTotalVolume()).toLocaleString()} kg
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

        {/* Exercises Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Exercises ({workout.exercises?.length || 0})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exercise.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Volume: {calculateExerciseVolume(exercise).toLocaleString()} kg</span>
                    </div>
                  </div>

                  {/* Sets Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Set
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight (kg)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reps
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Volume
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {exercise.sets && exercise.sets.map((set, setIndex) => (
                          <tr key={setIndex} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {setIndex + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {set.weight}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {set.reps}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
                              {(set.weight * set.reps).toLocaleString()} kg
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            Exercise Total:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-indigo-600">
                            {calculateExerciseVolume(exercise).toLocaleString()} kg
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No exercises recorded for this workout.</p>
              </div>
            )}
          </div>
        </div>

        {/* Workout Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Volume Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Volume Summary</h3>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Volume</span>
                <span className="font-semibold text-indigo-600">
                  {(workout.totalVolume || calculateTotalVolume()).toLocaleString()} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Exercise Count</span>
                <span className="font-semibold text-gray-900">
                  {workout.exercises?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sets</span>
                <span className="font-semibold text-gray-900">
                  {workout.exercises?.reduce((total, exercise) => total + (exercise.sets?.length || 0), 0) || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-900">{workout.duration} min</span>
              </div>
              {workout.rpe && (
                <div className="flex justify-between">
                  <span className="text-gray-600">RPE</span>
                  <span className="font-semibold text-gray-900">{workout.rpe}/10</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">
                  {new Date(workout.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Records Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Exercise Highlights</h3>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div className="space-y-2">
              {workout.exercises && workout.exercises.slice(0, 3).map((exercise, index) => {
                if (!exercise.sets || exercise.sets.length === 0) return null;
                
                const maxWeightSet = exercise.sets.reduce((max, set) => 
                  set.weight > max.weight ? set : max, exercise.sets[0]
                );
                return (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                      {exercise.name}
                    </span>
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">
                      {maxWeightSet.weight}kg × {maxWeightSet.reps}
                    </span>
                  </div>
                );
              })}
              {(!workout.exercises || workout.exercises.length === 0) && (
                <p className="text-sm text-gray-500">No exercise data</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/strength')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Back to Workouts
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
          modalType="strength"
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

export default StrengthDetailPage;