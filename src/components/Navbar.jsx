import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store ของเรามาใช้

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  //  2. ดึง user, token และฟังก์ชัน logout ออกมาจาก Store
  // user คือ obj ก้อนใหญ่ มีข้อมูลครบทุกอย่าง รอเราเข้าไปเจาะมันมาใช้
  const { user, token, logout } = useAuthStore();

  // 💥 3. เปลี่ยนเงื่อนไขซ่อน Navbar โดยอิงจาก token ใน Store
  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path;

  // 💥 4. สร้างตัวแปรดึงชื่อและรูป เพื่อความชัวร์ (ถ้าข้อมูลยังไม่มา ให้มี Fallback)
  const displayName = user?.name || 'Athletic User';
  //เจาะมันมาใช้
  const profileImageUrl = user?.profileImageUrl || '';

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20 shrink-0">
      <div className="px-4 h-16 flex items-center justify-center">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-xl md:text-2xl">fitness_center</span>
          </div>
          <span className="font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;