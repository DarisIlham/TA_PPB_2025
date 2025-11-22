import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';


const HeaderAdmin = () => {
  // const navigate = useNavigate();
  // const handleNavigation = (e, item) => {
  //   e.preventDefault();
  //   if (item === "Profil") {
  //     navigate("/profiladmin"); // <- ke /profil, bukan /profile
  //   } else if (item === "Beranda") {
  //     navigate("/");
  //   } else if (item === "BeritaAdmin") {
  //     navigate("/beritaadmin");
  //   }
  //   else {
  //     navigate(`/${item.toLowerCase()}`);
  //   }
  // };
  // const handleKontak = (e) => {
  //   e.preventDefault();
  //   navigate("/kontak");
  // };
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  if (!token) {
    return null; 
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <span className="hidden md:block text-sm font-medium">Admin</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {
              // Logika logout di sini
              console.log('Logout clicked');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}



export default HeaderAdmin;

