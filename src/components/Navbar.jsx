import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token, logout } = useAuthStore();

  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const displayName = user?.name || 'Athletic User';
  const profileImageUrl = user?.profileImageUrl || '';

  return (
    // 🌟 1. ตัวครอบ (Wrapper): ดันลงมาจากขอบจอบน (top-4) และเว้นขอบซ้ายขวา (px-4)
    <div className=" sticky top-4 z-50 px-4 flex justify-center w-full max-w-7xl mx-auto shrink-0 pointer-events-none">

      {/* 🌟 2. ตัว Navbar: เปลี่ยนเป็นทรงแคปซูล (rounded-full) เพิ่มเงา (shadow-lg) และเอฟเฟกต์กระจก (backdrop-blur-lg) */}
      <nav className="pointer-events-auto bg-surface-container-lowest/80 backdrop-blur-lg border border-outline-variant/30 rounded-full shadow-lg shadow-gray-200/20 px-6 h-[60px] flex items-center justify-center min-w-[240px] transition-all duration-300">

        <Link to="/" className="flex items-center gap-2.5 group">
          {/* 🌟 3. กรอบโลโก้: ปรับให้มนกลมกลืนไปกับ Navbar (rounded-full) */}
          <div className="bg-primary p-2 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px] md:text-[24px]">fitness_center</span>
          </div>
          <span className="font-headline font-black text-xl md:text-2xl text-primary-container tracking-tight">
            WeWorkout
          </span>
        </Link>

      </nav>

    </div>
  );
}

export default Navbar;