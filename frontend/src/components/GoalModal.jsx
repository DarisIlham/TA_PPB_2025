import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Target, TrendingUp, Award, Clock, TrendingDown } from 'lucide-react';

// =======================================================
// HELPER FUNCTION: Logic untuk menghitung persentase dinamis
// =======================================================
const calculateProgress = (start, current, target, type) => {
  const startVal = parseFloat(start || 0);
  const currentVal = parseFloat(current || 0);
  const targetVal = parseFloat(target || 0);

  let percentage = 0;

  if (type === 'descending') {
    // Logika Weight Loss/Debt Reduction (Makin kecil makin baik)
    // Rumus: (Awal - Sekarang) / (Awal - Target) * 100
    const totalToLose = startVal - targetVal;
    const lostSoFar = startVal - currentVal;
    
    // Jika target sudah tercapai atau range mustahil (target >= start)
    if (totalToLose <= 0) {
      return currentVal <= targetVal ? 100 : 0;
    }
    
    percentage = (lostSoFar / totalToLose) * 100;
  } else {
    // Logika Standar Gain (Makin besar makin baik)
    // Rumus: (Sekarang - Awal) / (Target - Awal) * 100
    const totalToGain = targetVal - startVal;
    const gainedSoFar = currentVal - startVal;
    
    if (startVal === 0 && totalToGain > 0) {
        // Jika mulai dari nol, hitung simple current/target
        percentage = (currentVal / targetVal) * 100;
    } else if (totalToGain > 0) {
        percentage = (gainedSoFar / totalToGain) * 100;
    } else {
       // Target sudah tercapai atau range mustahil (target <= start)
       return currentVal >= targetVal ? 100 : 0;
    }
  }

  // Pastikan hasil di antara 0% - 100%
  return Math.min(100, Math.max(0, percentage));
};


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
    startValue: '', // NEW: Nilai awal untuk menghitung progres penurunan
    type: 'ascending', // NEW: 'ascending' (naik) atau 'descending' (turun)
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
        startValue: goal.startValue?.toString() || '', // LOAD startValue
        type: goal.type || 'ascending', // LOAD type
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
        startValue: '', // SET default
        type: 'ascending', // SET default
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
    const startVal = parseFloat(formData.startValue);
    const targetVal = parseFloat(formData.target);
    const currentVal = parseFloat(formData.current);

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.target || targetVal <= 0) {
      newErrors.target = 'Target must be greater than 0';
    }

    // NEW: Validate Start Value
    if (!formData.startValue || startVal < 0) {
       newErrors.startValue = 'Start value is required and must be non-negative';
    }

    if (formData.current && currentVal < 0) {
      newErrors.current = 'Current value cannot be negative';
    }

    // NEW: Simple Logic check (UX enhancement)
    if (formData.type === 'ascending' && startVal >= targetVal) {
        newErrors.target = 'Target must be higher than Start Value for Increase goals';
    }
    if (formData.type === 'descending' && startVal <= targetVal) {
        newErrors.target = 'Target must be lower than Start Value for Decrease goals';
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
      startValue: parseFloat(formData.startValue) || 0, // SAVE startValue
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
          
          {/* NEW: Goal Type Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Goal Type *</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${
                formData.type === 'ascending' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="ascending"
                  checked={formData.type === 'ascending'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="hidden"
                />
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Increase (Strength, Savings)</span>
              </label>

              <label className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${
                formData.type === 'descending' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="descending"
                  checked={formData.type === 'descending'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="hidden"
                />
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Decrease (Weight Loss, Debt)</span>
              </label>
            </div>
          </div>


          {/* Start, Current and Target Values (Updated to grid-cols-3) */}
          <div className="grid grid-cols-3 gap-4">
            
            {/* NEW: Start Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Value *
              </label>
              <input
                type="number"
                value={formData.startValue}
                onChange={(e) => handleChange('startValue', e.target.value)}
                placeholder="e.g., 90"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.startValue ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startValue && (
                <p className="mt-1 text-sm text-red-600">{errors.startValue}</p>
              )}
            </div>
            
            {/* Current Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Value
              </label>
              <input
                type="number"
                value={formData.current}
                onChange={(e) => handleChange('current', e.target.value)}
                placeholder="e.g., 85"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.current ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.current && (
                <p className="mt-1 text-sm text-red-600">{errors.current}</p>
              )}
            </div>
            
            {/* Target Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Value *
              </label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => handleChange('target', e.target.value)}
                placeholder="e.g., 70"
                step="0.1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.target ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.target && (
                <p className="mt-1 text-sm text-red-600">{errors.target}</p>
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

          {/* NEW: Progress Preview with dynamic calculation */}
          {formData.startValue && formData.target && (
            <div className="bg-gray-50 p-4 rounded-lg">
              {(() => {
                const start = formData.startValue;
                // Gunakan start value sebagai current value jika current masih kosong
                const current = formData.current || formData.startValue; 
                const target = formData.target;
                const type = formData.type;
                
                const progressPercent = calculateProgress(start, current, target, type);
                const isDescending = type === 'descending';
                const progressColor = isDescending ? 'bg-red-500' : 'bg-green-500';

                return (
                  <>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        Progress Preview ({isDescending ? 'Decrease Goal' : 'Increase Goal'})
                      </span>
                      <span className="font-semibold text-lg">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                        style={{
                          width: `${progressPercent}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>Start: {start}</span>
                      <span className="font-medium text-gray-700">Current: {current}</span>
                      <span>Target: {target}</span>
                    </p>
                  </>
                );
              })()}
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