import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, User, Info, Dumbbell, Heart, BarChart3, Target, Menu, X
} from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/home' },
  { id: 'strength', icon: Dumbbell, label: 'Strength', path: '/strength' },
  { id: 'cardio', icon: Heart, label: 'Cardio', path: '/cardio' },
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { id: 'goals', icon: Target, label: 'Goals', path: '/goals' },
  { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  { id: 'about', icon: Info, label: 'About', path: '/about' },
];

const Navigation = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

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
              {navItems.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-white text-indigo-600 shadow-md"
                      : "hover:bg-indigo-700 hover:bg-opacity-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden p-2"
              onClick={() => setOpenMenu(true)}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu (Slide In) */}
      <div
        className={` ${
          openMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
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
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-lg transition ${
                isActivePath(item.path)
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setOpenMenu(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      
    </>
  );
};

export default Navigation;
