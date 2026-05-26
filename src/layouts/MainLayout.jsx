import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const MainLayout = () => {
  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-background relative flex flex-col">
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
