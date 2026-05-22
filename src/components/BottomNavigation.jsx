import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function BottomNavigation() {
  const location = useLocation();
  const { token } = useAuthStore();

  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  // เพิ่มเงื่อนไขให้หน้าแรก (/) มองว่าเป็นหน้า Find ด้วย
  const isActive = (path) => location.pathname === path || (path === '/activities' && location.pathname === '/');

  return (
    // 🌟 1. Wrapper: ดันลอยขึ้นมาจากขอบล่าง (bottom-6) และเว้นระยะขอบซ้าย-ขวา
    <div className="fixed bottom-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">

      {/* 🌟 2. Nav Container: ทรงแคปซูล (rounded-[2rem]), กระจกฝ้า (backdrop-blur-xl), และเงาฟุ้งๆ */}
      <nav className="pointer-events-auto w-full max-w-md bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/30 shadow-2xl shadow-gray-400/20 rounded-[2rem] p-1.5 transition-all duration-300">
        <div className="flex justify-around items-center h-14">

          {/* 🔘 เมนู Find (เปลี่ยนไอคอนเป็นแว่นขยายให้ตรงกับความหมาย Find) */}
          <Link to="/activities" className="flex flex-col items-center justify-center w-full h-full group">
            <div className={`flex flex-col items-center justify-center w-[4.5rem] h-12 rounded-2xl transition-all duration-300 ${isActive('/activities') ? 'bg-primary/15 text-primary scale-105' : 'text-on-surface-variant group-hover:text-primary group-hover:bg-primary/5'}`}>
              <span className="material-symbols-outlined text-[24px] mb-0.5">{isActive('/activities') ? 'search' : 'search'}</span>
              <span className="text-[10px] font-bold tracking-wide">Find</span>
            </div>
          </Link>

          {/* 🔘 เมนู Create */}
          <Link to="/create" className="flex flex-col items-center justify-center w-full h-full group">
            <div className={`flex flex-col items-center justify-center w-[4.5rem] h-12 rounded-2xl transition-all duration-300 ${isActive('/create') ? 'bg-primary/15 text-primary scale-105' : 'text-on-surface-variant group-hover:text-primary group-hover:bg-primary/5'}`}>
              <span className="material-symbols-outlined text-[24px] mb-0.5">{isActive('/create') ? 'add_circle' : 'add_circle'}</span>
              <span className="text-[10px] font-bold tracking-wide">Create</span>
            </div>
          </Link>

          {/* 🔘 เมนู My Events */}
          <Link to="/my-activities" className="flex flex-col items-center justify-center w-full h-full group">
            <div className={`flex flex-col items-center justify-center w-[4.5rem] h-12 rounded-2xl transition-all duration-300 ${isActive('/my-activities') ? 'bg-primary/15 text-primary scale-105' : 'text-on-surface-variant group-hover:text-primary group-hover:bg-primary/5'}`}>
              <span className="material-symbols-outlined text-[24px] mb-0.5">{isActive('/my-activities') ? 'event_available' : 'event_available'}</span>
              <span className="text-[10px] font-bold tracking-wide">Events</span>
            </div>
          </Link>

          {/* 🔘 เมนู Profile */}
          <Link to="/profile" className="flex flex-col items-center justify-center w-full h-full group">
            <div className={`flex flex-col items-center justify-center w-[4.5rem] h-12 rounded-2xl transition-all duration-300 ${isActive('/profile') ? 'bg-primary/15 text-primary scale-105' : 'text-on-surface-variant group-hover:text-primary group-hover:bg-primary/5'}`}>
              <span className="material-symbols-outlined text-[24px] mb-0.5">{isActive('/profile') ? 'person' : 'person'}</span>
              <span className="text-[10px] font-bold tracking-wide">Profile</span>
            </div>
          </Link>

        </div>
      </nav>
    </div>
  );
}

export default BottomNavigation;
