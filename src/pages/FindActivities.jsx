import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; 

function FindActivities() {
  // --- 1. การตั้งค่า State ---
  const [events, setEvents] = useState([]);      
  const [loading, setLoading] = useState(true);  
  const [activeFilter, setActiveFilter] = useState('All'); // เก็บสถานะตัวกรอง (หมวดหมู่)
  const navigate = useNavigate();
  
  const filters = ['All', 'Football', 'Fitness', 'Basketball', 'Running']; // รายการ Filter Chips

  // ดึง Token จาก Store มาใช้ยืนยันตัวตน
  const token = useAuthStore((state) => state.token);

  // --- 2. การดึงข้อมูล (Side Effects) ---
  useEffect(() => {
    // 🛡️ เช็คความปลอดภัย: ถ้าไม่มี Token ให้ส่งกลับไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/event', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // เก็บข้อมูลที่ได้ลงใน State (รองรับทั้งรูปแบบ Object และ Array)
        const eventData = response.data.events || response.data || [];
        setEvents(eventData); 
      } catch (error) {
        console.error('❌ โหลดข้อมูลตี้ไม่สำเร็จ:', error);
      } finally {
        setLoading(false); // ปิดสถานะการโหลด
      }
    };
    
    fetchEvents();
  }, [navigate, token]);

  // --- 3. ฟังก์ชันตัวช่วย (Helper Functions) ---
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

  // ตัวแปรเก็บกิจกรรมที่ผ่านการกรองแล้ว
  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(e => e.category === activeFilter);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] relative overflow-hidden font-body pb-28">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6">
        
        {/* --- Search Bar & Filter Button --- */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-gray-400 text-xl">search</span>
            <input 
              type="text" 
              placeholder="Search activities..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-gray-700"
            />
          </div>
          <button className="bg-[#004D40] text-white p-3 rounded-2xl shadow-sm hover:bg-[#00332A] transition-colors shrink-0">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* --- Filter Chips --- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {filters.map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-[#004D40] text-white shadow-md shadow-[#004D40]/20' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* --- ส่วนแสดงผลหลัก --- */}
        {loading ? (
          // สถานะกำลังโหลดข้อมูล
          <div className="text-center py-20 text-on-surface-variant font-bold text-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            กำลังรวบรวมตี้สุดมันส์ให้คุณ...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 w-full">
            
            {/* กรณีไม่มีข้อมูลกิจกรรมเลย */}
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">search_off</span>
                <p className="text-gray-500 text-lg font-bold">ไม่พบกิจกรรมในหมวดหมู่นี้</p>
              </div>
            )}

            {/* วนลูปแสดงรายการกิจกรรม (Compact Event Cards) */}
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-white rounded-[1.25rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                
                {/* ส่วนรูปปก */}
                <div className="relative h-28 sm:h-36 overflow-hidden bg-gray-100">
                  <img src={getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Badge ไฟลุก */}
                  <div className="absolute top-2 right-2 bg-[#FF6B35]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[10px]">local_fire_department</span> Trending
                  </div>
                </div>

                {/* ส่วนรายละเอียดกิจกรรม */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-headline font-black text-sm text-gray-900 mb-1 line-clamp-1">{event.title}</h3>
                  
                  {/* วันและเวลา */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-4">
                    <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                    {new Date(event.eventDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} • {event.startTime}
                  </div>

                  {/* ส่วนท้าย: จำนวนคน + ปุ่ม Details */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#004D40]">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {event._count?.participants || 0}/{event.maxParticipants}
                    </div>
                    <span className="text-[10px] font-black text-[#00A693] tracking-wider uppercase">Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) สำหรับสร้างกิจกรรม */}
      <button 
        onClick={() => navigate('/create')}
        className="fixed bottom-24 right-4 md:right-8 bg-[#FF6B35] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#FF6B35]/30 hover:scale-110 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

    </div>
  );
}

export default FindActivities;