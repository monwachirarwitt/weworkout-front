import { useEffect } from 'react'; // 💥 1. อิมพอร์ต useEffect
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
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
    <>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/activities" element={<FindActivities />} /> 
        <Route path="/my-activities" element={<MyActivities />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateActivity />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </>
  );
}

export default App;