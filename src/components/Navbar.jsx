import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // สร้าง State มารับข้อมูล User จาก Token
  const [user, setUser] = useState({ name: 'Guest', role: 'Member' });

  // ฟังก์ชันแอบแกะ Token เพื่อเอาชื่อผู้ใช้มาโชว์
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: payload.name || 'Athletic User',
          role: 'Pro Runner' // สมมติ Role เท่ๆ ไปก่อน ตามเรฟเฟอเรนซ์
        });
      } catch (e) {
        console.error("แกะ Token ไม่สำเร็จ");
      }
    }
  }, [token]);

  if (!token || location.pathname === '/login') return null;

  // Helper สำหรับเช็กว่าตอนนี้อยู่หน้าไหน จะได้ขีดเส้นใต้เมนูนั้นสีเขียวๆ
  const isActive = (path) => location.pathname === path;

  return (
    // ครอบด้วยพื้นหลังขาวแบบโปร่งแสงนิดๆ และตรึงติดขอบบน (sticky)
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20">
      
      {/* จัดกึ่งกลางด้วย max-w-7xl และ mx-auto */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        {/* โซนที่ 1: โลโก้ */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">fitness_center</span>
          </div>
          <span className="font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
        </Link>

        {/* โซนที่ 2: เมนูกลาง (ซ่อนในจอมือถือ ไปโชว์จอใหญ่) */}
        <div className="hidden lg:flex items-center gap-10 font-body font-bold text-sm">
          <Link to="/" className={`py-2 border-b-2 transition-all ${isActive('/') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Home
          </Link>
          <Link to="/activities" className={`py-2 border-b-2 transition-all ${isActive('/activities') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Find Activities
          </Link>
          <Link to="/create" className={`py-2 border-b-2 transition-all ${isActive('/create') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            Create Activity
          </Link>
          <Link to="/my-activities" className={`py-2 border-b-2 transition-all ${isActive('/my-activities') ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30'}`}>
            My Activities
          </Link>
        </div>

        {/* โซนที่ 3: โปรไฟล์ผู้ใช้ & ปุ่ม Logout */}
        <div className="flex items-center gap-6">
          
          {/* ข้อมูลโปรไฟล์ (ซ่อนในจอมือถือเล็กๆ) */}
          <div className="hidden sm:flex items-center gap-3 text-right">
            <div>
              <div className="font-headline font-bold text-on-background text-[15px]">{user.name}</div>
              <div className="font-body text-xs text-on-surface-variant">{user.role}</div>
            </div>
            
            {/* รูปโปรไฟล์ (ถ้าไม่มีรูป ใช้ไอคอนสีขาวพื้นเขียว) */}
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-inner border-2 border-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">person</span>
            </div>
          </div>

          {/* ปุ่ม Logout แบบมินิมอล */}
          <button 
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-secondary hover:bg-red-100 hover:scale-105 transition-all"
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