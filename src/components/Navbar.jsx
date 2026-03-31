import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store ของเรามาใช้

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 💥 2. ดึง user, token และฟังก์ชัน logout ออกมาจาก Store เลย
  const { user, token, logout } = useAuthStore();

  // 💥 3. เปลี่ยนเงื่อนไขซ่อน Navbar โดยอิงจาก token ใน Store
  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path;

  // 💥 4. สร้างตัวแปรดึงชื่อและรูป เพื่อความชัวร์ (ถ้าข้อมูลยังไม่มา ให้มี Fallback)
  const displayName = user?.name || 'Athletic User';
  const displayRole = user?.role || 'Pro Runner'; // ใน DB เราไม่มี role เลยใส่ค่าแข็งไว้ก่อนตามดีไซน์เดิม
  const profileImageUrl = user?.profileImageUrl || '';

  return (
    <nav className="sticky top-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-xl md:text-2xl">fitness_center</span>
          </div>
          <span className="hidden sm:block font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
        </Link>

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

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-right">
            <div>
              {/* 💥 5. โชว์ชื่อและ Role จากตัวแปรที่เราดึงมา */}
              <div className="font-headline font-bold text-on-background text-[15px]">{displayName}</div>
            </div>
            
            {/* 💥 6. โชว์รูปโปรไฟล์ */}
            <Link to="/profile" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-inner border-2 border-primary/20 hover:scale-110 transition-transform cursor-pointer overflow-hidden">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-white text-xl">person</span>
              )}
            </Link>
            
          </div>

          <button 
            onClick={() => { 
              // 💥 7. เรียกใช้ฟังก์ชัน logout จาก Store แทน
              logout(); 
              navigate('/login'); 
            }} 
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