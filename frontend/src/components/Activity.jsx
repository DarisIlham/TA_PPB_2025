import React, { useState, useEffect } from 'react';
import { Calendar, Users } from 'lucide-react';

const ActivityList = () => {
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/activities`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        
        // Transform data to match frontend structure
        const transformedActivities = data.map(activity => ({
          id: activity._id,
          title: activity.title,
          date: activity.date,
          status: translateStatus(activity.status),
          participants: "Semua Siswa" // Default value, can be modified
        }));
        
        setUpcomingActivities(transformedActivities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Helper function to translate status
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Persiapan',
      'in-progress': 'Berlangsung',
      'completed': 'Selesai'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <div className="text-center py-8">Memuat kegiatan...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Kegiatan Mendatang</h3>
            
            {upcomingActivities.length === 0 ? (
              <p className="text-gray-500">Tidak ada kegiatan yang akan datang</p>
            ) : (
              <div className="space-y-4">
                {upcomingActivities.map(activity => (
                  <div key={activity.id} className="border-l-4 border-blue-600 pl-4 py-3">
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
                        <Users className="w-4 h-4 mr-2" />
                        {activity.participants}
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          activity.status === 'Berlangsung' ? 'bg-green-100 text-green-800' :
                          activity.status === 'Persiapan' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
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
                Untuk informasi lebih lanjut tentang kegiatan sekolah, silakan hubungi bagian Tata Usaha atau kunjungi website resmi sekolah.
              </p>
            </div>
          </div>
        </div>
     
  );
};

export default ActivityList;