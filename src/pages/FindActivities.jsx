import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as eventApi from '../api/eventApi';
import useAuthStore from '../store/authStore';

function FindActivities() {
  // --- 1. การตั้งค่า State ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // รายการ Filter Chips บนหน้าจอ
  const filters = ['All', 'Football', 'Fitness', 'Basketball', 'Running', 'Badminton', 'Tennis', 'Yoga'];

  // ดึง Token จาก Store มาใช้ยืนยันตัวตน
  const token = useAuthStore((state) => state.token);

  // --- 2. การดึงข้อมูล (Side Effects) ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await eventApi.getEvents();
        const eventData = response.data.events || response.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error('❌ โหลดข้อมูลตี้ไม่สำเร็จ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate, token]);

  // --- 3. Logic การกรองข้อมูล (แก้ไขให้รองรับกีฬาที่พิมพ์เองแบบไดนามิก) ---
  const filteredEvents = events.filter((event) => {
    // เงื่อนไขที่ 1: กรองตาม Tab (ถ้าเลือก 'All' จะให้ผ่านทันทีโดยไม่สนว่าชื่อหมวดหมู่คืออะไร)
    const matchTab = activeFilter === 'All' ||
      (event.category && event.category.toLowerCase() === activeFilter.toLowerCase());

    // เงื่อนไขที่ 2: กรองตามคำค้นหาใน Search Bar (พิมพ์เล็ก/ใหญ่มีค่าเท่ากัน)
    const searchTerm = searchQuery.toLowerCase().trim();

    const matchSearch =
      searchTerm === '' ||
      (event.category && event.category.toLowerCase().includes(searchTerm)) ||
      (event.title && event.title.toLowerCase().includes(searchTerm)) ||
      (event.locationName && event.locationName.toLowerCase().includes(searchTerm));

    // ข้อมูลต้องผ่านทั้งตัวกรองแท็บ และคำค้นหาใน Search Bar
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-body pb-28">
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6">

        {/* --- Search Bar --- */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-gray-400 text-xl">search</span>
            <input
              type="text"
              placeholder="Search activities, sports, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-gray-700"
            />
          </div>
        </div>

        {/* --- Filter Chips --- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === filter
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
                <p className="text-gray-500 text-lg font-bold">ไม่พบกิจกรรมที่ค้นหา</p>
              </div>
            )}

            {/* วนลูปแสดงรายการกิจกรรม */}
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-white rounded-[1.25rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* ส่วนรูปปก */}
                <div className="relative h-28 sm:h-36 overflow-hidden bg-gray-100">
                  <img
                    src={event.imgEvent || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'}
                    alt={event.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* ส่วนรายละเอียดกิจกรรม */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="font-headline font-black text-sm text-gray-900 mb-3 line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-2 mb-3">
                    {/* วันที่ */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                      <span className="material-symbols-outlined text-[13px] text-[#004D40]">calendar_today</span>
                      {new Date(event.eventDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>

                    {/* เวลา */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                      <span className="material-symbols-outlined text-[13px] text-[#004D40]">schedule</span>
                      {event.startTime}
                    </div>

                    {/* สถานที่ */}
                    <div
                      onClick={(e) => {
                        if (event.locationUrl) {
                          e.stopPropagation();
                          window.open(event.locationUrl, '_blank');
                        }
                      }}
                      className={`flex items-start gap-1.5 text-[11px] font-medium text-gray-500 ${event.locationUrl ? 'hover:text-[#FF6B35] active:scale-95 transition-all' : ''}`}
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#FF6B35] shrink-0">location_on</span>
                      <span className="line-clamp-1 flex-1">
                        {event.locationName || "ไม่ได้ระบุสถานที่"}
                      </span>
                      {event.locationUrl && (
                        <span className="material-symbols-outlined text-[12px] text-gray-400">open_in_new</span>
                      )}
                    </div>

                    {/* หมวดหมูกิจกรรม */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                      <span className="material-symbols-outlined text-[13px] text-[#004D40]">category</span>
                      {event.category}
                    </div>
                  </div>

                  {/* ส่วนท้าย: จำนวนคน */}
                  <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#004D40]">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {event._count?.participants || 0}/{event.maxParticipants}
                    </div>
                    <span className="text-[10px] font-black text-[#00A693] tracking-wider uppercase bg-[#00A693]/10 px-2 py-1 rounded-md">
                      Details
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
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