import { useEffect } from 'react'; // 💥 1. อิมพอร์ต useEffect
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import Login from './pages/Login';
import Register from './pages/Register';
import FindActivities from './pages/FindActivities';
import MyActivities from './pages/MyActivities';
import EventDetail from './pages/EventDetail';
import CreateActivity from './pages/CreateActivity';
import Profile from './pages/Profile';
import useAuthStore from './store/authStore'; // 💥 2. อิมพอร์ต Store ของเรามาใช้

function App() {
  // 💥 3. ดึงฟังก์ชัน fetchMe ออกมาจาก Store
  const fetchMe = useAuthStore((state) => state.fetchMe);

  // 💥 4. สั่งให้ fetchMe ทำงานทันทีที่ App โหลดเสร็จครั้งแรก
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen bg-background relative flex flex-col">
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<FindActivities />} />
          <Route path="/my-activities" element={<MyActivities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default App;