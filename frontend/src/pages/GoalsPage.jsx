// pages/GoalsPage.jsx - UPDATE dengan card sederhana
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  X,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Edit,
  Plus,
  Target,
  ArrowRight,
  Activity,
  HeartPulse,
} from "lucide-react";
import { useGoal } from "../hooks/useGoal";
import GoalModal from "../components/GoalModal";
import ScheduleModal from "../components/ScheduleModal";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { calculateProgress } from "../../utils/goalUtils";

const GoalsPage = () => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [goalModalMode, setGoalModalMode] = useState("create");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const navigate = useNavigate();
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
    updateWeeklySchedule,
  } = useGoal();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleCreateGoal = async (goalData) => {
    try {
      await createGoal(goalData);
      setShowGoalModal(false);
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      await updateWeeklySchedule(scheduleData);
      setShowScheduleModal(false);
    } catch (err) {
      console.error("Failed to update schedule:", err);
    }
  };

  const openEditGoalModal = (goal) => {
    setSelectedGoal(goal);
    setGoalModalMode("edit");
    setShowGoalModal(true);
  };

  const handleCardClick = (goal) => {
    navigate(`/goals/${goal.goal_id}`);
  };

  const getMetricIcon = (metric) => {
    switch (metric) {
      case "Strength":
        return <Award className="w-4 h-4" />;
      case "Cardio":
        return <Activity className="w-4 h-4" />;
      case "Endurance":
        return <HeartPulse className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "border-red-200 bg-red-50";
      case "Medium":
        return "border-yellow-200 bg-yellow-50";
      case "Low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "active":
        return "text-blue-600 bg-blue-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goals & Planning</h1>
          <p className="text-gray-600 mt-1">
            Track your fitness goals and progress
          </p>
        </div>
        <div className="">
          <button
            onClick={() => {
              setGoalModalMode("create");
              setShowGoalModal(true);
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {activeGoals.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-indigo-600">
                {completedGoals.length}
              </p>
            </div>
            <Award className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {goals.length > 0
                  ? Math.round((completedGoals.length / goals.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Active Goals Grid */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Active Goals ({activeGoals.length})
          </h2>
        </div>

        {activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map((goal) => {
              const progress = calculateProgress(
                goal.startValue,
                goal.current, // <--- PERBAIKAN DI SINI (sebelumnya currentValue)
                goal.target, // <--- PERBAIKAN DI SINI (sebelumnya targetValue)
                goal.type
              );
              // 2. LOGIKA WARNA & TIPE
              const isDescending = goal.type === "descending";
              const progressColor = isDescending
                ? "bg-orange-500"
                : "bg-green-500";

              // 3. LOGIKA DEADLINE
              const daysRemaining = Math.ceil(
                (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={goal.goal_id}
                  className={`border-2 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200 ${getPriorityColor(
                    goal.priority
                  )}`}
                  onClick={() => handleCardClick(goal)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-white rounded-lg">
                        {getMetricIcon(goal.metric)}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          goal.status
                        )}`}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        goal.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : goal.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>

                  {/* Goal Info */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {goal.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {goal.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {goal.current} / {goal.target} {goal.metric}
                      </span>
                      {isDescending && (
                        <span className="text-orange-600 font-medium text-[10px] bg-orange-50 px-1 rounded">
                          Target Loss
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{daysRemaining}d left</span>
                    </div>
                    <div className="flex items-center space-x-1 text-indigo-600">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Active Goals
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first goal to start tracking your progress
            </p>
            <button
              onClick={() => setShowGoalModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Create First Goal
            </button>
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-indigo-600" />
            Completed Goals ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.goal_id}
                className="border border-green-200 bg-green-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => handleCardClick(goal)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getMetricIcon(goal.metric)}
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Completed
                    </span>
                  </div>
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {goal.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {goal.description}
                </p>
                <div className="text-center py-2 bg-green-100 rounded-lg">
                  <span className="text-green-700 font-semibold">
                    🎉 Goal Achieved!
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Schedule Section (Tetap sama) */}
      {/* Weekly Schedule Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Weekly Schedule
          </h2>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Schedule</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
            const daySchedule = weeklySchedule.find((item) => item.day === day);
            const type = daySchedule?.type || "Rest";
            const details = daySchedule?.details || "";

            return (
              <div
                key={day}
                className="text-center group cursor-pointer"
                onClick={() =>
                  setSelectedDay(daySchedule || { day, type, details })
                }
              >
                <div className="text-xs font-semibold text-gray-600 mb-2">
                  {day}
                </div>
                <div
                  className={`p-3 rounded-lg border-2 min-h-[60px] flex flex-col items-center justify-center transition-all ${
                    type === "Workout"
                      ? "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                      : type === "Cardio"
                      ? "bg-green-50 border-green-200 hover:bg-green-100"
                      : type === "Strength"
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : type === "Recovery"
                      ? "bg-purple-50 border-purple-200 hover:bg-purple-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-xs font-medium">
                    {type === "Workout" || type === "Strength" ? (
                      <Dumbbell className="w-3 h-3 mx-auto mb-1 text-indigo-600" />
                    ) : type === "Cardio" ? (
                      <Activity className="w-3 h-3 mx-auto mb-1 text-green-600" />
                    ) : type === "Recovery" ? (
                      <HeartPulse className="w-3 h-3 mx-auto mb-1 text-purple-600" />
                    ) : (
                      <div className="w-3 h-3 mx-auto mb-1" />
                    )}
                    {type}
                  </div>
                  {details && (
                    <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                      {details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Detail Modal */}
        {selectedDay && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-indigo-800">
                  {selectedDay.day} - {selectedDay.type}
                </h3>
                <p className="text-gray-700 mt-1">{selectedDay.details}</p>
                {selectedDay.exercises && selectedDay.exercises.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm text-gray-600">
                      Exercises:
                    </h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      {selectedDay.exercises.map((exercise, index) => (
                        <li key={index}>
                          • {exercise.name}{" "}
                          {exercise.sets && `- ${exercise.sets} sets`}{" "}
                          {exercise.reps && `- ${exercise.reps} reps`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-indigo-600 hover:text-indigo-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false);
          setSelectedGoal(null);
        }}
        onSave={
          goalModalMode === "create"
            ? handleCreateGoal
            : (data) => updateGoal(selectedGoal.goal_id, data)
        }
        goal={selectedGoal}
        mode={goalModalMode}
      />

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveSchedule}
        schedule={weeklySchedule}
      />
    </div>
  );
};

export default GoalsPage;
