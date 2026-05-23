import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token, logout } = useAuthStore();

  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const displayName = user?.name || 'Athletic User';
  const profileImageUrl = user?.profileImageUrl || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sticky top-4 z-50 px-4 flex justify-center w-full max-w-7xl mx-auto shrink-0 pointer-events-none">

      {/* 💥 ปรับความสูง (h) และระยะขอบซ้ายขวา (px) ให้กระชับขึ้นบนจอมือถือ */}
      <nav className="pointer-events-auto w-full max-w-4xl bg-surface-container-lowest/80 backdrop-blur-lg border border-outline-variant/30 rounded-full shadow-lg shadow-gray-200/20 px-4 md:px-6 h-[56px] md:h-[64px] flex items-center justify-between transition-all duration-300">

        {/* --- โซนซ้าย: Logo --- */}
        <Link to="/" className="flex items-center gap-2 md:gap-2.5 group">
          <div className="bg-primary p-1.5 md:p-2 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px] md:text-[24px]">fitness_center</span>
          </div>
          {/* 💥 เอาคลาส hidden ออก! ให้มือถือเห็นคำว่า WeWorkout ด้วย แต่ปรับฟอนต์เป็น text-lg */}
          <span className="font-headline font-black text-lg md:text-2xl text-primary-container tracking-tight">
            WeWorkout
          </span>
        </Link>

        {/* --- โซนขวา: Profile & Logout --- */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* 💥 ปุ่ม Logout ปรับให้พอดีนิ้วกดบนมือถือ */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-300 shadow-sm"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">logout</span>
          </button>

        </div>

      </nav>

    </div>
  );
}

export default Navbar;