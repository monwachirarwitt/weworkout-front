import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore';

function MyActivities() {

  // 1. การตั้งค่า State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 2. ดึงข้อมูลจาก Zustand (กระเป๋าข้อมูลส่วนกลาง)
  const { token, user: currentUser } = useAuthStore();

  // 3. การดึงข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    // 🛡️ ระบบรปภ.: ถ้ายังไม่ Login ให้เตะไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyActivities = async () => {
      try {
        const response = await axios.get('/event', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 🧠 กรองเฉพาะ Event ที่เราเป็นเจ้าของ
        const allEvents = response.data.events || response.data || [];
        const myHostedEvents = allEvents.filter(event => event.hostId === currentUser?.id);

        setEvents(myHostedEvents);
      } catch (error) {
        console.error('Failed to load hosted activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyActivities();
  }, [navigate, token, currentUser?.id]);

  // ฟังก์ชันเลือกรูปหน้าปกตามหมวดหมู่กีฬา
  const getCoverImage = (category) => {
    const images = {
      'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
      'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop',
      'Running': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      'Fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 relative overflow-hidden font-body pb-20">

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16">

        {/* 📝 Header Section */}
        <div className="text-center md:text-left mb-12">
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-background mb-4 tracking-tight">
            Hosted <span className="text-primary">Activities</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl md:mx-0 mx-auto">
            Manage and track the sports events you have organized.
          </p>
        </div>

        {/* 🚀 ส่วนแสดงผลข้อมูล */}
        {loading ? (
          <div className="text-center py-20 text-on-surface-variant font-bold text-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            Loading your activities...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full">

            {/* ⚠️ กรณีไม่มีตี้ที่เราสร้างเลย */}
            {events.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant bg-white rounded-[2rem] border border-dashed border-gray-200">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">post_add</span>
                <p className="text-lg font-bold mb-1">You haven't hosted any activities yet.</p>
                <p className="text-sm text-gray-400">Start building your sports community today!</p>
                <button onClick={() => navigate('/create')} className="mt-6 bg-[#FF6B35] text-white font-bold py-2.5 px-8 rounded-full hover:scale-105 transition-all shadow-md">
                  Create First Activity
                </button>
              </div>
            ) : (
              // ✅ กรณีมีตี้: วนลูปโชว์การ์ดกิจกรรม
              events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="bg-white rounded-[1.25rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >

                  {/* รูปปก (ดึงจาก Data ที่ User อัปโหลด) */}
                  <div className="relative h-28 sm:h-36 overflow-hidden bg-gray-100">
                    {/* ⚠️ ตรง event.image ให้เช็กให้ตรงกับชื่อฟิลด์ใน Database ของคุณ */}
                    <img src={event.imgEvent || getCoverImage(event.category)} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-black text-primary uppercase tracking-wider shadow-sm">
                      {event.category || 'SPORT'}
                    </div>

                    <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[10px]">star</span> HOST
                    </div>
                  </div>

                  {/* เนื้อหาในการ์ด */}
                  <div className="p-2.5 md:p-4 flex flex-col flex-1">
                    <h3 className="font-headline font-black text-sm md:text-base text-gray-900 mb-1.5 truncate">{event.title}</h3>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-gray-500">
                        <span className="material-symbols-outlined text-[12px] md:text-[14px]">calendar_month</span>
                        {new Date(event.eventDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} • {event.startTime}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-gray-500 truncate">
                        <span className="material-symbols-outlined text-[12px] md:text-[14px]">location_on</span>
                        <span className="truncate">{event.locationName}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2.5 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] md:text-[11px] font-bold text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${new Date(event.eventDate) < new Date() ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                        {new Date(event.eventDate) < new Date() ? 'COMPLETED' : 'UPCOMING'}
                      </div>

                      <span className="text-[10px] md:text-[11px] font-black text-[#00A693] uppercase tracking-wider">
                        Manage
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyActivities;