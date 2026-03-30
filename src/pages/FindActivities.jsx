import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store ของเรามาใช้

function FindActivities() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 💥 2. ดึง token ออกมาจาก Store โดยตรง
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // 💥 3. ถ้าไม่มี Token ก็เตะไปหน้า Login เลย
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/event', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(response.data.events || []); 
      } catch (error) {
        console.error('โหลดข้อมูลตี้ไม่สำเร็จ:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [navigate, token]); // ทำงานใหม่เมื่อ token หรือ navigate เปลี่ยน

  const getCoverImage = (category) => {
    switch(category) {
      case 'Football': return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop';
      case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop';
      case 'Running': return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop';
      case 'Badminton': return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 relative overflow-hidden font-body pb-20">
      
      {/* สติกเกอร์ 4 มุม */}
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
        
        <div className="text-center mb-16">
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-background mb-4 tracking-tight">
            Find Your Next <span className="text-primary">Workout</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto">
            Connecting urban athletes to move together. Discover community-led sessions near you.
          </p>

          {/* แถบ Search / Filter */}
          <div className="mt-10 bg-surface-container-lowest p-2 rounded-full shadow-lg border border-outline-variant/20 flex flex-col md:flex-row items-center max-w-4xl mx-auto gap-2">
            <div className="flex items-center flex-1 w-full px-4 py-2 text-on-surface-variant">
              <span className="material-symbols-outlined mr-3">search</span>
              <input type="text" placeholder="Search (e.g. Lumphini Park)" className="w-full bg-transparent outline-none text-on-background" />
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
            <div className="flex items-center flex-1 w-full px-4 py-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined mr-3 text-primary">directions_run</span>
              <span className="flex-1 text-left font-medium">Sport Type</span>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
            <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
            <div className="flex items-center flex-1 w-full px-4 py-2 text-on-surface-variant cursor-pointer">
              <span className="material-symbols-outlined mr-3 text-primary">calendar_today</span>
              <span className="flex-1 text-left font-medium">Select Date</span>
            </div>
            <button className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-container transition-colors shadow-md">
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-on-surface-variant font-bold text-xl flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
            กำลังโหลดตี้สุดมันส์...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* โชว์ข้อความถ้าไม่มีตี้ */}
            {events.length === 0 && !loading && (
              <p className="col-span-full text-center text-on-surface-variant text-lg">ยังไม่มีตี้เลย ไปสร้างตี้กันเถอะ!</p>
            )}

            {/* วนลูปโชว์การ์ดตี้ */}
            {events.map((event) => (
              <div key={event.id} className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col hover:-translate-y-2 transition-transform duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-primary uppercase tracking-wider shadow-sm">
                    {event.category || 'SPORT'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-headline font-black text-xl text-on-background mb-3 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {event.host?.name?.charAt(0) || 'H'}
                      </div>
                      <span className="text-sm font-medium text-on-surface-variant">{event.host?.name || 'Unknown Host'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary font-bold text-sm">
                      <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                      <span>4.8/5</span> 
                    </div>
                  </div>
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
                      <span className="text-xs font-bold text-outline uppercase tracking-wider">Availability</span>
                      <span className="font-bold text-primary">{event._count?.participants || 0}/{event.maxParticipants} Joined</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="bg-secondary text-white font-bold py-2 px-5 rounded-full hover:bg-[#E65C2F] active:scale-95 transition-all shadow-md shadow-secondary/20"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ปุ่ม Load More */}
        {!loading && events.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="bg-surface-container-lowest text-primary font-bold py-3 px-8 rounded-full border-2 border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm">
              Load More Activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindActivities;