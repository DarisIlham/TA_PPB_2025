import React, { useState, useEffect } from "react";
import { X, Menu } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [header, setHeader] = useState('SD Negeri Tembalang');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Navigation handler
  const handleNavigation = (e, item) => {
    e.preventDefault();
    switch(item) {
      case 'Prestasi':
        window.open('https://sangjuara.semarangkota.go.id/', '_blank');
        break;
      case 'Beranda':
        navigate('/');
        break;
      case 'Profil':
        navigate('/profil');
        break;
      case 'Guru':
        navigate('/guru');
        break;
      case 'Siswa':
        navigate('/siswa');
        break;
      case 'Berita':
        navigate('/berita');
        break;
      case 'Kontak':
        navigate('/kontak');
        break;
      case 'Kalender':
        navigate('/kalender');
        break;
      default:
        navigate('/');
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
        // Fallback to default values if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <h1 className="text-xl font-bold text-blue-600">{header}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['Beranda', 'Profil', 'Guru', 'Siswa', 'Prestasi', 'Berita', 'Kalender', 'Kontak'].map((item) => (
              <button
                key={item}
                onClick={(e) => handleNavigation(e, item)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item}
              </button>
            ))}
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
                {label: 'Beranda', href: '/'}, 
                {label: 'Profil', href: '/profil'}, 
                {label: 'Guru', href: '/guru'}, 
                {label: 'Siswa', href: '/siswa'}, 
                {label: 'Prestasi', href: 'https://sangjuara.semarangkota.go.id/'}, 
                {label: 'Berita', href: '/berita'}, 
                {label: 'Kalender', href: '/kalender'},
                {label: 'Kontak', href: '/kontak'}, 
              ].map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(e, item.label);
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;