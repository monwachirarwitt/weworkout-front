import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; 
import { uploadImage } from '../utils/upload'; 

function CreateActivity() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  // 🛡️ เช็คว่าล็อกอินหรือยัง ถ้าไม่มี Token ให้เตะกลับหน้า Login
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // 📝 กระปุกเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    locationName: '', 
    locationUrl: '',
    eventDate: '', 
    startTime: '', 
    endTime: '', 
    category: 'Football', // ค่าเริ่มต้นเป็นฟุตบอล
    maxParticipants: ''
  });

  // 📸 State สำหรับรูปภาพพรีวิวและสถานะการอัปโหลด
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🖼️ ฟังก์ชันเมื่อ User เลือกรูปภาพ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // เริ่มโหมด Loading

    try {
      let imgEventUrl = null;

      // ☁️ ถ้ามีการเลือกรูป ให้ส่งไปที่ Cloudinary ก่อน
      if (selectedFile) {
        imgEventUrl = await uploadImage(selectedFile);
      }

      // 🚀 เตรียมข้อมูลส่งหลังบ้าน (imgEvent จะเป็น null ถ้าไม่ได้อัปโหลดรูป)
      const payload = { 
        ...formData, 
        maxParticipants: Number(formData.maxParticipants), 
        eventDate: `${formData.eventDate}T00:00:00.000Z`,
        imgEvent: imgEventUrl 
      };
      
      await axios.post('/event', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('🎉 Activity created successfully!');
      navigate('/'); 
    } catch (error) {
      alert('❌ Failed to create activity: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false); // ปิดโหมด Loading
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/20 via-[#F4F7F9] to-[#1B5E20]/10 flex items-center justify-center py-12 px-4 relative overflow-hidden font-body">
      
      {/* สติกเกอร์ตกแต่งพื้นหลัง */}
      <div className="absolute top-10 left-10 lg:left-32 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden -rotate-12 opacity-70 shadow-2xl pointer-events-none hidden md:block border-4 border-white/50">
        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop" alt="Basketball" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent mix-blend-multiply"></div>
      </div>

      <div className="absolute bottom-10 right-10 lg:right-32 w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden rotate-[15deg] opacity-70 shadow-2xl pointer-events-none hidden md:block border-4 border-white/50">
        <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop" alt="Running" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent mix-blend-multiply"></div>
      </div>

      {/* 📦 กล่องฟอร์มหลัก */}
      <div className="relative z-10 w-full max-w-[650px] bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-outline-variant/20">
        
        <h2 className="text-3xl font-headline font-black text-primary text-center mb-8">Create Activity</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* 📸 ส่วนอัปโหลดรูปปกกิจกรรม (Custom Cover) */}
          <div className="relative w-full h-48 md:h-56 bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:bg-surface-container-lowest hover:border-primary/50 transition-all">
            {previewImage ? (
              <>
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">edit</span> Change Photo
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-on-surface-variant group-hover:text-primary transition-colors flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                <p className="font-bold">Add Cover Photo</p>
                <p className="text-xs opacity-70 mt-1">Optional. Default category image will be used if skipped.</p>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          
          {/* ชื่อกิจกรรม */}
          <div>
            <label className="block font-bold text-on-background mb-1">Activity Title</label>
            <input 
              type="text" name="title" required onChange={handleChange} 
              placeholder="e.g. Casual 7-a-side Football" 
              className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
            />
          </div>

          {/* รายละเอียด */}
          <div>
            <label className="block font-bold text-on-background mb-1">Description</label>
            <textarea 
              name="description" rows="3" onChange={handleChange} 
              placeholder="Share some details with your friends..." 
              className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* สถานที่ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">Location Name</label>
              <input 
                type="text" name="locationName" required onChange={handleChange} 
                placeholder="e.g. Lumphini Park"
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">Google Maps URL</label>
              <input 
                type="url" name="locationUrl" required onChange={handleChange} 
                placeholder="https://maps.google.com/..."
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>

          {/* วันและเวลา */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">Date</label>
              <input 
                type="date" name="eventDate" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">Start Time</label>
              <input 
                type="time" name="startTime" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">End Time</label>
              <input 
                type="time" name="endTime" required onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface-variant" 
              />
            </div>
          </div>

          {/* หมวดหมู่กีฬา และ จำนวนคน */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-on-background mb-1">Category</label>
              <select 
                name="category" onChange={handleChange} 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
              >
                <option value="Football">Football</option>
                <option value="Fitness">GYM</option> {/* ✅ แก้จาก Badminton เป็น Fitness */}
                <option value="Basketball">Basketball</option>
                <option value="Running">Running</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-on-background mb-1">Max Participants</label>
              <input 
                type="number" name="maxParticipants" required onChange={handleChange} min="2" 
                placeholder="e.g. 10" 
                className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              />
            </div>
          </div>

          {/* ปุ่มกดสร้างกิจกรรม */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-4 mt-6 rounded-xl font-headline font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed' : 'bg-secondary text-white hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-secondary/30'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                Creating...
              </>
            ) : (
              'Create Activity'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateActivity;