import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Target, TrendingUp, Award, Clock } from 'lucide-react';

const GoalModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  goal = null, 
  mode = 'create' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    metric: 'Strength',
    target: '',
    current: '',
    deadline: '',
    priority: 'Medium',
    description: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Initialize form when modal opens or goal changes
  useEffect(() => {
    if (goal && mode === 'edit') {
      setFormData({
        name: goal.name || '',
        metric: goal.metric || 'Strength',
        target: goal.target?.toString() || '',
        current: goal.current?.toString() || '',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        priority: goal.priority || 'Medium',
        description: goal.description || '',
        status: goal.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        metric: 'Strength',
        target: '',
        current: '',
        deadline: '',
        priority: 'Medium',
        description: '',
        status: 'active'
      });
    }
    setErrors({});
  }, [goal, mode, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.target || parseFloat(formData.target) <= 0) {
      newErrors.target = 'Target must be greater than 0';
    }

    if (formData.current && parseFloat(formData.current) < 0) {
      newErrors.current = 'Current value cannot be negative';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const goalData = {
      ...formData,
      target: parseFloat(formData.target),
      current: parseFloat(formData.current) || 0,
      deadline: new Date(formData.deadline).toISOString()
    };

    onSave(goalData);
  };

  

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'Strength':
        return <Award className="w-4 h-4" />;
      case 'Cardio':
        return <TrendingUp className="w-4 h-4" />;
      case 'Endurance':
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">
              {mode === 'create' ? 'Create New Goal' : 'Edit Goal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Bench Press 100kg, Run 10K under 50 minutes"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Metric and Priority */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metric *
              </label>
              <div className="relative">
                <select
                  value={formData.metric}
                  onChange={(e) => handleChange('metric', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option value="Strength">Strength</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Endurance">Endurance</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {getMetricIcon(formData.metric)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Target and Current Values */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Value *
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => handleChange('target', e.target.value)}
                placeholder="e.g., 100, 50, 150"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.target ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.target && (
                <p className="mt-1 text-sm text-red-600">{errors.target}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Value
              </label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => handleChange('current', e.target.value)}
                placeholder="e.g., 80, 8, 100"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.current ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.current && (
                <p className="mt-1 text-sm text-red-600">{errors.current}</p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your goal, training plan, or motivation..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Status (only for edit mode) */}
          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}

          {/* Progress Preview */}
          {formData.target && formData.current && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress Preview</span>
                <span className="font-semibold">
                  {Math.round((parseFloat(formData.current) / parseFloat(formData.target)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (parseFloat(formData.current) / parseFloat(formData.target)) * 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Current: {formData.current} / Target: {formData.target}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{mode === 'create' ? 'Create Goal' : 'Update Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;