import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function MyActivities() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'hosted', 'joined'
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // ดึงข้อมูล User ปัจจุบันจาก Token เพื่อเอาไว้เช็กว่าเราเป็น Host หรือเปล่า
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // แกะ Token หา ID ตัวเอง
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload);
    } catch (e) {
      console.error("แกะ Token ไม่สำเร็จ");
    }

    const fetchMyActivities = async () => {
      try {
        // 💥 หมายเหตุ: เปลี่ยน Path API ตรงนี้ให้ตรงกับหลังบ้านของคุณมลนะครับ
        // สมมติว่าสร้าง Route ดึงเฉพาะกิจกรรมของตัวเองไว้ที่ /event/my-events
        const response = await axios.get('/event', { // ชั่วคราวใช้ /event ไปก่อน
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // สมมติว่าดึงมาหมดก่อน เดี๋ยวเรามาใช้ Filter กรองเอาหน้าบ้าน
        setEvents(response.data.events || response.data || []); 
      } catch (error) {
        console.error('โหลดข้อมูลกิจกรรมไม่สำเร็จ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyActivities();
  }, [navigate, token]);

  const getCoverImage = (category) => {
    switch(category) {
      case 'Football': return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop';
      case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop';
      case 'Running': return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop';
      case 'Badminton': return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
    }
  };

  // 🧠 Logic กรองข้อมูล: แบ่งตี้ที่สร้างเอง กับ ตี้ที่ไปแจม
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    
    // ถ้าเลือก tab 'hosted' ให้โชว์เฉพาะที่เราเป็นคนสร้าง
    if (filter === 'hosted') return event.hostId === currentUser?.id;
    
    // ถ้าเลือก tab 'joined' ให้โชว์ที่เราเป็นแค่ลูกตี้ (เช็กจาก participants)
    if (filter === 'joined') {
      return event.participants?.some(p => p.userId === currentUser?.id) && event.hostId !== currentUser?.id;
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 relative overflow-hidden font-body pb-20">
      
      {/* สติกเกอร์ 4 มุม (จางๆ หล่อๆ) */}
      <div className="absolute top-10 -left-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[-15deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop" alt="Running" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-20 -right-10 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[12deg] opacity-50 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" alt="Basketball" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-20 -left-10 w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden rotate-[10deg] opacity-40 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[3px]">
        <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop" alt="Football" className="w-full h-full object-cover" />
      </div>
      <div className="absolute -bottom-10 right-10 w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden rotate-[-20deg] opacity-40 shadow-2xl pointer-events-none hidden lg:block border-4 border-white/50 blur-[2px]">
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop" alt="Fitness" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-background mb-4 tracking-tight">
            My <span className="text-primary">Activities</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto">
            ประวัติการลุยตี้ของคุณ ทั้งตี้ที่สร้างและตี้ที่ไปแจมเพื่อนๆ
          </p>
        </div>

        {/* 🗂️ ระบบ Tabs กรองข้อมูล */}
        <div className="flex justify-center mb-12">
          <div className="bg-surface-container-lowest p-1.5 rounded-full shadow-sm border border-outline-variant/20 inline-flex gap-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setFilter('hosted')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${filter === 'hosted' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              👑 ตี้ที่ฉันสร้าง
            </button>
            <button 
              onClick={() => setFilter('joined')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${filter === 'joined' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              🏃‍♂️ ตี้ที่ไปแจม
            </button>
          </div>
        </div>

        {/* โซนแสดง Card กิจกรรม */}
        {loading ? (
          <div className="text-center py-20 text-on-surface-variant font-bold text-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length === 0 && !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-on-surface-variant bg-surface-container-lowest/50 rounded-[2rem] border border-dashed border-outline-variant/50">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">sports_score</span>
                <p className="text-lg font-bold mb-2">ยังไม่มีกิจกรรมในหมวดหมู่นี้เลย</p>
                <p className="text-sm">ลองไปหาตี้ใหม่ๆ หรือสร้างตี้ของตัวเองดูสิ!</p>
                <button onClick={() => navigate('/activities')} className="mt-6 bg-primary/10 text-primary font-bold py-2 px-6 rounded-full hover:bg-primary hover:text-white transition-all">
                  ไปหาตี้กัน!
                </button>
              </div>
            )}

            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                
                {/* ปกการ์ด + ป้ายบอกสถานะ */}
                <div className="relative h-48 overflow-hidden">
                  <img src={getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* ป้ายมุมซ้ายบน: ชนิดกีฬา */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-sm">
                    {event.category || 'SPORT'}
                  </div>

                  {/* ป้ายมุมขวาบน: บทบาทของเรา (Host หรือ Joined) */}
                  {event.hostId === currentUser?.id ? (
                    <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">star</span> HOST
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> JOINED
                    </div>
                  )}
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

                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 mb-6 flex-1">
                    {event.description}
                  </p>

                  <div className="border-t border-outline-variant/20 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-outline uppercase tracking-wider">Status</span>
                      <span className="font-bold text-secondary">
                        {/* สมมติเช็กเวลาว่าเตะไปยัง ถ้าเตะแล้วขึ้น Completed */}
                        {new Date(event.eventDate) < new Date() ? 'Completed ✅' : 'Upcoming ⏳'}
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="bg-surface-container-low text-primary border border-primary/20 font-bold py-2 px-5 rounded-full hover:bg-primary hover:text-white transition-all"
                    >
                      Manage
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyActivities;