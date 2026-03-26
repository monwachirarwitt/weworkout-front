import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // 1. นำเข้า Navbar
import Login from './pages/Login';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';

function App() {
  return (
    <>
      {/* 2. วาง Navbar ไว้บนสุด เหนือ Routes ทั้งหมด */}
      <Navbar /> 
      
      {/* โซนเนื้อหาหน้าเว็บ */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateEvent />} /> {/* 2. เพิ่ม Route นี้ */}
      </Routes>
    </>
  );
}

export default App;
