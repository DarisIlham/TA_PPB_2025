import React, { useState,useEffect } from "react";
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
import { useStrength } from './hooks/useStrength';
import { useCardio } from './hooks/useCardio';

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
  const [currentPage, setCurrentPage] = useState('dashboard');


  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: "Alex Rodriguez",
    age: 28,
    weight: 75,
    height: 178,
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
    refreshData: refreshStrength 
  } = useStrength();

  const { 
    cardioWorkouts, 
    loading: cardioLoading, 
    error: cardioError,
    refreshData: refreshCardio 
  } = useCardio();

    useEffect(() => {
    console.log('App - Strength Workouts:', strengthWorkouts);
    console.log('App - Cardio Workouts:', cardioWorkouts);
    console.log('App - Strength Loading:', strengthLoading);
    console.log('App - Cardio Loading:', cardioLoading);
  }, [strengthWorkouts, cardioWorkouts, strengthLoading, cardioLoading]);

  const refreshAllData = async () => {
    await Promise.all([refreshStrength(), refreshCardio()]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout appState={appState}>
          <Routes>
            <Route path="/" element={<LoginPage {...appState} />} />
            <Route path="/sign" element={<SignUp {...appState} />} />
            <Route path="/home" element={<HomePage {...appState} />} />
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
                  strengthWorkouts={strengthWorkouts || []} // Pastikan tidak undefined
                  cardioWorkouts={cardioWorkouts || []} // Pastikan tidak undefined
                  setSelectedWorkoutId={setSelectedWorkoutId}
                />
              }
            />
            <Route path="/goals" element={<GoalsPage {...appState} />} />
            <Route path="/profile" element={<ProfilePage {...appState} />} />
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
        />
      </div>
    </Router>
  );
};

export default App;
