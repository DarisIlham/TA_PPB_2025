import React, {useEffect, useState, useRef } from "react";
import { Plus, Edit, Trash2, Save, X, Upload, ChevronLeft, ZoomIn, ZoomOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GaleriAdmin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({ gambar: "" });

  const getAuthToken = () => {
    return localStorage.getItem('token'); 
  };

  const [header, setHeader] = useState("");
    
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
                // Fallback to default values if API fails
              } finally {
                setLoading(false);
              }
            };
            fetchData();
          }, []);

  // Fetch all gallery images
  const fetchImages = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_BASE_URL}/api/galeri`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch images. Status: ${response.status}\n${text}`);
      }

      const data = await response.json();
      setImages(data.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
     if (!token) {
      navigate("/admin");
      return;
    }

    fetchImages(navigate, token);
  }, );

   if (!token) {
    return null;
  }

  // Handle zoom in/out
  const handleZoom = (direction) => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
    // Reset position when zooming to keep image centered
    setPosition({ x: 0, y: 0 });
  };

  // Reset zoom and position
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse down handler for dragging
  const handleMouseDown = (e) => {
    if (zoomLevel === 1) return; // No need to drag when not zoomed
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Mouse move handler for dragging
  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel === 1) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    // Calculate max position based on zoom level
    if (imageRef.current) {
      const maxX = (imageRef.current.offsetWidth * (zoomLevel - 1)) / 2;
      const maxY = (imageRef.current.offsetHeight * (zoomLevel - 1)) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch start handler
  const handleTouchStart = (e) => {
    if (zoomLevel === 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  // Touch move handler
  const handleTouchMove = (e) => {
    if (!isDragging || zoomLevel === 1) return;
    
    const newX = e.touches[0].clientX - startPos.x;
    const newY = e.touches[0].clientY - startPos.y;
    
    if (imageRef.current) {
      const maxX = (imageRef.current.offsetWidth * (zoomLevel - 1)) / 2;
      const maxY = (imageRef.current.offsetHeight * (zoomLevel - 1)) / 2;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  };

  // Handle file upload with base64
  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        setError("File size too large (max 5MB)");
        return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
        return;
    }

    try {
        const base64String = await convertToBase64(file);
        setFormData(prev => ({ ...prev, [field]: base64String }));
        setError(null);
    } catch (err) {
        console.error("Error converting file", err);
        setError("Failed to convert image");
    }
    };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.gambar || formData.gambar === "") {
        setError("Silakan unggah gambar terlebih dahulu.");
        return;
    }

    try {
        const token = getAuthToken();
        let response;
        
        if (editingId) {
          // Update existing image
          response = await fetch(`${API_BASE_URL}/api/galeri/${editingId}`, {
            method: "PUT",  // or "PATCH" depending on your API
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ gambar: formData.gambar })
        });
      } else {
        // Create new image
        response = await fetch(`${API_BASE_URL}/api/galeri`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      },
        body: JSON.stringify({ gambar: formData.gambar })
      });
    };

    const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan gambar");

      if (editingId) {
        // Update the existing image in state
        setImages(images.map(img => 
          img.id_galeri === editingId ? { ...img, gambar: formData.gambar } : img
        ));
      } else {
        // Add new image to state
        setImages([result.data, ...images]);
      }
      
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDeleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${API_BASE_URL}/api/galeri/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete image");

      setImages(images.filter((item) => item.id_galeri !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ gambar: "" });
    setError(null);
  };

  function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); 
    reader.onerror = error => reject(error);
  });
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Navigation Bar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus size={20} />
                Tambah Galeri
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft className="mr-1" size={20} />
                Kembali
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Header Navigation */}
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center item-center text-center">
            <div>
              <h1 className="text-2xl font-bold bg-blue-900">
                Manajemen Galeri
              </h1>
              <p className="text-white">
                Mengelola gambar dokumentasi kegiatan sekolah.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? "Edit Image" : "Add New Image"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div>
              <label className="block font-medium text-sm mb-1">Upload Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "gambar")}
                className="mb-2 w-full border rounded px-3 py-2"
              />
              {formData.gambar && (
                <div className="relative">
                  <img
                    src={formData.gambar}
                    alt="Preview"
                    className="w-full h-85 object-cover border rounded mb-4"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2 bg-white/80 p-2 rounded-lg shadow">
                    <button 
                      onClick={() => handleZoom('in')} 
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={zoomLevel >= 3}
                    >
                      <ZoomIn size={20} />
                    </button>
                    <button 
                      onClick={() => handleZoom('out')} 
                      className="p-1 hover:bg-gray-200 rounded"
                      disabled={zoomLevel <= 0.5}
                    >
                      <ZoomOut size={20} />
                    </button>
                    <button 
                      onClick={resetZoom} 
                      className="p-1 hover:bg-gray-200 rounded text-sm px-2"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Save size={20} />
                {editingId ? "Update" : "Create"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <button
              onClick={() => {
                setZoomedImage(null);
                resetZoom();
              }}
              className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full z-10"
            >
              <X size={24} />
            </button>
            
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button 
                onClick={() => handleZoom('in')} 
                className="text-white bg-black/50 p-2 rounded-full"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn size={20} />
              </button>
              <button 
                onClick={() => handleZoom('out')} 
                className="text-white bg-black/50 p-2 rounded-full"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut size={20} />
              </button>
              <button 
                onClick={resetZoom} 
                className="text-white bg-black/50 p-2 rounded-full text-sm px-3"
              >
                Reset
              </button>
            </div>
            
            <div 
              className="w-full h-full overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                ref={imageRef}
                src={zoomedImage}
                alt="Zoomed"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
     <main className="container mx-auto px-4 py-12">
  <section className="mb-16">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">Galeri Sekolah</h2>
      <span className="text-gray-600">{images.length} images</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
        {images.flatMap((img, imgIndex) =>
            ["gambar"].map((key, keyIndex) => {
            const gambar = img[key];
            if (!gambar) return null;

            return (
                <div
                key={`${img.id_galeri}-${key}-${imgIndex}-${keyIndex}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 relative min-w-[20rem]"
                >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(img.id_galeri);
                        setFormData({
                        gambar: key === "gambar" ? gambar : "",
                        });
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                    >
                    <Edit size={16} />
                    </button>
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img.id_galeri);
                    }}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>

                <div 
                  className="h-64 w-full cursor-zoom-in"
                  onClick={() => {
                    setZoomedImage(
                      gambar.startsWith("http") || gambar.startsWith("data:")
                        ? gambar
                        : `data:image/jpeg;base64,${gambar}`
                    );
                    setZoomLevel(1);
                  }}
                >
                    <img
                      src={
                      gambar.startsWith("http") || gambar.startsWith("data:")
                          ? gambar
                          : `data:image/jpeg;base64,${gambar}`
                      }
                      alt={`${key}`}
                      className="w-full h-full object-cover"
                    />
                </div>
                </div>
            );
            })
        )}
        </div>

    {!loading && images.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No images found. Add your first image!
        </p>
      </div>
    )}
  </section>
</main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 {header.nama}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GaleriAdmin;