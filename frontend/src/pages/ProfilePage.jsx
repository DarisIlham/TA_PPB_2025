// Profile Page
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

const ProfilePage = ({
  userProfile,
  setModalType,
  setShowModal,
  strengthWorkouts,
  cardioWorkouts,
  setSelectedWorkoutId,
  // setCurrentPage, // Remove if using React Router navigation
}) => {
    const [editing, setEditing] = useState(false);
    const totalWorkouts = strengthWorkouts.length + cardioWorkouts.length;
    const totalVolume = strengthWorkouts.reduce((sum, w) => sum + w.totalVolume, 0);
    const totalDistance = cardioWorkouts.reduce((sum, w) => sum + w.distance, 0);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{userProfile.name}</h2>
              <p className="text-indigo-100">{userProfile.age} years • {userProfile.weight} {userProfile.unit} • {userProfile.height} cm</p>
            </div>
          </div>
        </div>

        {/* Biometric Data */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Biometric Data</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>{editing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Weight</p>
              {editing ? (
                <input
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})}
                  className="mt-1 w-full px-2 py-1 border rounded"
                />
              ) : (
                <p className="text-2xl font-bold">{userProfile.weight} kg</p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Height</p>
              {editing ? (
                <input
                  type="number"
                  value={userProfile.height}
                  onChange={(e) => setUserProfile({...userProfile, height: e.target.value})}
                  className="mt-1 w-full px-2 py-1 border rounded"
                />
              ) : (
                <p className="text-2xl font-bold">{userProfile.height} cm</p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Age</p>
              {editing ? (
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                  className="mt-1 w-full px-2 py-1 border rounded"
                />
              ) : (
                <p className="text-2xl font-bold">{userProfile.age} years</p>
              )}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">BMI</p>
              <p className="text-2xl font-bold">
                {(userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)}
              </p>
            </div>
          </div>
          {editing && (
            <button
              onClick={() => setEditing(false)}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Lifetime Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Lifetime Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm text-gray-600">Total Workouts</p>
              <p className="text-3xl font-bold text-indigo-600">{totalWorkouts}</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-gray-600">Total Volume Lifted</p>
              <p className="text-3xl font-bold text-purple-600">{totalVolume.toLocaleString()} kg</p>
            </div>
            <div className="text-center p-6 bg-pink-50 rounded-lg">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-3xl font-bold text-pink-600">{totalDistance.toFixed(1)} km</p>
            </div>
          </div>
        </div>

        {/* Personal Bests */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Personal Bests
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">Bench Press 1RM</span>
              <span className="text-xl font-bold text-yellow-700">80 kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">Squat 1RM</span>
              <span className="text-xl font-bold text-yellow-700">100 kg</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">Fastest 5K</span>
              <span className="text-xl font-bold text-yellow-700">28:00</span>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Data Management</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="font-medium">Export All Data</span>
              <Download className="w-5 h-5 text-indigo-600" />
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="font-medium">Privacy Settings</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };
export default ProfilePage;