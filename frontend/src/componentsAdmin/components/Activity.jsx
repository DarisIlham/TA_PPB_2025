import React, { useState, useEffect } from 'react';
import { Calendar, Scroll, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set this to your app root element id

const ActivityList = () => {
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    date: '',
    status: 'pending'
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch activities
  useEffect(() => {
    fetchActivities();
  }, );

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      
      const transformedActivities = data.map(activity => ({
        id: activity._id,
        title: activity.title,
        description: activity.description,
        date: activity.date,
        status: reverseStatus(activity.status),
        participants: activity.description
      }));
      
      setUpcomingActivities(transformedActivities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Status translation
  const reverseStatus = (status) => {
    const statusMap = {
      'pending': 'Persiapan',
      'in-progress': 'Berlangsung',
      'completed': 'Selesai'
    };
    return statusMap[status] || status;
  };

  const mapStatusToCode = (status) => {
  const statusMap = {
    'Persiapan': 'pending',
    'Berlangsung': 'in-progress',
    'Selesai': 'completed'
  };
  return statusMap[status] || status;
};

  // Handle activity click
  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  // Handle add activity
  const handleAddActivity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newActivity.title,
          description: newActivity.description,
          date: newActivity.date,
          status: newActivity.status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add activity');
      }

      setIsAddModalOpen(false);
      setNewActivity({
        title: '',
        description: '',
        date: '',
        status: 'pending'
      });
      fetchActivities(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete activity');

      setIsModalOpen(false);
      fetchActivities(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle update activity
  const handleUpdateActivity = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/activities/${selectedActivity.id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
           title: selectedActivity.title,
            description: selectedActivity.description,
            date: selectedActivity.date,
            status: mapStatusToCode(selectedActivity.status)
          }),
        }
      );

       if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update activity');
      }

      setIsModalOpen(false);
      setIsEditMode(false);
      fetchActivities(); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Memuat kegiatan...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
          <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-blue-900">Kegiatan Non-Akademik</h3>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {upcomingActivities.length === 0 ? (
          <p className="text-gray-500">Tidak ada kegiatan yang akan datang</p>
        ) : (
          <div className="space-y-4">
            {upcomingActivities.map(activity => (
              <div 
                key={activity.id} 
                className="border-l-4 border-blue-600 pl-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => handleActivityClick(activity)}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{activity.title}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(activity.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Scroll className="w-4 h-4 mr-2" />
                    {activity.participants}
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.status === 'Berlangsung' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'Persiapan' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Informasi Penting</h4>
          <p className="text-sm text-blue-800">
            Untuk informasi lebih lanjut tentang kegiatan sekolah, silakan hubungi bagian Tata Usaha.
          </p>
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedActivity && (
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
           <div className="relative mb-4 flex items-center justify-between">
            {/* Tombol Back (jika sedang edit) */}
            {isEditMode ? (
              <button
                onClick={() => setIsEditMode(false)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              <div /> // Spacer
            )}

            {/* Tombol X */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
            <div className="space-y-3 mb-6">
                {/* Judul */}
              <div className="mt-6">
                <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-1">Judul:</label>
                {isEditMode ? (
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 text-gray-600"
                    value={selectedActivity.title}
                    onChange={(e) =>
                      setSelectedActivity({ ...selectedActivity, title: e.target.value })
                    }
                  />
                ) : (
                  <h3 className="w-full border border-gray-300 rounded p-2 text-gray-600">{selectedActivity.title}</h3>
                )}
                </div>
              </div>
              <div>
                  <label className="block text-gray-600 text-sm">Deskripsi:</label>
                  {isEditMode ? (
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      rows="3"
                      value={selectedActivity.description}
                      onChange={(e) =>
                        setSelectedActivity({ ...selectedActivity, description: e.target.value })
                      }
                    />
                  ) : (
                    <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{selectedActivity.description || 'Tidak ada deskripsi'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm">Tanggal:</label>
                  {isEditMode ? (
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      value={selectedActivity.date.split('T')[0]}
                      onChange={(e) =>
                        setSelectedActivity({ ...selectedActivity, date: e.target.value })
                      }
                    />
                  ) : (
                    <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                      {new Date(selectedActivity.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm">Status:</label>
                  <select
                    value={selectedActivity.status}
                    onChange={(e) =>
                      setSelectedActivity({ ...selectedActivity, status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="Persiapan">Persiapan</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
            </div>
          <div className="flex justify-end space-x-3 mt-6">

             <button
              onClick={() => handleDeleteActivity(selectedActivity.id)}
              className="flex items-center px-4 py-2 text-white rounded bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={16} className="mr-2" /> Hapus
            </button>
            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center px-4 py-2 text-white rounded bg-blue-600 hover:bg-blue-700"
              >
                <Edit size={16} className="mr-2" /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdateActivity}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit size={16} className="mr-2" /> Simpan
                </button>
              </>
            )}
          </div>
          </div>
        )}
      </Modal>

      {/* Add Activity Modal */}
      <Modal
        isOpen={isAddModalOpen}
         onRequestClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false); 
        }}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Tambah Kegiatan Baru</h3>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Judul Kegiatan*</label>
              <input
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Deskripsi</label>
              <textarea
                value={newActivity.description}
                onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Tanggal*</label>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Status*</label>
              <select
                value={newActivity.status}
                onChange={(e) => setNewActivity({...newActivity, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="pending">Persiapan</option>
                <option value="in-progress">Berlangsung</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={handleAddActivity}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tambah Kegiatan
            </button>
          </div>
        </div>
      </Modal>

      {/* Add these styles to your CSS file or style tag */}
      <style jsx>{`
        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 0;
          border-radius: 8px;
          outline: none;
          width: 90%;
          max-width: 500px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default ActivityList;