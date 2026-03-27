import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function CreateActivity() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // กระปุกเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '', description: '', locationName: '', locationUrl: '',
    eventDate: '', startTime: '', endTime: '', category: 'Football', maxParticipants: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  ไฮไลท์การแก้บั๊ก: แปลงชนิดข้อมูลให้ตรงใจ Prisma ก่อนส่ง!
      const payload = { 
        ...formData, 
        maxParticipants: Number(formData.maxParticipants), // แปลงเป็นตัวเลข
        eventDate: `${formData.eventDate}T00:00:00.000Z`   // เติมเวลาเข้าไปให้เป็น ISO-8601
      };
      
      await axios.post('/event', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('🎉 สร้างตี้กีฬาสำเร็จ!');
      navigate('/'); // สร้างเสร็จเด้งกลับหน้า Feed
    } catch (error) {
      alert('❌ สร้างตี้ไม่สำเร็จ: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    // 🎨 โซนพื้นหลังสุดอลังการ (Gradient + Floating Sport Cards)
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 flex items-center justify-center py-12 px-4 relative overflow-hidden font-body">
      
      {/* สติกเกอร์/การ์ดตกแต่ง ซ้าย (บาสเกตบอล) - ซ่อนในจอมือถือ */}
      <div className="absolute top-10 left-10 lg:left-32 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden -rotate-12 opacity-70 shadow-2xl pointer-events-none hidden md:block border-4 border-white/50">
        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" alt="Basketball" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent mix-blend-multiply"></div>
      </div>

      {/* สติกเกอร์/การ์ดตกแต่ง ขวา (วิ่ง) - ซ่อนในจอมือถือ */}
      <div className="absolute bottom-10 right-10 lg:right-32 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[15deg] opacity-70 shadow-2xl pointer-events-none hidden md:block border-4 border-white/50">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop" alt="Running" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-multiply"></div>
      </div>

      

      {/* 📝 โซนกล่องฟอร์มหลัก (ดีไซน์เป๊ะตามรูปที่ 1 เน้นคลีนๆ ขาวๆ) */}
      <div className="relative z-10 w-full max-w-[650px] bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-outline-variant/20">
        
        <h2 className="text-3xl font-headline font-black text-primary text-center mb-8">Create Activity</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* แถวที่ 1: ชื่อตี้ */}
          <div>
            <label className="block font-bold text-on-background mb-1">ชื่อตี้/กิจกรรม</label>
            <input 
              type="text" name="title" required onChange={handleChange} 
              placeholder="เช่น เตะบอลหญ้าเทียมขำๆ" 
              className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            />
          </div>

          {/* แถวที่ 2: รายละเอียด */}
          <div>
            <label className="block font-bold text-on-background mb-1">รายละเอียด</label>
            <textarea 
              name="description" rows="3" onChange={handleChange} 
              placeholder="บอกรายละเอียดเพื่อนๆ หน่อย..." 
              className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* แถวที่ 3: สถานที่ (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">ชื่อสถานที่</label>
              <input 
                type="text" name="locationName" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">ลิงก์ Google Map</label>
              <input 
                type="url" name="locationUrl" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>

          {/* แถวที่ 4: เวลา (แบ่ง 3 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">วันที่จัด</label>
              <input 
                type="date" name="eventDate" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">เริ่มกี่โมง</label>
              <input 
                type="time" name="startTime" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">ถึงกี่โมง</label>
              <input 
                type="time" name="endTime" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
          </div>

          {/* แถวที่ 5: กีฬา & จำนวนคน (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">ชนิดกีฬา</label>
              <select 
                name="category" onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option value="Football">ฟุตบอล</option>
                <option value="Badminton">ฟิตเนส</option>
                <option value="Basketball">บาสเกตบอล</option>
                <option value="Running">วิ่ง</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">รับกี่คน</label>
              <input 
                type="number" name="maxParticipants" required onChange={handleChange} min="2" 
                placeholder="เช่น 10" 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>

          {/* ปุ่มสร้างตี้ */}
          <button 
            type="submit" 
            className="w-full p-4 mt-6 bg-secondary text-white rounded-xl font-headline font-bold text-lg hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-secondary/30 transition-all"
          >
            Create
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateActivity