import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Dumbbell, Heart, Activity, RefreshCw } from 'lucide-react';

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  schedule = [],
  mode = 'edit' 
}) => {
  const [editedSchedule, setEditedSchedule] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Days configuration
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Workout types with icons and colors
  const workoutTypes = [
    { value: 'Workout', label: 'Workout', icon: Dumbbell, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { value: 'Rest', label: 'Rest', icon: Heart, color: 'bg-gray-100 text-gray-600 border-gray-200' },
    { value: 'Cardio', label: 'Cardio', icon: Activity, color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'Strength', label: 'Strength', icon: Dumbbell, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'Recovery', label: 'Recovery', icon: RefreshCw, color: 'bg-purple-100 text-purple-700 border-purple-200' }
  ];

  // Initialize schedule
  useEffect(() => {
    if (schedule && schedule.length > 0) {
      setEditedSchedule([...schedule]);
    } else {
      // Default schedule if none provided
      const defaultSchedule = days.map(day => ({
        day,
        type: 'Rest',
        details: '',
        exercises: []
      }));
      // Set some default workout days
      defaultSchedule[0].type = 'Workout'; // Monday
      defaultSchedule[0].details = 'Chest & Triceps';
      defaultSchedule[2].type = 'Workout'; // Wednesday
      defaultSchedule[2].details = 'Back & Biceps';
      defaultSchedule[4].type = 'Workout'; // Friday
      defaultSchedule[4].details = 'Legs & Shoulders';
      
      setEditedSchedule(defaultSchedule);
    }
    setHasChanges(false);
  }, [schedule, isOpen]);

  const handleTypeChange = (index, newType) => {
    const updated = [...editedSchedule];
    updated[index].type = newType;
    
    // Set default details based on type
    if (newType === 'Workout') {
      updated[index].details = getDefaultWorkoutDetails(updated[index].day);
    } else if (newType === 'Rest') {
      updated[index].details = 'Rest day';
    } else if (newType === 'Cardio') {
      updated[index].details = 'Cardio session';
    } else if (newType === 'Strength') {
      updated[index].details = 'Strength training';
    } else if (newType === 'Recovery') {
      updated[index].details = 'Active recovery';
    }
    
    setEditedSchedule(updated);
    setHasChanges(true);
  };

  const handleDetailsChange = (index, newDetails) => {
    const updated = [...editedSchedule];
    updated[index].details = newDetails;
    setEditedSchedule(updated);
    setHasChanges(true);
  };

  const getDefaultWorkoutDetails = (day) => {
    const defaults = {
      'Mon': 'Chest & Triceps: Bench press, push-ups',
      'Tue': 'Back & Biceps: Pull-ups, rows',
      'Wed': 'Legs: Squats, lunges',
      'Thu': 'Shoulders & Abs: Shoulder press, planks',
      'Fri': 'Full body: Compound movements',
      'Sat': 'Cardio & Core: Running, abs workout',
      'Sun': 'Active recovery: Light activity'
    };
    return defaults[day] || 'Workout session';
  };

  const getWorkoutTypeConfig = (type) => {
    return workoutTypes.find(wt => wt.value === type) || workoutTypes[0];
  };

  const handleSave = async () => {
  try {
    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1); // Start from Monday
    weekStartDate.setHours(0, 0, 0, 0);
    
    const scheduleData = {
      schedules: editedSchedule.map(schedule => ({
        day: schedule.day,
        type: schedule.type,
        details: schedule.details,
        // Include exercises array if needed
        exercises: schedule.exercises || []
      })),
      weekStartDate: weekStartDate.toISOString()
    };

    console.log('Saving schedule data:', scheduleData); // Debug log
    await onSave(scheduleData);
  } catch (error) {
    console.error('Error in handleSave:', error);
  }
};

  const applyTemplate = (templateName) => {
    let template = [];
    
    switch (templateName) {
      case 'push_pull_legs':
        template = [
          { day: 'Mon', type: 'Strength', details: 'Push: Chest, Shoulders, Triceps' },
          { day: 'Tue', type: 'Strength', details: 'Pull: Back, Biceps' },
          { day: 'Wed', type: 'Strength', details: 'Legs: Quads, Hamstrings, Calves' },
          { day: 'Thu', type: 'Cardio', details: 'Cardio: Running or Cycling' },
          { day: 'Fri', type: 'Strength', details: 'Push: Chest, Shoulders, Triceps' },
          { day: 'Sat', type: 'Strength', details: 'Pull: Back, Biceps' },
          { day: 'Sun', type: 'Rest', details: 'Rest day' }
        ];
        break;
      case 'full_body':
        template = [
          { day: 'Mon', type: 'Strength', details: 'Full Body Workout A' },
          { day: 'Tue', type: 'Cardio', details: 'Cardio Session' },
          { day: 'Wed', type: 'Strength', details: 'Full Body Workout B' },
          { day: 'Thu', type: 'Rest', details: 'Rest day' },
          { day: 'Fri', type: 'Strength', details: 'Full Body Workout C' },
          { day: 'Sat', type: 'Cardio', details: 'Cardio Session' },
          { day: 'Sun', type: 'Rest', details: 'Rest day' }
        ];
        break;
      case 'upper_lower':
        template = [
          { day: 'Mon', type: 'Strength', details: 'Upper Body A' },
          { day: 'Tue', type: 'Strength', details: 'Lower Body A' },
          { day: 'Wed', type: 'Cardio', details: 'Cardio & Core' },
          { day: 'Thu', type: 'Strength', details: 'Upper Body B' },
          { day: 'Fri', type: 'Strength', details: 'Lower Body B' },
          { day: 'Sat', type: 'Recovery', details: 'Active Recovery' },
          { day: 'Sun', type: 'Rest', details: 'Rest day' }
        ];
        break;
      default:
        return;
    }
    
    setEditedSchedule(template);
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Edit Weekly Schedule</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Templates */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyTemplate('push_pull_legs')}
              className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Push/Pull/Legs
            </button>
            <button
              onClick={() => applyTemplate('full_body')}
              className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Full Body
            </button>
            <button
              onClick={() => applyTemplate('upper_lower')}
              className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Upper/Lower
            </button>
          </div>
        </div>

        {/* Schedule Editor */}
        <div className="p-6">
          <div className="space-y-4">
            {editedSchedule.map((daySchedule, index) => {
              const typeConfig = getWorkoutTypeConfig(daySchedule.type);
              const IconComponent = typeConfig.icon;
              
              return (
                <div key={daySchedule.day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  {/* Day */}
                  <div className="w-16">
                    <span className="font-semibold text-gray-700">{daySchedule.day}</span>
                  </div>

                  {/* Type Selector */}
                  <div className="flex-1">
                    <select
                      value={daySchedule.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {workoutTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Display */}
                  <div className={`flex items-center space-x-2 px-3 py-2 border-2 rounded-lg ${typeConfig.color}`}>
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{daySchedule.type}</span>
                  </div>

                  {/* Details Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={daySchedule.details}
                      onChange={(e) => handleDetailsChange(index, e.target.value)}
                      placeholder="Enter workout details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            <div className="grid grid-cols-7 gap-2">
              {editedSchedule.map((daySchedule) => {
                const typeConfig = getWorkoutTypeConfig(daySchedule.type);
                
                return (
                  <div key={daySchedule.day} className="text-center">
                    <div className="text-xs font-semibold text-gray-600 mb-2">{daySchedule.day}</div>
                    <div className={`p-3 rounded-lg border-2 ${typeConfig.color}`}>
                      <div className="text-xs">
                        <span className="font-medium">{daySchedule.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                hasChanges 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;