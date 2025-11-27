import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navigation from "./Navigation";
import HomePage from "./pages/Homepage";
import StrengthListPage from "./pages/StrengthListPage";
import CardioListPage from "./pages/CardioListPage";
import DashboardPage from "./pages/DashboardPage";
import GoalsPage from "./pages/GoalsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import StrengthDetailPage from "./pages/StrengthDetailPage";
import CardioDetailPage from "./pages/CardioDetailPage";
import WorkoutModal from "./components/WorkoutModal";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import GoalEditPage from "./pages/GoalEditPage";
import { useStrength } from "./hooks/useStrength";
import { useCardio } from "./hooks/useCardio";
import { useGoal } from "./hooks/useGoal";

const Layout = ({ children, appState }) => {
  const location = useLocation();

  const hideNavRoutes = ["/", "/sign"];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNav && <Navigation {...appState} />}
      <div className={shouldShowNav ? "max-w-7xl mx-auto px-4 py-8" : ""}>
        {children}
      </div>
    </>
  );
};

const App = () => {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    age: 0,
    weight: 0,
    height: 0,
    unit: "kg",
    distanceUnit: "km",
  });

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
  };

  const {
    strengthWorkouts,
    loading: strengthLoading,
    error: strengthError,
    refreshData: refreshStrength,
  } = useStrength();

  const {
    cardioWorkouts,
    loading: cardioLoading,
    error: cardioError,
    refreshData: refreshCardio,
  } = useCardio();

  const {
    goals,
    weeklySchedule,
    recommendedSchedules,
    loading: goalsLoading,
    error: goalsError,
    refreshData: refreshGoals,
  } = useGoal();

  useEffect(() => {
    console.log("App - Strength Workouts:", strengthWorkouts);
    console.log("App - Cardio Workouts:", cardioWorkouts);
    console.log("App - Goals:", goals);
    console.log("App - Strength Loading:", strengthLoading);
    console.log("App - Cardio Loading:", cardioLoading);
    console.log("App - Goals Loading:", goalsLoading);
  }, [
    strengthWorkouts,
    cardioWorkouts,
    goals,
    strengthLoading,
    cardioLoading,
    goalsLoading,
  ]);

  const refreshAllData = async () => {
    await Promise.all([refreshStrength(), refreshCardio(), refreshGoals()]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout appState={appState}>
          <Routes>
            <Route path="/" element={<LoginPage {...appState} />} />
            <Route path="/sign" element={<SignUp {...appState} />} />
            <Route
              path="/home"
              element={
                <HomePage
                  {...appState}
                  userProfile={userProfile}
                  setModalType={setModalType}
                  setShowModal={setShowModal}
                  setSelectedWorkoutId={setSelectedWorkoutId}
                />
              }
            />
            <Route
              path="/strength"
              element={
                <StrengthListPage
                  {...appState}
                  setModalType={setModalType}
                  setShowModal={setShowModal}
                />
              }
            />
            <Route path="/cardio" element={<CardioListPage {...appState} />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  {...appState}
                  userProfile={userProfile}
                  setModalType={setModalType}
                  setShowModal={setShowModal}
                  strengthWorkouts={strengthWorkouts || []}
                  cardioWorkouts={cardioWorkouts || []}
                  goals={goals || []}
                  setSelectedWorkoutId={setSelectedWorkoutId}
                />
              }
            />
            <Route
              path="/goals"
              element={
                <GoalsPage
                  {...appState}
                  goals={goals || []}
                  weeklySchedule={weeklySchedule || []}
                  recommendedSchedules={recommendedSchedules || []}
                  loading={goalsLoading}
                />
              }
            />
            <Route
              path="/goals/:id"
              element={<GoalDetailPage {...appState} />}
            />
            <Route
              path="/goals/edit/:id"
              element={<GoalEditPage {...appState} />}
            />
            <Route path="/profile" element={<ProfilePage {...appState}
            userProfile={userProfile}
            setUserProfile={setUserProfile}  />} />
            <Route path="/about" element={<AboutPage {...appState} />} />
            {/* Updated route with parameter */}
            <Route
              path="/strength-detail/:id"
              element={<StrengthDetailPage {...appState} />}
            />
            <Route
              path="/cardio-detail/:id"
              element={<CardioDetailPage {...appState} />}
            />
          </Routes>
        </Layout>

        <WorkoutModal
          {...appState}
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          setModalType={setModalType}
          selectedWorkoutId={selectedWorkoutId}
          setSelectedWorkoutId={setSelectedWorkoutId}
          refreshAllData={refreshAllData}
        />
      </div>
    </Router>
  );
};

export default App;
