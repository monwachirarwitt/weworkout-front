import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const [user, setUser] = useState({ name: 'Guest', role: 'Member' });

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: payload.name || 'Athletic User',
          role: 'Pro Runner' 
        });
      } catch (e) {
        console.error("แกะ Token ไม่สำเร็จ");
      }
    }
  }, [token]);

  // 💥 ไฮไลท์ 1: เพิ่ม /register เข้าไป เผื่อเวลาหน้าสมัครจะได้ไม่มี Navbar มากวนใจ
  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 h-20 flex items-center justify-between">
        
        {/* โซนที่ 1: โลโก้ */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-xl md:text-2xl">fitness_center</span>
          </div>
          {/* ซ่อนตัวหนังสือ WeWorkout ในมือถือจอเล็กสุด จะได้ไม่เบียดเมนู */}
          <span className="hidden sm:block font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
        </Link>

        {/* 💥 ไฮไลท์ 2: โซนเมนูกลาง เอาคำว่า hidden ออกไปตลอดกาล! ใช้ flex โชว์ 100% */}
        <div className="flex items-center gap-3 md:gap-8 font-body font-bold text-[12px] md:text-sm">
          <Link to="/" className={`py-2 whitespace-nowrap border-b-2 transition-all ${isActive('/') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Home
          </Link>
          <Link to="/activities" className={`py-2 whitespace-nowrap border-b-2 transition-all ${isActive('/activities') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Find Activities
          </Link>
          <Link to="/create" className={`py-2 whitespace-nowrap border-b-2 transition-all ${isActive('/create') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Create Activity
          </Link>
          <Link to="/my-activities" className={`py-2 whitespace-nowrap border-b-2 transition-all ${isActive('/my-activities') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            My Activities
          </Link>
        </div>

        {/* โซนที่ 3: โปรไฟล์ผู้ใช้ & ปุ่ม Logout */}
        <div className="flex items-center gap-4">
          {/* โปรไฟล์โชว์เฉพาะจอที่ใหญ่กว่ามือถือ */}
          <div className="hidden md:flex items-center gap-3 text-right">
            <div>
              <div className="font-headline font-bold text-on-background text-[15px]">{user.name}</div>
              <div className="font-body text-xs text-on-surface-variant">{user.role}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-inner border-2 border-primary/20">
              <span className="material-symbols-outlined text-white text-xl">person</span>
            </div>
          </div>

          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-secondary hover:bg-red-100 hover:scale-105 transition-all shrink-0"
            title="Logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;