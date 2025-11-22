import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../componentsAdmin/components/Header";
import Footer from "../componentsAdmin/components/Footer";

const GuruAdmin = () => {
  const [teachers, setTeachers] = useState([""]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    pelajaran: "",
    gambar: "",
  });

  const teachersPerPage = 6;

  // Fetch teachers from API
  const fetchTeachers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/gurus`);
      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching teachers:", err);
    } finally {
      setIsLoading(false);
    }
  };

 useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin");
      return;
    }

    fetchTeachers(); 
  }, [navigate]);

  
  // Filter teachers based on search term
  const filteredTeachers = teachers.filter((teacher) => {
  const nama = teacher.nama || teacher.name || "";
  const nip = teacher.nip || "";
  const pelajaran = teacher.pelajaran || teacher.subject || "";

  return (
    nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nip.toString().includes(searchTerm) || 
    pelajaran.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const startIndex = (currentPage - 1) * teachersPerPage;
  const endIndex = startIndex + teachersPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      let response;
      if (modalMode === "create") {
        // Create new teacher
        response = await fetch(`${API_BASE_URL}/api/gurus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Update existing teacher
        response = await fetch(`${API_BASE_URL}/api/gurus/${selectedTeacher._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();

        // ✅ Tangani error dari express-validator (array of errors)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0]?.msg || "Validasi gagal";
          throw new Error(firstError);
        }

        // ✅ Tangani error biasa
        throw new Error(errorData.error || "Failed to create guru");
      }

      // Refresh the teacher list
      await fetchTeachers();
      closeModal();
    } catch (err) {
      alert(err.message);
      console.error("Error saving teacher:", err);
    }
  };

  // Open modal for creating new teacher
  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      nama: "",
      nip: "",
      pelajaran: "",
      gambar: "",
    });
    setShowModal(true);
  };

  // Open modal for editing teacher
  const openEditModal = (teacher) => {
    setModalMode("edit");
    setSelectedTeacher(teacher);
    setFormData({
      nama: teacher.nama,
      nip: teacher.nip,
      pelajaran: teacher.pelajaran,
      gambar: teacher.gambar,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    setFormData({
      nama: "",
      nip: "",
      pelajaran: "",
      gambar: "",
    });
  };

  // Handle delete confirmation
  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gurus/${teacherToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete teacher");
      }

      // Refresh the teacher list
      await fetchTeachers();
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    } catch (err) {
      alert(err.message);
      console.error("Error deleting teacher:", err);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat data guru...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Gagal memuat data: {error}</p>
          <button
            onClick={fetchTeachers}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <Header/>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Search and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari guru berdasarkan nama, NIP, atau mata pelajaran..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tambah Guru
          </button>
        </div>

        {/* Teacher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentTeachers.map((teacher, index) => (
            <div
              key={teacher.id || teacher.nip || index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  {teacher.gambar ? (
                    <img
                      src={`data:image/jpeg;base64,${teacher.gambar}`}
                      alt={teacher.nama}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">
                    {teacher.nama}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    NIP: {teacher.nip}
                  </p>
                  <p className="text-sm text-blue-600 font-medium text-center">
                    {teacher.pelajaran}
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openEditModal(teacher)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(teacher)}
                    className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Tidak ada guru ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah kata kunci pencarian atau tambah guru baru
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`w-10 h-10 rounded-lg border ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {modalMode === "create"
                    ? "Tambah Guru Baru"
                    : "Edit Data Guru"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIP
                  </label>
                  <input
                    type="text"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    name="pelajaran"
                    value={formData.pelajaran}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Gambar Profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({
                            ...prev,
                            gambar: reader.result.split(',')[1], 
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {formData.gambar && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Pratinjau Gambar:</p>
                      <img
                        src={`data:image/jpeg;base64,${formData.gambar}`}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalMode === "create"
                      ? "Tambah Guru"
                      : "Simpan Perubahan"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Konfirmasi Hapus</h2>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus data guru{" "}
                <strong>{teacherToDelete?.name}</strong>? Tindakan ini tidak
                dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuruAdmin;
