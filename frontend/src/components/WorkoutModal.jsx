// Modal Component for Adding Workouts
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const WorkoutModal = ({
  showModal,
  setShowModal,
  modalType,
  selectedWorkoutId,
  setSelectedWorkoutId,
  editingWorkout = null, // Tambah prop untuk data edit
  onSuccess = () => {}, // Callback ketika edit berhasil
  onClose = () => {}, // Callback ketika modal ditutup
}) => {
  useEffect(() => {
    if (editingWorkout && modalType === "strength") {
      setStrengthForm({
        name: editingWorkout.name || "",
        date: editingWorkout.date || new Date().toISOString().split("T")[0],
        duration: editingWorkout.duration?.toString() || "",
        rpe: editingWorkout.rpe?.toString() || "",
        notes: editingWorkout.notes || "",
        exercises: editingWorkout.exercises?.map((exercise) => ({
          name: exercise.name || "",
          sets: exercise.sets?.map((set) => ({
            weight: set.weight?.toString() || "",
            reps: set.reps?.toString() || "",
          })) || [
            {
              weight: "",
              reps: "",
            },
          ],
        })) || [
          {
            name: "",
            sets: [
              {
                weight: "",
                reps: "",
              },
            ],
          },
        ],
      });
    }
  }, [editingWorkout, modalType]);

  useEffect(() => {
  if (editingWorkout && modalType === 'cardio') {
    setCardioForm({
      activityType: editingWorkout.activityType || 'Running',
      date: editingWorkout.date || new Date().toISOString().split('T')[0],
      distance: editingWorkout.distance?.toString() || '',
      duration: editingWorkout.duration?.toString() || '',
      location: editingWorkout.location || '',
      notes: editingWorkout.notes || ''
    });
  }
}, [editingWorkout, modalType]);
  // State untuk form input strength dengan exercises
  const [strengthForm, setStrengthForm] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    rpe: "",
    notes: "",
    exercises: [
      {
        name: "",
        sets: [
          {
            weight: "",
            reps: "",
          },
        ],
      },
    ],
  });

  // State untuk cardio form
  const [cardioForm, setCardioForm] = useState({
    activityType: "Running",
    date: new Date().toISOString().split("T")[0],
    distance: "",
    duration: "",
    location: "",
    notes: "",
  });

  // State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate total volume whenever exercises change
  const calculateTotalVolume = () => {
    return strengthForm.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((exerciseTotal, set) => {
        const weight = parseFloat(set.weight) || 0;
        const reps = parseFloat(set.reps) || 0;
        return exerciseTotal + weight * reps;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  };

  const totalVolume = calculateTotalVolume();

  // Reset form ketika modal ditutup/dibuka
  const handleClose = () => {
    setShowModal(false);
    onClose();
    setError("");
    // Reset form hanya jika tidak dalam mode edit
    if (!editingWorkout) {
      setStrengthForm({
        name: "",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        rpe: "",
        notes: "",
        exercises: [
          {
            name: "",
            sets: [
              {
                weight: "",
                reps: "",
              },
            ],
          },
        ],
      });
      setCardioForm({
        activityType: "Running",
        date: new Date().toISOString().split("T")[0],
        distance: "",
        duration: "",
        location: "",
        notes: "",
      });
    }
  };

  if (!showModal) return null;

  // Handle input change untuk strength form utama
  const handleStrengthChange = (e) => {
    setStrengthForm({
      ...strengthForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input change untuk cardio
  const handleCardioChange = (e) => {
    setCardioForm({
      ...cardioForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle exercise name change
  const handleExerciseNameChange = (exerciseIndex, value) => {
    const updatedExercises = [...strengthForm.exercises];
    updatedExercises[exerciseIndex].name = value;
    setStrengthForm({
      ...strengthForm,
      exercises: updatedExercises,
    });
  };

  // Handle set change
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...strengthForm.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setStrengthForm({
      ...strengthForm,
      exercises: updatedExercises,
    });
  };

  // Add new exercise
  const addExercise = () => {
    setStrengthForm({
      ...strengthForm,
      exercises: [
        ...strengthForm.exercises,
        {
          name: "",
          sets: [
            {
              weight: "",
              reps: "",
            },
          ],
        },
      ],
    });
  };

  // Remove exercise
  const removeExercise = (exerciseIndex) => {
    if (strengthForm.exercises.length > 1) {
      const updatedExercises = strengthForm.exercises.filter(
        (_, index) => index !== exerciseIndex
      );
      setStrengthForm({
        ...strengthForm,
        exercises: updatedExercises,
      });
    }
  };

  // Add set to exercise
  const addSet = (exerciseIndex) => {
    const updatedExercises = [...strengthForm.exercises];
    updatedExercises[exerciseIndex].sets.push({
      weight: "",
      reps: "",
    });
    setStrengthForm({
      ...strengthForm,
      exercises: updatedExercises,
    });
  };

  // Remove set from exercise
  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...strengthForm.exercises];
    if (updatedExercises[exerciseIndex].sets.length > 1) {
      updatedExercises[exerciseIndex].sets = updatedExercises[
        exerciseIndex
      ].sets.filter((_, index) => index !== setIndex);
      setStrengthForm({
        ...strengthForm,
        exercises: updatedExercises,
      });
    }
  };

  // Validasi form
  const validateForm = () => {
    if (modalType === "strength") {
      if (!strengthForm.name.trim()) {
        setError("Workout name is required");
        return false;
      }
      if (!strengthForm.duration || strengthForm.duration <= 0) {
        setError("Duration must be greater than 0");
        return false;
      }

      // Validasi exercises
      for (let i = 0; i < strengthForm.exercises.length; i++) {
        const exercise = strengthForm.exercises[i];
        if (!exercise.name.trim()) {
          setError(`Exercise ${i + 1} name is required`);
          return false;
        }

        for (let j = 0; j < exercise.sets.length; j++) {
          const set = exercise.sets[j];
          if (!set.weight || set.weight <= 0) {
            setError(
              `Set ${j + 1} in "${
                exercise.name
              }" must have weight greater than 0`
            );
            return false;
          }
          if (!set.reps || set.reps <= 0) {
            setError(
              `Set ${j + 1} in "${exercise.name}" must have reps greater than 0`
            );
            return false;
          }
        }
      }
    } else {
      if (!cardioForm.distance || cardioForm.distance <= 0) {
        setError("Distance must be greater than 0");
        return false;
      }
      if (!cardioForm.duration || cardioForm.duration <= 0) {
        setError("Duration must be greater than 0");
        return false;
      }
    }
    return true;
  };

  // Handle save workout
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      let endpoint = "";
      let method = "POST";
      let body = {};

      // Jika dalam mode edit, gunakan method PUT dan endpoint yang sesuai
      if (editingWorkout && selectedWorkoutId) {
        method = "PUT";
        endpoint = `/api/strength/${selectedWorkoutId}`;
      } else {
        endpoint = "/api/strength";
      }

      if (modalType === "strength") {
        // Format exercises data dengan tipe number yang benar
        const formattedExercises = strengthForm.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            weight: parseFloat(set.weight),
            reps: parseInt(set.reps),
          })),
        }));

        body = {
          name: strengthForm.name,
          date: strengthForm.date,
          duration: parseInt(strengthForm.duration),
          rpe: strengthForm.rpe ? parseInt(strengthForm.rpe) : null,
          notes: strengthForm.notes,
          exercises: formattedExercises,
          totalVolume: totalVolume,
        };
      } else {
        endpoint = "/api/cardio";
        body = {
          activityType: cardioForm.activityType,
          date: cardioForm.date,
          distance: parseFloat(cardioForm.distance),
          duration: parseInt(cardioForm.duration),
          location: cardioForm.location,
          notes: cardioForm.notes,
        };
      }

      console.log("Sending data:", body);

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors
            .map((error) => error.msg)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(
          data.error || data.message || `Failed to save ${modalType} workout`
        );
      }

      // Success
      console.log(
        `${modalType} workout ${editingWorkout ? "updated" : "saved"}:`,
        data
      );
      alert(
        `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} workout ${
          editingWorkout ? "updated" : "saved"
        } successfully!`
      );

      handleClose();
      onSuccess();

      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Save workout error:", err);
      setError(err.message || `Failed to save ${modalType} workout`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingWorkout ? "Edit" : "Log"}{" "}
            {modalType === "strength" ? "Strength" : "Cardio"} Workout
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {modalType === "strength" ? (
            <div className="space-y-6">
              {/* Workout Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g., Push Day A, Pull Day B, Leg Day"
                    value={strengthForm.name}
                    onChange={handleStrengthChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={strengthForm.date}
                    onChange={handleStrengthChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="60"
                    value={strengthForm.duration}
                    onChange={handleStrengthChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RPE (1-10)
                  </label>
                  <input
                    name="rpe"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="8"
                    value={strengthForm.rpe}
                    onChange={handleStrengthChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rate of Perceived Exertion (optional)
                  </p>
                </div>
              </div>

              {/* Total Volume Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">
                    Total Volume:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalVolume.toLocaleString()} kg
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Volume = Σ(weight × reps) for all exercises
                </p>
              </div>

              {/* Exercises Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Exercises
                  </h3>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Exercise</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {strengthForm.exercises.map((exercise, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <input
                          type="text"
                          placeholder="Exercise name (e.g., Bench Press, Squat)"
                          value={exercise.name}
                          onChange={(e) =>
                            handleExerciseNameChange(
                              exerciseIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
                          disabled={loading}
                        />
                        {strengthForm.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(exerciseIndex)}
                            className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Sets */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Sets
                          </span>
                          <button
                            type="button"
                            onClick={() => addSet(exerciseIndex)}
                            className="flex items-center space-x-1 px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Set</span>
                          </button>
                        </div>

                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex space-x-2 items-center"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div>
                                <input
                                  type="number"
                                  placeholder="Weight (kg)"
                                  value={set.weight}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                  disabled={loading}
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={set.reps}
                                  onChange={(e) =>
                                    handleSetChange(
                                      exerciseIndex,
                                      setIndex,
                                      "reps",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                  disabled={loading}
                                  min="1"
                                />
                              </div>
                            </div>
                            {exercise.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeSet(exerciseIndex, setIndex)
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                disabled={loading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="Any additional notes about your workout..."
                  value={strengthForm.notes}
                  onChange={handleStrengthChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          ) : (
            // Cardio form (tetap sama seperti sebelumnya)
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Type *
                </label>
                <select
                  name="activityType"
                  value={cardioForm.activityType}
                  onChange={handleCardioChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Rowing">Rowing</option>
                  <option value="Walking">Walking</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  name="date"
                  type="date"
                  value={cardioForm.date}
                  onChange={handleCardioChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km) *
                  </label>
                  <input
                    name="distance"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="5.0"
                    value={cardioForm.distance}
                    onChange={handleCardioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={cardioForm.duration}
                    onChange={handleCardioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g., Central Park, Gym Treadmill"
                  value={cardioForm.location}
                  onChange={handleCardioChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  placeholder="Any additional notes about your cardio session..."
                  value={cardioForm.notes}
                  onChange={handleCardioChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                modalType === "strength"
                  ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                  : "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Workout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutModal;
