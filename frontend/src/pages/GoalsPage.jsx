// Goals Page
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
const GoalsPage = () => {
    const [showGoalForm, setShowGoalForm] = useState(false);
    // Goals State
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Bench Press 100kg',
      metric: 'Strength',
      target: 100,
      current: 80,
      deadline: '2025-02-15',
      priority: 'High',
      status: 'active'
    },
    {
      id: 2,
      name: 'Run 10K under 50 minutes',
      metric: 'Cardio',
      target: 50,
      current: 8,
      deadline: '2025-01-30',
      priority: 'Medium',
      status: 'active'
    },
    {
      id: 3,
      name: 'Squat 150kg',
      metric: 'Strength',
      target: 150,
      current: 100,
      deadline: '2025-04-01',
      priority: 'High',
      status: 'active'
    }
  ]);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Goal Setting & Planning</h1>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>

        {showGoalForm && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Create New Goal</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Goal name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>Strength</option>
                <option>Cardio</option>
                <option>Body Composition</option>
              </select>
              <input
                type="number"
                placeholder="Target value"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option>High Priority</option>
                <option>Medium Priority</option>
                <option>Low Priority</option>
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Create Goal
              </button>
            </div>
          </div>
        )}

        {/* Active Goals */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Active Goals</h2>
          <div className="space-y-4">
            {goals.filter(g => g.status === 'active').map(goal => {
              const progress = Math.round((goal.current / goal.target) * 100);
              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-600">{goal.metric} • Deadline: {goal.deadline}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      goal.priority === 'High' ? 'bg-red-100 text-red-700' :
                      goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current: {goal.current} / Target: {goal.target}</span>
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Update Progress
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Training Calendar */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Weekly Training Plan
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
              <div key={day} className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-2">{day}</div>
                <div className={`p-4 rounded-lg ${
                  idx % 2 === 0 ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
                }`}>
                  {idx % 2 === 0 ? (
                    <div className="text-xs">
                      <Dumbbell className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-indigo-600 font-medium">Workout</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Rest</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
export default GoalsPage;