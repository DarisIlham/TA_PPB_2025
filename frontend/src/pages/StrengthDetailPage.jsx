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
const StrengthDetailPage = () => {
    const workout = strengthWorkouts.find(w => w.id === selectedWorkoutId);
    if (!workout) return <div>Workout not found</div>;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('strength')}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back to Strength List</span>
        </button>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
          <p className="text-indigo-100">{workout.date}</p>
        </div>

        {/* Session Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-2xl font-bold text-indigo-600">{workout.totalVolume.toLocaleString()} kg</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-2xl font-bold text-purple-600">{workout.duration} min</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">RPE</p>
            <p className="text-2xl font-bold text-pink-600">{workout.rpe}/10</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Exercises</p>
            <p className="text-2xl font-bold text-orange-600">{workout.exercises.length}</p>
          </div>
        </div>

        {/* Exercise Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Exercise Breakdown</h2>
          <div className="space-y-6">
            {workout.exercises.map((exercise, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-bold text-lg mb-3">{exercise.name}</h3>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Set</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Weight (kg)</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Reps</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIdx) => (
                      <tr key={setIdx} className="border-t border-gray-100">
                        <td className="px-4 py-2">{setIdx + 1}</td>
                        <td className="px-4 py-2 font-medium">{set.weight}</td>
                        <td className="px-4 py-2 font-medium">{set.reps}</td>
                        <td className="px-4 py-2 text-indigo-600 font-bold">{set.weight * set.reps} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2 text-sm text-gray-600">
                  Exercise Total: <span className="font-bold text-indigo-600">
                    {exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Workout</span>
          </button>
          <button className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
          <button className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };
  
export default StrengthDetailPage;