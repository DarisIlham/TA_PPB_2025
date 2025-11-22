import React from "react";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [header, setHeader] = useState('SD Negeri Tembalang');
  const [isEditing, setIsEditing] = useState(false);
  const [tempHeader, setTempHeader] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [logo, setLogo] = useState('');
  const [tempLogo, setTempLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("token");
      navigate("/admin");
    }
  };

  // Navigation handler
  const handleNavigation = (e, item) => {
    e.preventDefault();
    if (item === "Profil") {
      navigate("/profiladmin");
    } else if (item === "Beranda") {
      navigate("/homeadmin");
    } else if (item === "Berita") {
      navigate("/beritaadmin");
    } else if (item === "Prestasi") {
      window.open('https://sangjuara.semarangkota.go.id/', '_blank');
    } else if (item === "Guru") navigate("/guruadmin");
    else if (item === "Kalender") navigate("/kalenderadmin");
    else if (item === "Siswa") navigate("/siswaadmin");
    else if (item === "Kontak") navigate("/kontakadmin");
    else {
      navigate(`/${item.toLowerCase()}`);
    }
  };

  // Fetch header data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error('Failed to fetch header');
        const data = await response.json();
        setHeader(data.header || 'SD Negeri Tembalang');

        const logoResponse = await fetch(`${API_BASE_URL}/api/footer`);
        if (!logoResponse.ok) throw new Error('Failed to fetch logo');
        const logoData = await logoResponse.json();
        setLogo(logoData.logo || '');

      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Edit handlers
  const handleEditClick = () => {
    setTempHeader(header);
    setTempLogo(logo);
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // First get the current document to preserve other fields
        const headerResponse = await fetch(`${API_BASE_URL}/api/home`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ header: tempHeader }),
      });

       if (!headerResponse.ok) {
        const errorData = await headerResponse.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to update header');
      }

      const logoResponse = await fetch(`${API_BASE_URL}/api/footer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ logo: tempLogo }),
      });

      if (!logoResponse.ok) {
        const errorData = await logoResponse.json();
        throw new Error(errorData.errors?.[0]?.msg || 'Failed to update logo');
      }

      const headerData = await headerResponse.json();
      const logoData = await logoResponse.json();

      setHeader(headerData.header);
      setLogo(logoData.logo);
      setMessage('Header and logo updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit mode UI
  if (isEditing) {
    return (
       <div className="bg-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempHeader}
              onChange={(e) => setTempHeader(e.target.value)}
              className="text-xl font-bold text-blue-600 border border-gray-300 p-1 rounded"
              maxLength={100}
              required
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelClick}
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={tempLogo}
              onChange={(e) => setTempLogo(e.target.value)}
              placeholder="Enter logo URL"
              className="border border-gray-300 p-1 rounded flex-1"
            />
            {tempLogo && (
              <img 
                src={tempLogo} 
                alt="Logo preview" 
                className="h-8 w-8 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
          
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded mr-3 animate-pulse"></div>
          <div className="h-6 w-40 bg-gray-200 animate-pulse"></div>
        </div>
      </header>
    );
  }

  // Main header UI
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Header */}
          <div className="flex-shrink-0 flex items-center">
            {logo ? (
              <img 
                src={logo} 
                alt="School Logo" 
                className="w-8 h-8 rounded mr-3 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ''; // Remove broken image
                  e.target.className = 'w-8 h-8 bg-blue-600 rounded mr-3';
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded mr-3"></div>
            )}
            <h1 className="text-xl font-bold text-blue-600 mb-1">{header}</h1>
            {localStorage.getItem('token') && (
              <button
                onClick={handleEditClick}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              "Beranda",
              "Profil",
              "Guru",
              "Siswa",
              "Prestasi",
              "Berita",
              "Kalender",
              "Kontak",
            ].map((item) => (
              <button
                key={item}
                onClick={(e) => handleNavigation(e, item)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item}
              </button>
            ))}
            {/* Logout button */}
            <button
              onClick={() => navigate("/logoutadmin")}
              className="text-white border border-red-600 px-4 py-1 rounded bg-red-600"
            >
              Logout
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden overflow-hidden transition-all duration-300 ease-in-out transform origin-top">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {[
                "Beranda",
                "Profil",
                "Guru",
                "Siswa",
                "Prestasi",
                "Berita",
                "Akademik",
                "Kontak",
                "Logout"
              ].map((item) => (
                <button
                  key={item}
                  onClick={(e) => {
                    handleNavigation(e, item);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        )}     
      </div>
    </header>
  );
};

export default Header;