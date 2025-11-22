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
const CardioListPage = ({
  cardioWorkouts,
  setShowModal,
  setModalType,
  setSelectedWorkoutId,
  setCurrentPage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkouts = cardioWorkouts
    .filter((w) => w.type.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalDistance = cardioWorkouts.reduce((sum, w) => sum + w.distance, 0);
  const best5K = cardioWorkouts
    .filter((w) => w.distance >= 5 && w.distance <= 5.5)
    .sort((a, b) => a.duration - b.duration)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cardio Training Log</h1>
        <button
          onClick={() => {
            setModalType("cardio");
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center space-x-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-purple-100 text-sm">Total Sessions</p>
            <p className="text-3xl font-bold">{cardioWorkouts.length}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Total Distance</p>
            <p className="text-3xl font-bold">{totalDistance.toFixed(1)} km</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Best 5K Time</p>
            <p className="text-3xl font-bold">
              {best5K ? `${best5K.duration} min` : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by activity type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Workouts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Avg Pace
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredWorkouts.map((workout) => (
              <tr key={workout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {workout.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {workout.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {workout.distance} km
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {workout.duration} min
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {workout.pace} /km
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setSelectedWorkoutId(workout.id);
                      setCurrentPage("cardio-detail");
                    }}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CardioListPage;
