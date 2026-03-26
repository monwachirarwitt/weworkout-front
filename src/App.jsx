import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Home from './pages/Home'; // เดี๋ยวเราจะมาแก้ไฟล์นี้เป็นหน้า Landing Page สุดปัง!
import FindActivities from './pages/FindActivities'; // 💥 1. นำเข้าหน้า Find Activities
import EventDetail from './pages/EventDetail';
import CreateActivity from './pages/CreateActivity';


function App() {
  return (
    <>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} /> {/* โฮมเพจรอรับแขก */}
        <Route path="/activities" element={<FindActivities />} /> {/* 💥 2. เพิ่ม Route สำหรับค้นหาตี้ */}
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateActivity />} /> 
      </Routes>
    </>
  );
}

export default App;
