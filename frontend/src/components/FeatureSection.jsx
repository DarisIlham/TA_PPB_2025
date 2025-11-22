import React, { useState, useEffect } from "react";
import { BookOpen, Users, Wrench, Trophy } from 'lucide-react';
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home`);
        if (!response.ok) throw new Error('Failed to fetch features');
        const data = await response.json();
        
        setFeatures({
          judulfeature: data.judulfeature || "Kenapa Harus SD Negeri Tembalang?",
          feature1: data.feature1 || "Kurikulum Berbasis Industri",
          deskripsifeature1: data.deskripsifeature1 || "Program pembelajaran yang disesuaikan dengan kebutuhan industri modern.",
          feature2: data.feature2 || "Tenaga Pengajar Berpengalaman",
          deskripsifeature2: data.deskripsifeature2 || "Guru-guru profesional dengan pengalaman industri.",
          feature3: data.feature3 || "Fasilitas Lengkap",
          deskripsifeature3: data.deskripsifeature3 || "Laboratorium dan workshop modern dengan peralatan terkini.",
          feature4: data.feature4 || "Prestasi Gemilang",
          deskripsifeature4: data.deskripsifeature4 || "Meraih berbagai prestasi di tingkat regional dan nasional."
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load features');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const featureIcons = [
    <BookOpen className="w-8 h-8 text-blue-600" />,
    <Users className="w-8 h-8 text-blue-600" />,
    <Wrench className="w-8 h-8 text-blue-600" />,
    <Trophy className="w-8 h-8 text-blue-600" />
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.8,
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

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2 mx-auto mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="text-center p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Harus SD Negeri Tembalang?
            </h2>
            <p className="text-red-500">{error}</p>
          </div>
          {/* Fallback to default features if API fails */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((num, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {featureIcons[index]}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {features[`feature${num}`]}
                </h3>
                <p className="text-gray-600">
                  {features[`deskripsifeature${num}`]}
                </p>
              </div>
            ))}
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
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {features.judulfeature}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((num, index) => (
          <motion.div
            key={index}
            className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow bg-white"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex justify-center mb-4">
              {featureIcons[index]}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {features[`feature${num}`]}
            </h3>
            <p className="text-gray-600">
              {features[`deskripsifeature${num}`]}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
  );
};

export default FeaturesSection;