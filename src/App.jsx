import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import FindActivities from './pages/FindActivities'; 
import MyActivities from './pages/MyActivities'; 
import EventDetail from './pages/EventDetail';
import CreateActivity from './pages/CreateActivity';
import Profile from './pages/Profile'; // 💥 1. อิมพอร์ตหน้า Profile เข้ามา

function App() {
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
        <Route path="/profile" element={<Profile />} /> {/* 💥 2. เสียบปลั๊กสร้าง Route /profile */}
      </Routes>
    </>
  );
}

export default App;