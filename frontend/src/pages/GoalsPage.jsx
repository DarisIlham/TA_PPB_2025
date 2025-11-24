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
import { useGoal } from '../hooks/useGoal';

const GoalsPage = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    metric: 'Strength',
    target: '',
    current: '',
    deadline: '',
    priority: 'Medium',
    description: ''
  });

  const {
    goals,
    weeklySchedule,
    recommendedSchedules,
    loading,
    error,
    stats,
    createGoal,
    updateGoal,
    deleteGoal,
    addGoalProgress,
    updateWeeklySchedule,
    fetchRecommendedSchedules
  } = useGoal();

  // Handle form input changes for new goal
  const handleNewGoalChange = (field, value) => {
    setNewGoal(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle create new goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await createGoal({
        ...newGoal,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current) || 0,
        deadline: new Date(newGoal.deadline).toISOString()
      });
      setNewGoal({
        name: '',
        metric: 'Strength',
        target: '',
        current: '',
        deadline: '',
        priority: 'Medium',
        description: ''
      });
      setShowGoalForm(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  // Handle edit schedule changes
  const handleEditChange = (index, field, value) => {
    const updated = [...editedSchedule];
    updated[index][field] = value;
    setEditedSchedule(updated);
  };

  // Save edited schedule
  const saveEditedSchedule = async () => {
    try {
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1); // Start from Monday
      
      await updateWeeklySchedule({
        schedules: editedSchedule,
        weekStartDate: weekStartDate.toISOString()
      });
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  // Handle update goal progress
  const handleUpdateProgress = async (goalId, newValue) => {
    try {
      await addGoalProgress(goalId, {
        value: parseFloat(newValue),
        date: new Date().toISOString()
      });
      setSelectedGoal(null);
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  // Handle delete goal
  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goalId);
        setSelectedGoal(null);
      } catch (err) {
        console.error('Failed to delete goal:', err);
      }
    }
  };

  // Initialize edit schedule
  useEffect(() => {
    if (showEditModal) {
      setEditedSchedule([...weeklySchedule]);
    }
  }, [showEditModal, weeklySchedule]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading goals...</div>
      </div>
    );
  }

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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showGoalForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">Create New Goal</h3>
          <form onSubmit={handleCreateGoal}>
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Goal name" 
                value={newGoal.name}
                onChange={(e) => handleNewGoalChange('name', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                required
              />
              <select 
                value={newGoal.metric}
                onChange={(e) => handleNewGoalChange('metric', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Endurance">Endurance</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="number" 
                placeholder="Target value" 
                value={newGoal.target}
                onChange={(e) => handleNewGoalChange('target', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                step="0.1"
                required
              />
              <input 
                type="number" 
                placeholder="Current value" 
                value={newGoal.current}
                onChange={(e) => handleNewGoalChange('current', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                step="0.1"
              />
              <input 
                type="date" 
                value={newGoal.deadline}
                onChange={(e) => handleNewGoalChange('deadline', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" 
                required
              />
              <select 
                value={newGoal.priority}
                onChange={(e) => handleNewGoalChange('priority', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <textarea 
                placeholder="Description (optional)"
                value={newGoal.description}
                onChange={(e) => handleNewGoalChange('description', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 md:col-span-2"
                rows="3"
              />
              <div className="md:col-span-2 flex space-x-2">
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex-1"
                >
                  Create Goal
                </button>
                <button 
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Weekly Schedule
          </h2>
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Schedule</span>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weeklySchedule.map((item) => (
            <div key={item.day} className="text-center cursor-pointer" onClick={() => setSelectedDay(item)}>
              <div className="text-xs font-semibold text-gray-600 mb-2">{item.day}</div>
              <div className={`p-4 rounded-lg ${item.type === 'Workout' ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'}`}>
                {item.type === 'Workout' ? (
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
        {selectedDay && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <h3 className="font-bold">{selectedDay.day} Details</h3>
            <p>{selectedDay.details}</p>
            <button onClick={() => setSelectedDay(null)} className="text-indigo-600 mt-2">Close</button>
          </div>
        )}
      </div>

      {/* Edit Modal for Weekly Schedule */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Edit Weekly Schedule</h3>
              <button onClick={() => setShowEditModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {editedSchedule.map((item, index) => (
                <div key={item.day} className="grid grid-cols-3 gap-4 items-center">
                  <span className="font-medium">{item.day}</span>
                  <select
                    value={item.type}
                    onChange={(e) => handleEditChange(index, 'type', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Workout">Workout</option>
                    <option value="Rest">Rest</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Recovery">Recovery</option>
                  </select>
                  <input
                    type="text"
                    value={item.details}
                    onChange={(e) => handleEditChange(index, 'details', e.target.value)}
                    placeholder="Details"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedSchedule}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Weekly Schedules */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recommended Weekly Schedules</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {recommendedSchedules.map((schedule, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md"
              onClick={() => window.open(schedule.fullUrl, '_blank')}
            >
              <h3 className="font-bold mb-2">{schedule.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{schedule.description}</p>
              <iframe
                width="100%"
                height="200"
                src={schedule.videoUrl}
                title={schedule.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Active Goals</h2>
        <div className="space-y-4">
          {goals.filter(g => g.status === 'active').map(goal => {
            const progress = Math.round((goal.current / goal.target) * 100);
            return (
              <div
                key={goal.goal_id}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedGoal(goal)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-600">{goal.metric} • Deadline: {formatDate(goal.deadline)}</p>
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
                    <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current: {goal.current} / Target: {goal.target}</span>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newValue = prompt(`Enter new current value for ${goal.name}:`, goal.current);
                      if (newValue !== null) {
                        handleUpdateProgress(goal.goal_id, newValue);
                      }
                    }}
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })}
          {goals.filter(g => g.status === 'active').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active goals. Create your first goal to get started!
            </div>
          )}
        </div>
      </div>

      {/* Goal Details Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{selectedGoal.name}</h3>
              <button onClick={() => setSelectedGoal(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Metric: {selectedGoal.metric}</p>
            <p className="text-sm text-gray-600 mb-2">Deadline: {formatDate(selectedGoal.deadline)}</p>
            <p className="text-sm text-gray-600 mb-2">Priority: {selectedGoal.priority}</p>
            <p className="text-sm text-gray-600 mb-4">Description: {selectedGoal.description}</p>
            
            <h4 className="font-bold mb-2">Progress History</h4>
            {selectedGoal.history && selectedGoal.history.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedGoal.history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => formatDate(date)} />
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
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">No progress history yet.</p>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                className="text-indigo-600 flex items-center hover:text-indigo-800"
                onClick={() => {
                  const newValue = prompt(`Enter new current value for ${selectedGoal.name}:`, selectedGoal.current);
                  if (newValue !== null) {
                    handleUpdateProgress(selectedGoal.goal_id, newValue);
                  }
                }}
              >
                <Edit className="w-4 h-4 mr-1" /> Update Progress
              </button>
              <button 
                className="text-red-600 flex items-center hover:text-red-800"
                onClick={() => handleDeleteGoal(selectedGoal.goal_id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;