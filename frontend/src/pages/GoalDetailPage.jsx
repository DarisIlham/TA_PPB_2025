// pages/GoalDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award, 
  Edit, 
  Trash2, 
  Plus,
  BarChart3,
  Clock,
  Flag
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useGoal } from '../hooks/useGoal';

const GoalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, updateGoal, deleteGoal, addGoalProgress, loading } = useGoal();
  
  const [goal, setGoal] = useState(null);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressValue, setProgressValue] = useState('');
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    const foundGoal = goals.find(g => g.goal_id === parseInt(id));
    setGoal(foundGoal);
  }, [id, goals]);

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!progressValue) return;

    try {
      await addGoalProgress(goal.goal_id, {
        value: parseFloat(progressValue),
        notes: progressNotes,
        date: new Date().toISOString()
      });
      
      setProgressValue('');
      setProgressNotes('');
      setShowProgressForm(false);
    } catch (error) {
      console.error('Failed to add progress:', error);
    }
  };

  const handleDeleteGoal = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goal.goal_id);
        navigate('/goals');
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleMarkComplete = async () => {
    try {
      await updateGoal(goal.goal_id, { 
        status: 'completed',
        current: goal.target // Set current to target when completed
      });
    } catch (error) {
      console.error('Failed to mark goal complete:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = () => {
    if (!goal) return 0;
    return Math.round((goal.current / goal.target) * 100);
  };

  if (loading && !goal) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading goal details...</div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600">Goal not found</h2>
        <button 
          onClick={() => navigate('/goals')}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Back to Goals
        </button>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(goal.deadline);
  const progressPercentage = getProgressPercentage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/goals')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{goal.name}</h1>
            <p className="text-gray-600">{goal.metric} • {goal.description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/goals/edit/${goal.goal_id}`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDeleteGoal}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {progressPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {goal.current} / {goal.target} {goal.metric}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Deadline Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Deadline</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {daysRemaining}
            </div>
            <div className="text-sm text-gray-600">
              {daysRemaining > 0 ? 'days remaining' : 'days overdue'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(goal.deadline)}
            </div>
          </div>
        </div>

        {/* Priority Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Priority</h3>
            <Flag className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${
              goal.priority === 'High' ? 'text-red-600' :
              goal.priority === 'Medium' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {goal.priority}
            </div>
            <div className="text-sm text-gray-600">
              Priority Level
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
          Progress History
        </h3>
        {goal.history && goal.history.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={goal.history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => formatDate(date)}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => formatDate(date)}
                formatter={(value) => [value, 'Value']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No progress history yet. Add your first progress update!</p>
          </div>
        )}
      </div>

      {/* Progress History List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">Progress Updates</h3>
          <button
            onClick={() => setShowProgressForm(!showProgressForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Progress</span>
          </button>
        </div>

        {/* Add Progress Form */}
        {showProgressForm && (
          <form onSubmit={handleAddProgress} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value
                </label>
                <input
                  type="number"
                  value={progressValue}
                  onChange={(e) => setProgressValue(e.target.value)}
                  placeholder={`Enter current ${goal.metric.toLowerCase()} value`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Add notes about this progress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save Progress
              </button>
              <button
                type="button"
                onClick={() => setShowProgressForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Progress List */}
        <div className="space-y-3">
          {goal.history && goal.history.length > 0 ? (
            [...goal.history]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">{entry.value} {goal.metric}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                        {entry.notes && ` • ${entry.notes}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No progress updates yet.
            </div>
          )}
        </div>
      </div>

      {/* Complete Goal Button */}
      {goal.status === 'active' && progressPercentage >= 100 && (
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Award className="w-12 h-12 mx-auto text-green-600 mb-2" />
          <h3 className="text-lg font-semibold mb-2">Congratulations! 🎉</h3>
          <p className="text-gray-600 mb-4">
            You've reached your target! Mark this goal as completed.
          </p>
          <button
            onClick={handleMarkComplete}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
          >
            <Award className="w-5 h-5" />
            <span>Mark as Completed</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalDetailPage;