import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profile from "../img/pp.jpg";

const LogoutAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogoutClick = () => setShowPopup(true);
  const handleCancel = () => setShowPopup(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin");
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUsername(parsedUser.name || "User");
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }

    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const backSign = (e) => {
    e.preventDefault();
    navigate("/homeadmin");
  };

  if (!token) return null;

  return (
    <div className="bg-red-50 text-black min-h-screen w-full">
      {/* Header with Back Button */}
      <div className="p-6 md:p-8">
        <button
          onClick={backSign}
          className="flex items-center text-lg text-gray-600 hover:text-black transition-colors duration-200 group"
          aria-label="Kembali ke beranda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Kembali ke beranda</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-[400px]">
          {/* Profile Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <img
                src={profile}
                alt="Profile"
                className="w-45 h-45 rounded-full object-cover border-4 border-red-500 shadow-2xl mx-auto"
              />
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Login sebagai
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">{username}</h2>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-gray-100 rounded-2xl p-6 border border-gray-300 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-xl md:text-2xl font-bold mb-4">Yakin untuk Logout?</h1>
            </div>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400/30 text-lg transform hover:scale-[1.02] hover:shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white text-black rounded-2xl p-8 w-full max-w-sm shadow-2xl transform transition-all animate-scaleIn border border-gray-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Konfirmasi Logout</h3>
              <p className="text-gray-600">
                Apakah kamu yakin ingin logout dari akun kamu?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-xl transition-colors duration-200"
              >
                Tidak
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors duration-200"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LogoutAdmin;
