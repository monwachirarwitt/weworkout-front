import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function BottomNavigation() {
  const location = useLocation();
  const { token } = useAuthStore();

  if (!token || location.pathname === '/login' || location.pathname === '/register') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant/20 z-50 pb-safe shrink-0">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        
        <Link to="/activities" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/activities') || isActive('/') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">{isActive('/activities') || isActive('/') ? 'home' : 'home'}</span>
          <span className="text-[10px] font-bold">Find</span>
        </Link>
        
        <Link to="/create" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/create') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">{isActive('/create') ? 'add_circle' : 'add_circle'}</span>
          <span className="text-[10px] font-bold">Create</span>
        </Link>
        
        <Link to="/my-activities" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/my-activities') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">{isActive('/my-activities') ? 'event_available' : 'event_available'}</span>
          <span className="text-[10px] font-bold">My Events</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive('/profile') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-2xl">{isActive('/profile') ? 'person' : 'person'}</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>

      </div>
    </nav>
  );
}

export default BottomNavigation;
