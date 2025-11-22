import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Info, Dumbbell, Heart, BarChart3, Target } from 'lucide-react';

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
  
  // Check if current path matches or is a subpath
  const isActivePath = (path) => {
    if (path === '/home') {
      return location.pathname === '/home';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
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
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'hover:bg-indigo-700 hover:bg-opacity-50'
                }`}
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden space-x-1">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-white text-indigo-600'
                    : 'hover:bg-indigo-700'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="md:hidden border-t border-indigo-500 bg-indigo-700 px-4 py-2">
        <p className="text-sm font-medium text-center">
          {navItems.find(item => isActivePath(item.path))?.label || 'FitForge'}
        </p>
      </div>
    </nav>
  );
};

export default Navigation;