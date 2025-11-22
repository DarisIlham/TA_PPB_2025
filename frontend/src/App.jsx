import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import HomePage from './pages/Homepage';
import StrengthListPage from './pages/StrengthListPage';
import CardioListPage from './pages/CardioListPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import StrengthDetailPage from './pages/StrengthDetailPage';
import CardioDetailPage from './pages/CardioDetailPage';
import WorkoutModal from './components/WorkoutModal';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUpPage';

const App = () => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  
  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Rodriguez',
    age: 28,
    weight: 75,
    height: 178,
    unit: 'kg',
    distanceUnit: 'km'
  });

  // Strength Workouts State
  const [strengthWorkouts, setStrengthWorkouts] = useState([
    {
      id: 1,
      date: '2024-11-18',
      name: 'Push Day A',
      exercises: [
        { name: 'Bench Press', sets: [{ weight: 80, reps: 8 }, { weight: 80, reps: 7 }, { weight: 75, reps: 9 }] },
        { name: 'Overhead Press', sets: [{ weight: 50, reps: 10 }, { weight: 50, reps: 9 }, { weight: 50, reps: 8 }] },
        { name: 'Dips', sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 11 }, { weight: 0, reps: 10 }] }
      ],
      duration: 65,
      totalVolume: 2535,
      rpe: 8
    },
    {
      id: 2,
      date: '2024-11-15',
      name: 'Leg Day',
      exercises: [
        { name: 'Squat', sets: [{ weight: 100, reps: 8 }, { weight: 100, reps: 7 }, { weight: 95, reps: 9 }] },
        { name: 'Romanian Deadlift', sets: [{ weight: 80, reps: 10 }, { weight: 80, reps: 10 }, { weight: 80, reps: 9 }] },
        { name: 'Leg Press', sets: [{ weight: 150, reps: 12 }, { weight: 150, reps: 11 }] }
      ],
      duration: 75,
      totalVolume: 7620,
      rpe: 9
    },
    {
      id: 3,
      date: '2024-11-13',
      name: 'Pull Day A',
      exercises: [
        { name: 'Deadlift', sets: [{ weight: 120, reps: 5 }, { weight: 120, reps: 5 }, { weight: 110, reps: 7 }] },
        { name: 'Pull-ups', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 9 }, { weight: 0, reps: 8 }] },
        { name: 'Barbell Row', sets: [{ weight: 70, reps: 10 }, { weight: 70, reps: 9 }, { weight: 70, reps: 8 }] }
      ],
      duration: 70,
      totalVolume: 3080,
      rpe: 8
    }
  ]);

  // Cardio Workouts State
  const [cardioWorkouts, setCardioWorkouts] = useState([
    {
      id: 1,
      date: '2024-11-17',
      type: 'Running',
      distance: 5.2,
      duration: 28,
      pace: '5:23',
      calories: 420,
      location: 'Central Park'
    },
    {
      id: 2,
      date: '2024-11-14',
      type: 'Cycling',
      distance: 25.5,
      duration: 65,
      pace: '2:33',
      calories: 580,
      location: 'Riverside Trail'
    },
    {
      id: 3,
      date: '2024-11-11',
      type: 'Running',
      distance: 10.1,
      duration: 58,
      pace: '5:44',
      calories: 780,
      location: 'Marathon Route'
    }
  ]);

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
      current: 58,
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

  // Shared app state
  const appState = {
    selectedWorkoutId,
    setSelectedWorkoutId,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    userProfile,
    setUserProfile,
    strengthWorkouts,
    setStrengthWorkouts,
    cardioWorkouts,
    setCardioWorkouts,
    goals,
    setGoals
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation {...appState} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LoginPage {...appState} />} />
            <Route path="/signup" element={<SignUp {...appState} />} />
            <Route path="/home" element={<HomePage {...appState} />} />
            <Route path="/strength" element={<StrengthListPage {...appState} />} />
            <Route path="/cardio" element={<CardioListPage {...appState} />} />
            <Route path="/dashboard" element={<DashboardPage {...appState} />} />
            <Route path="/goals" element={<GoalsPage {...appState} />} />
            <Route path="/profile" element={<ProfilePage {...appState} />} />
            <Route path="/about" element={<AboutPage {...appState} />} />
            <Route path="/strength-detail" element={<StrengthDetailPage {...appState} />} />
            <Route path="/cardio-detail" element={<CardioDetailPage {...appState} />} />
          </Routes>
        </div>
        <WorkoutModal {...appState} />
      </div>
    </Router>
  );
};

export default App;