// Profile Page
import React, { useState, useEffect } from "react";
import {
  Edit,
  Camera,
  Save,
  X,
  Home,
  User,
  Info,
  Dumbbell,
  Heart,
  BarChart3,
  Target,
  Plus,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Activity,
  ChevronRight,
  Trash2,
  Download,
} from "lucide-react";

const ProfilePage = ({
  userProfile,
  setUserProfile,
  setModalType,
  setShowModal,
  setSelectedWorkoutId,
  strengthWorkouts = [],
  cardioWorkouts = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Initialize editedProfile when userProfile changes
  useEffect(() => {
    setEditedProfile(userProfile || {});
    setProfileImage(userProfile?.profile_picture || null);
  }, [userProfile]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (setUserProfile) {
            setUserProfile(prev => ({
              ...prev,
              ...data.user
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [setUserProfile]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedProfile(userProfile || {});
      setProfileImage(userProfile?.profile_picture || null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        setEditedProfile(prev => ({
          ...prev,
          profile_picture: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        const data = await response.json();
        if (setUserProfile) {
          setUserProfile(prev => ({
            ...prev,
            ...data.user
          }));
        }
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update profile: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const safeUserProfile = userProfile || {
    name: "User",
    age: 0,
    weight: 0,
    height: 0,
    unit: "kg",
    distanceUnit: "km",
    profile_picture: null
  };

  const safeStrengthWorkouts = strengthWorkouts || [];
  const safeCardioWorkouts = cardioWorkouts || [];
  
  const totalWorkouts = safeStrengthWorkouts.length + safeCardioWorkouts.length;
  const totalVolume = safeStrengthWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  const totalDistance = safeCardioWorkouts.reduce((sum, w) => sum + (w.distance || 0), 0);

  const calculateBMI = () => {
    if (!safeUserProfile.height || !safeUserProfile.weight) return 0;
    return (safeUserProfile.weight / ((safeUserProfile.height / 100) ** 2)).toFixed(1);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={handleEditToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isEditing 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(editedProfile.name || safeUserProfile.name)
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg">
                <Camera className="w-4 h-4 text-indigo-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedProfile.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-3xl font-bold bg-transparent border-b-2 border-white outline-none text-white placeholder-white/70"
                  placeholder="Enter your name"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={editedProfile.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-b border-white/50 outline-none text-white placeholder-white/70"
                    placeholder="Age"
                  />
                  <input
                    type="number"
                    value={editedProfile.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    className="bg-transparent border-b border-white/50 outline-none text-white placeholder-white/70"
                    placeholder="Weight"
                  />
                  <input
                    type="number"
                    value={editedProfile.height || ''}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                    className="bg-transparent border-b border-white/50 outline-none text-white placeholder-white/70"
                    placeholder="Height (cm)"
                  />
                  <select
                    value={editedProfile.unit || 'kg'}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="bg-transparent border-b border-white/50 outline-none text-white"
                  >
                    <option value="kg" className="text-gray-800">kg</option>
                    <option value="lbs" className="text-gray-800">lbs</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold">{safeUserProfile.name}</h2>
                <p className="text-indigo-100">
                  {safeUserProfile.age} years • {safeUserProfile.weight} {safeUserProfile.unit} • {safeUserProfile.height} cm
                </p>
                <p className="text-indigo-100 mt-1">
                  BMI: {calculateBMI()}
                </p>
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Biometric Data */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Biometric Data</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Age</p>
            <p className="text-2xl font-bold text-blue-600">{safeUserProfile.age}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Weight</p>
            <p className="text-2xl font-bold text-green-600">
              {safeUserProfile.weight} {safeUserProfile.unit}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Height</p>
            <p className="text-2xl font-bold text-purple-600">{safeUserProfile.height} cm</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">BMI</p>
            <p className="text-2xl font-bold text-orange-600">{calculateBMI()}</p>
          </div>
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Lifetime Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <Activity className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
            <p className="text-sm text-gray-600">Total Workouts</p>
            <p className="text-3xl font-bold text-indigo-600">{totalWorkouts}</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Dumbbell className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-gray-600">Total Volume Lifted</p>
            <p className="text-3xl font-bold text-purple-600">{totalVolume.toLocaleString()} kg</p>
          </div>
          <div className="text-center p-6 bg-pink-50 rounded-lg">
            <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
            <p className="text-sm text-gray-600">Total Distance</p>
            <p className="text-3xl font-bold text-pink-600">{totalDistance.toFixed(1)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;