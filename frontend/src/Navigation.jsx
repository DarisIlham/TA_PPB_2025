import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, User, Info, Dumbbell, Heart, BarChart3, Target,
  Menu, X, ChevronUp, ChevronDown
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null); 
  // null | "training" | "insights"

  const isActivePath = (path) =>
    path === '/home'
      ? location.pathname === '/home'
      : location.pathname.startsWith(path);

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2">
              <Dumbbell className="w-8 h-8" />
              <span className="text-2xl font-bold">FitForge</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              <Link to="/home"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/home") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <Home className="w-4 h-4" /> <span>Home</span>
              </Link>

              <Link to="/strength"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/strength") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <Dumbbell className="w-4 h-4" /> <span>Strength</span>
              </Link>

              <Link to="/cardio"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/cardio") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <Heart className="w-4 h-4" /> <span>Cardio</span>
              </Link>

              <Link to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/dashboard") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> <span>Dashboard</span>
              </Link>

              <Link to="/goals"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/goals") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <Target className="w-4 h-4" /> <span>Goals</span>
              </Link>

              <Link to="/profile"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/profile") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <User className="w-4 h-4" /> <span>Profile</span>
              </Link>

              <Link to="/about"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActivePath("/about") ? "bg-white text-indigo-600" : "hover:bg-indigo-700 hover:bg-opacity-50"
                }`}
              >
                <Info className="w-4 h-4" /> <span>About</span>
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button className="md:hidden p-2" onClick={() => setOpenMenu(true)}>
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-black/40 ${openMenu ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpenMenu(false)}
      />

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setOpenMenu(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <Link to="/home" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <Home size={20} /> <span>Home</span>
          </Link>

          <Link to="/strength" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <Dumbbell size={20} /> <span>Strength</span>
          </Link>

          <Link to="/cardio" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <Heart size={20} /> <span>Cardio</span>
          </Link>

          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <BarChart3 size={20} /> <span>Dashboard</span>
          </Link>

          <Link to="/goals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <Target size={20} /> <span>Goals</span>
          </Link>

          <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <User size={20} /> <span>Profile</span>
          </Link>

          <Link to="/about" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200">
            <Info size={20} /> <span>About</span>
          </Link>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVBAR WITH DROPDOWNS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md flex justify-around py-2 md:hidden z-50">

        {/* Home */}
        <Link
          to="/home"
          className={`flex flex-col items-center ${
            isActivePath("/home") ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* TRAINING GROUP (Strength + Cardio) */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenMobileDropdown(openMobileDropdown === "training" ? null : "training")
            }
            className={`flex flex-col items-center ${
              openMobileDropdown === "training" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs mt-1">Training</span>
            {openMobileDropdown === "training" ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
          </button>

          {openMobileDropdown === "training" && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 space-y-1 w-32">
              <Link to="/strength" className="flex items-center gap-2 p-2 hover:bg-gray-100 text-sm">
                <Dumbbell size={16} /> Strength
              </Link>
              <Link to="/cardio" className="flex items-center gap-2 p-2 hover:bg-gray-100 text-sm">
                <Heart size={16} /> Cardio
              </Link>
            </div>
          )}
        </div>

        {/* INSIGHTS GROUP (Dashboard + Goals) */}
        <div className="relative">
          <button
            onClick={() =>
              setOpenMobileDropdown(openMobileDropdown === "insights" ? null : "insights")
            }
            className={`flex flex-col items-center ${
              openMobileDropdown === "insights" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs mt-1">Insights</span>
            {openMobileDropdown === "insights" ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} />
            )}
          </button>

          {openMobileDropdown === "insights" && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 space-y-1 w-32">
              <Link to="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 text-sm">
                <BarChart3 size={16} /> Dashboard
              </Link>
              <Link to="/goals" className="flex items-center gap-2 p-2 hover:bg-gray-100 text-sm">
                <Target size={16} /> Goals
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            isActivePath("/profile") ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>

        {/* About */}
        <Link
          to="/about"
          className={`flex flex-col items-center ${
            isActivePath("/about") ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Info className="w-6 h-6" />
          <span className="text-xs mt-1">About</span>
        </Link>
      </div>
    </>
  );
};

export default Navigation;
