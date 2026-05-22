import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; 

function MyActivities() {
 
  // 1. การตั้งค่า State
  const [events, setEvents] = useState([]);      // เก็บรายการกิจกรรมที่เราเป็นคนสร้าง
  const [loading, setLoading] = useState(true);  // สถานะการรอข้อมูลจาก Backend
  const navigate = useNavigate();
  
  // 2. ดึงข้อมูลจาก Zustand (กระเป๋าข้อมูลส่วนกลาง)
  const { token, user: currentUser } = useAuthStore();

  // 3. การดึงข้อมูลเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    // 🛡️ ระบบรปภ.: ถ้ายังไม่ Login (ไม่มี Token) ให้เตะไปหน้า Login ทันที
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyActivities = async () => {
      try {
        // ยิง API ไปขอรายการ Event ทั้งหมด (พร้อมแนบ Token เพื่อยืนยันตัวตน)
        const response = await axios.get('/event', { 
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // 🧠 ลอจิกหัวใจสำคัญ: กรองเฉพาะ Event ที่ hostId ตรงกับ id ของเราเท่านั้น
        // เพื่อให้หน้าจอนี้แสดงแค่ "ตี้ที่เราเป็นเจ้าของ" อย่างเดียวตามที่คุณมลต้องการ
        const allEvents = response.data.events || response.data || [];
        const myHostedEvents = allEvents.filter(event => event.hostId === currentUser?.id);
        
        setEvents(myHostedEvents); 
      } catch (error) {
        console.error('Failed to load hosted activities:', error);
      } finally {
        setLoading(false); // ปิดหน้าจอโหลดดิ้ง
      }
    };
    
    fetchMyActivities(); 
  }, [navigate, token, currentUser?.id]); 

  // 4. ฟังก์ชันจัดการรูปหน้าปกแบบ Dynamic
  const getCoverImage = (category) => {
    switch(category) {
      case 'Football': return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop';
      case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop';
      case 'Running': return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop';
      case 'Fitness': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 relative overflow-hidden font-body pb-20">
      
      {/* 🎨 ส่วนตกแต่งพื้นหลัง (Floating Cards) */}
      <div className="absolute top-10 -left-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[-15deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop" alt="Running" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-20 -right-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[12deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" alt="Basketball" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        
        {/* 📝 Header Section: ปรับคำโปรยให้ชัดเจนว่าเป็นงานที่เราสร้าง */}
        <div className="text-center mb-12">
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-background mb-4 tracking-tight">
            Hosted <span className="text-primary">Activities</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            
            {/* ⚠️ กรณีไม่มีตี้ที่เราสร้างเลย: แสดงปุ่มชวนไปสร้างตี้ใหม่ */}
            {events.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant bg-surface-container-lowest/50 rounded-[2rem] border border-dashed border-outline-variant/50">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">post_add</span>
                <p className="text-lg font-bold mb-2">You haven't hosted any activities yet.</p>
                <p className="text-sm">Start building your sports community today!</p>
                <button onClick={() => navigate('/create')} className="mt-6 bg-primary text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-all shadow-md">
                  Create First Activity
                </button>
              </div>
            ) : (
              // ✅ กรณีมีตี้: วนลูปโชว์การ์ดกิจกรรม
              events.map((event) => (
                <div key={event.id} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                  
                  <div className="relative h-48 overflow-hidden">
                    <img src={getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* Badge ประเภทกีฬา */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-sm">
                      {event.category || 'SPORT'}
                    </div>

                    {/* สติกเกอร์ HOST ติดตัวโตๆ */}
                    <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">star</span> HOST
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-headline font-black text-xl text-on-background mb-3 line-clamp-1">{event.title}</h3>
                    
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

                    <p className="text-sm text-on-surface-variant/80 line-clamp-2 mb-6 flex-1 italic">
                      "{event.description}"
                    </p>

                    <div className="border-t border-outline-variant/20 pt-4 flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider">Event Status</span>
                        <span className="font-bold text-secondary">
                          {new Date(event.eventDate) < new Date() ? 'Completed ✅' : 'Upcoming ⏳'}
                        </span>
                      </div>
                      {/* ปุ่ม Manage เพื่อเข้าไปรับคนหรือลบตี้ */}
                      <button 
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="bg-surface-container-low text-primary border border-primary/20 font-bold py-2 px-5 rounded-full hover:bg-primary hover:text-white transition-all"
                      >
                        Manage
                      </button>
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