// Cardio Detail Page
import React, { useState, useEffect } from 'react';
import { Home, User, Info, Dumbbell, Heart, BarChart3, Target, Plus, Search, Filter, Calendar, TrendingUp, Award, Clock, Activity, ChevronRight, Edit, Trash2, Save, X, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';  
const CardioDetailPage = () => {
    const workout = cardioWorkouts.find(w => w.id === selectedWorkoutId);
    if (!workout) return <div>Workout not found</div>;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setCurrentPage('cardio')}
          className="flex items-center text-purple-600 hover:text-purple-800"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back to Cardio List</span>
        </button>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">{workout.type}</h1>
          <p className="text-purple-100">{workout.date} • {workout.location}</p>
        </div>

        {/* Session Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Distance</p>
            <p className="text-2xl font-bold text-purple-600">{workout.distance} km</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-2xl font-bold text-pink-600">{workout.duration} min</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Avg Pace</p>
            <p className="text-2xl font-bold text-indigo-600">{workout.pace} /km</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">Calories</p>
            <p className="text-2xl font-bold text-orange-600">{workout.calories}</p>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="font-semibold text-green-800">Personal Record!</p>
              <p className="text-sm text-green-700">This was your fastest {workout.distance}km run!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Split Pace</p>
                <p className="text-lg font-bold">5:20 /km (1st half)</p>
                <p className="text-lg font-bold">5:26 /km (2nd half)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Heart Rate Zone Distribution</p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Zone 2 (Aerobic)</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Zone 3 (Tempo)</span>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Zone 4 (Threshold)</span>
                    <span className="font-bold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Comparison to Personal Best</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-2xl font-bold text-purple-600">{workout.duration} min</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Personal Best</p>
              <p className="text-2xl font-bold text-green-600">{workout.duration} min</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Difference</p>
              <p className="text-2xl font-bold text-yellow-600">-0:00</p>
            </div>
          </div>
        </div>

        {/* Route Map Placeholder */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Route Map</h2>
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2" />
              <p>Route map visualization</p>
              <p className="text-sm">Location: {workout.location}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2">
            <Edit className="w-5 h-5" />
            <span>Edit Session</span>
          </button>
          <button className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
          <button className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };
  
export default CardioDetailPage;