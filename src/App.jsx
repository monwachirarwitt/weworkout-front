import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import FindActivities from './pages/FindActivities'; 
import MyActivities from './pages/MyActivities'; // 💥 1. นำเข้า MyActivities
import EventDetail from './pages/EventDetail';
import CreateActivity from './pages/CreateActivity';

function App() {
  return (
    <>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/activities" element={<FindActivities />} /> 
        <Route path="/my-activities" element={<MyActivities />} /> {/* 💥 2. เพิ่ม Route ตรงนี้ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/create" element={<CreateActivity />} /> 
      </Routes>
    </>
  );
}
export default App;