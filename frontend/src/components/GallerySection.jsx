import React, { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, X } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [header, setHeader] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/galeri`);
        if (!response.ok) throw new Error('Failed to fetch images');
        const data = await response.json();
        setImages(data.data || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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

  const handleZoom = (direction, e) => {
    e.stopPropagation();
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
    setPosition({ x: 0, y: 0 });
  };

  const resetZoom = (e) => {
    e.stopPropagation();
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel === 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel === 1) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    if (imageRef.current) {
      const maxX = (imageRef.current.offsetWidth * (zoomLevel - 1)) / 2;
      const maxY = (imageRef.current.offsetHeight * (zoomLevel - 1)) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (loading) {
    return (
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Foto Dokumentasi Kegiatan {header.nama}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-gray-200 rounded-lg h-64"
              ></motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Foto Dokumentasi Kegiatan {header.nama}
            </h2>
          </motion.div>
          
          {images.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id_galeri}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-w-4 aspect-h-3 relative">
                    <motion.img
                      src={
                        image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                          ? image.gambar
                          : `data:image/jpeg;base64,${image.gambar}`
                      }
                      alt={`Gallery Image ${image.id_galeri}`}
                      className="w-full h-64 object-cover cursor-zoom-in"
                      onClick={() => {
                        setZoomedImage(
                          image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                            ? image.gambar
                            : `data:image/jpeg;base64,${image.gambar}`
                        );
                        setZoomLevel(1);
                        setPosition({ x: 0, y: 0 });
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-black/50 p-2 rounded-full hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomedImage(
                            image.gambar.startsWith("http") || image.gambar.startsWith("data:")
                              ? image.gambar
                              : `data:image/jpeg;base64,${image.gambar}`
                          );
                          setZoomLevel(1);
                          setPosition({ x: 0, y: 0 });
                        }}
                      >
                        <ZoomIn className="text-white w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">
                Belum ada foto dokumentasi yang tersedia
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => {
              setZoomedImage(null);
              resetZoom();
            }}
          >
            <motion.div 
              className="relative w-full h-full overflow-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(null);
                  resetZoom(e);
                }}
                className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10 hover:bg-black/70"
              >
                <X size={24} />
              </motion.button>
              
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleZoom('in', e)} 
                  className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleZoom('out', e)} 
                  className="text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => resetZoom(e)} 
                  className="text-white bg-black/50 p-2 rounded-full text-sm px-3 hover:bg-black/70"
                >
                  Reset
                </motion.button>
              </div>
              
              <div 
                className="w-full h-full overflow-hidden flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <motion.img
                  ref={imageRef}
                  src={zoomedImage}
                  alt="Zoomed"
                  className="object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: zoomLevel }}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transformOrigin: "center center",
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    width: "auto",
                    height: "auto",
                    maxWidth: "100%",
                    maxHeight: "100%"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;