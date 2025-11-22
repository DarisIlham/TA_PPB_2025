import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

const AboutSection = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    deskripsi: "",
    gambar: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.7,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (response.ok) {
          const data = await response.json();
          setHeader({nama: data.judul || ""});
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profil`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData({
          deskripsi: data.deskripsi || "",
          gambar: data.gambar || ""
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfil = (e) => {
    e.preventDefault();
    navigate('/profil');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            </div>
            <div>
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-6 w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse mt-8 w-48"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">Error loading profile: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="py-20 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image with animation */}
          <motion.div variants={imageVariants}>
            {profileData.gambar ? (
              <motion.img
                src={profileData.gambar.startsWith('http') 
                  ? profileData.gambar 
                  : `data:image/jpeg;base64,${profileData.gambar}`}
                alt="Profil SD Negeri Tembalang"
                className="rounded-lg h-96 w-full object-cover shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 250, damping: 10 }}
              />
            ) : (
              <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-600">School Image</span>
              </div>
            )}
          </motion.div>

          {/* Right side - Content with staggered animations */}
          <motion.div variants={containerVariants}>
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Profil {header.nama}
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8 text-lg leading-relaxed"
              variants={itemVariants}
            >
              {profileData.deskripsi || "SD Negeri Tembalang adalah sekolah dasar negeri yang berkomitmen untuk memberikan pendidikan berkualitas bagi siswa-siswinya."}
            </motion.p>
            <motion.button 
              onClick={handleProfil}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Baca Selengkapnya <ChevronRight className="inline ml-1" size={20} />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;