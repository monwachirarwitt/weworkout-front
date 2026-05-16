import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; 

function FindActivities() {
  // --- 1. การตั้งค่า State ---
  const [events, setEvents] = useState([]);      // เก็บรายการกิจกรรมทั้งหมดจากหลังบ้าน
  const [loading, setLoading] = useState(true);  // สถานะการโหลดข้อมูล (หมุนๆ)
  const navigate = useNavigate();
  
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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 relative overflow-hidden font-body pb-20">
      
      {/* 🎨 ส่วนตกแต่งพื้นหลัง (Stickers) */}
      <div className="absolute top-10 -left-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[-15deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop" alt="Running" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-20 -right-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[12deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" alt="Basketball" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        
        {/* --- Header Section (ลบส่วน Search ออกแล้ว) --- */}
        <div className="text-center mb-16">
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-background mb-4 tracking-tight">
            Find Your Next <span className="text-primary">Workout</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto italic">
            "Connecting urban athletes to move together. Discover community-led sessions near you."
          </p>
        </div>

        {/* --- ส่วนแสดงผลหลัก --- */}
        {loading ? (
          // สถานะกำลังโหลดข้อมูล
          <div className="text-center py-20 text-on-surface-variant font-bold text-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            กำลังรวบรวมตี้สุดมันส์ให้คุณ...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* กรณีไม่มีข้อมูลกิจกรรมเลย */}
            {events.length === 0 && (
              <div className="col-span-full text-center py-20">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">sentiment_dissatisfied</span>
                <p className="text-on-surface-variant text-xl font-bold">ยังไม่มีตี้เปิดใหม่ในขณะนี้</p>
                <button onClick={() => navigate('/create')} className="mt-4 text-primary font-bold hover:underline">ไปเริ่มสร้างตี้กันเถอะ! 🚀</button>
              </div>
            )}

            {/* วนลูปแสดงรายการกิจกรรม (Event Cards) */}
            {events.map((event) => (
              <div key={event.id} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                
                {/* ส่วนรูปปกและ Badge */}
                <div className="relative h-48 overflow-hidden">
                  <img src={getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-sm">
                    {event.category || 'SPORT'}
                  </div>
                </div>

                {/* ส่วนรายละเอียดกิจกรรม */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-headline font-black text-xl text-on-background mb-3 line-clamp-1">{event.title}</h3>
                  
                  {/* ข้อมูล Host */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {event.host?.name?.charAt(0) || 'H'}
                      </div>
                      <span className="text-sm font-medium text-on-surface-variant">{event.host?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary font-bold text-sm">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span>4.8</span> 
                    </div>
                  </div>

                  {/* วันเวลาและสถานที่ */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
                      {new Date(event.eventDate).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })} • {event.startTime}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-on-surface-variant font-medium">
                      <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                      <span className="line-clamp-1">{event.locationName}</span>
                    </div>
                  </div>

                  {/* คำอธิบายสั้นๆ */}
                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 mb-6 flex-1 italic">
                    "{event.description}"
                  </p>

                  {/* ปุ่มกดดูรายละเอียด */}
                  <div className="border-t border-outline-variant/20 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-outline uppercase tracking-wider">Availability</span>
                      <span className="font-bold text-primary">{event._count?.participants || 0}/{event.maxParticipants} Joined</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="bg-secondary text-white font-bold py-2.5 px-6 rounded-full hover:bg-[#E65C2F] active:scale-95 transition-all shadow-md shadow-secondary/20"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ปุ่มโหลดเพิ่ม (ถ้ามีข้อมูลเยอะ) */}
        {!loading && events.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="bg-surface-container-lowest text-primary font-bold py-3 px-10 rounded-full border-2 border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
              Explore More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindActivities;