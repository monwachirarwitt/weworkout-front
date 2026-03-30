import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../config/axios'; // เรียกใช้ axios ที่เราเซ็ต Interceptor ไว้แล้ว

export default function Home() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลแบบคู่ขนาน (User Profile + Events)
    const fetchHomeData = async () => {
      try {
        const [userRes, eventRes] = await Promise.all([
          axios.get('/auth/me').catch(() => ({ data: null })), // ดึงข้อมูลโปรไฟล์
          axios.get('/event') // ดึงตี้กีฬา
        ]);
        
        if (userRes.data) setUser(userRes.data);
        if (eventRes.data?.events) setEvents(eventRes.data.events);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-surface font-body text-on-surface overflow-x-hidden">
      
      {/* 🟢 Hero Section */}
      <section className="relative min-h-[870px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-secondary-container/10"></div>
          <img 
            className="w-full h-full object-cover mix-blend-overlay opacity-40" 
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
          />
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 tracking-wide uppercase">Community Driven Performance</span>
            <h1 className="text-7xl md:text-8xl font-black font-headline text-on-background tracking-tighter leading-[0.9] mb-8">
              Move Together,<br/><span className="text-primary">Train Smarter.</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-medium max-w-xl mb-10 leading-relaxed">
              Your sanctuary for community-driven sports and wellness tracking. Connect with athletes, find activities, and reach your peak.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/find-activities" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg ambient-shadow hover:scale-105 transition-transform flex items-center gap-2">
                Start Exploring <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] bottom-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      </section>

      {/* 🟢 Wellness Deep-Dive Section (ดึงข้อมูล BMI จริงมาแสดงถ้ามี) */}
      <section className="py-24 bg-surface-container-low">
        <div className="container mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-black font-headline text-on-background mb-2">The Kinetic Dashboard</h2>
            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* BMI Card */}
              <div className="bg-surface-container-lowest p-8 rounded-[2rem] ambient-shadow flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="p-3 bg-primary/10 rounded-2xl text-primary material-symbols-outlined">monitor_weight</span>
                  </div>
                  <h3 className="text-on-surface-variant font-bold text-lg mb-1">Body Mass Index</h3>
                  <p className="text-4xl font-black font-headline text-on-surface">
                    {user?.bmi ? user.bmi : "--"} 
                  </p>
                </div>
              </div>

              {/* BMR Card (Hardcode ไว้ก่อน หรือจะคำนวณทีหลังก็ได้) */}
              <div className="bg-surface-container-lowest p-8 rounded-[2rem] ambient-shadow flex flex-col justify-between hover:translate-y-[-4px] transition-transform">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="p-3 bg-secondary/10 rounded-2xl text-secondary material-symbols-outlined">local_fire_department</span>
                  </div>
                  <h3 className="text-on-surface-variant font-bold text-lg mb-1">Daily Energy Expenditure</h3>
                  <p className="text-4xl font-black font-headline text-on-surface">2,100 <span className="text-xl font-medium">kcal</span></p>
                </div>
              </div>

            </div>

            {/* Bio & Medical Notes */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-gradient-to-br from-inverse-surface to-[#071e27] p-8 rounded-[2rem] text-white flex-1 ambient-shadow relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black font-headline mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span> Clinical Profile
                  </h3>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <p className="text-primary-fixed-dim text-sm font-bold uppercase tracking-widest">Medical Notes</p>
                      <p className="text-xl leading-relaxed font-medium">
                        {user?.medicalNotes || "ยังไม่มีข้อมูลทางการแพทย์"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-primary-fixed-dim text-sm font-bold uppercase tracking-widest">Bio</p>
                      <p className="text-xl leading-relaxed">
                        {user?.bio || "เล่าเรื่องราวของคุณให้เพื่อนๆ ฟังหน่อยสิ!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 Activity Discovery Section (ดึงข้อมูลจาก API วนลูปสร้างการ์ด) */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black font-headline text-on-background mb-4">Find Your Next Pulse</h2>
              <p className="text-on-surface-variant text-lg">Discover curated local activities and join athletes who share your drive.</p>
            </div>
          </div>

          {/* ตารางโชว์กิจกรรม (โชว์แค่ 6 งานล่าสุด) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.slice(0, 6).map((event) => (
                <div key={event.id} className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden ambient-shadow hover:translate-y-[-8px] transition-all duration-300">
                  <div className="relative h-64 bg-gray-200">
                    <img className="w-full h-full object-cover" src={event.imgEvent || "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"} alt={event.title} />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                         {event.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-black font-headline text-on-surface mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-6">
                      <span className="material-symbols-outlined text-base">person</span>
                      <span>Hosted by <span className="text-primary font-bold">{event.host?.name}</span></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">schedule</span>
                        <span className="text-xs font-bold text-on-surface-variant">{event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <span className="text-xs font-bold text-on-surface-variant truncate">{event.locationName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">group</span>
                        <span className="text-xs font-bold text-on-surface-variant">
                          {event._count?.participants || 0} / {event.maxParticipants} spots
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/event/${event.id}`}>
                      <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-secondary to-secondary-container text-white font-black font-headline uppercase tracking-wider hover:shadow-lg transition-all active:scale-95">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-10">ยังไม่มีกิจกรรมในตอนนี้ ลองสร้างตี้ของคุณเองดูสิ!</p>
            )}
          </div>

          <div className="mt-20 flex justify-center">
            <Link to="/find-activities">
              <button className="px-12 py-5 rounded-full bg-surface-container-low text-primary font-bold text-lg ambient-shadow border border-primary/10 hover:bg-primary/5 transition-all flex items-center gap-3">
                Discover More Activities <span className="material-symbols-outlined">explore</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 🟢 Footer */}
      <footer className="bg-[#e6f6ff] w-full rounded-t-[2rem] mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 w-full font-manrope text-sm">
          <div className="mb-6 md:mb-0">
            <span className="font-headline font-bold text-2xl text-primary">WeWorkout</span>
            <p className="mt-2 text-on-surface-variant max-w-xs">Building the world's most vibrant sanctuary for athletic community and wellness.</p>
          </div>
          <div className="text-right">
            <p className="text-on-surface-variant mb-2 font-medium">© 2026 WeWorkout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}