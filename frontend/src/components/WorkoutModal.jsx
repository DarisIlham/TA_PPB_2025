// Modal Component for Adding Workouts
import React, { useState } from 'react';
import { X } from 'lucide-react';
  const WorkoutModal = () => {
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [modalType, setModalType] = useState('');
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
            <h2 className="text-2xl font-bold">
              Log {modalType === 'strength' ? 'Strength' : 'Cardio'} Workout
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {modalType === 'strength' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Push Day A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RPE (Rate of Perceived Exertion)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Note: Full exercise logging coming soon. This demo shows the interface structure.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option>Running</option>
                    <option>Cycling</option>
                    <option>Swimming</option>
                    <option>Rowing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Central Park"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  // Add workout logic would go here
                }}
                className={`flex-1 px-6 py-3 text-white rounded-lg ${
                  modalType === 'strength' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Save Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default WorkoutModal;