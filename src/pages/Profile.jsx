import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { uploadImage } from '../utils/upload'; 
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store

function Profile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // 💥 2. ดึงข้อมูล user, token และฟังก์ชันอัปเดต Store มาใช้งาน
  const { user, token, login } = useAuthStore();

  useEffect(() => {
    // ถ้าไม่มี Token ให้เตะไปหน้า Login
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select an image first.');
    
    setLoading(true);

    try {
      // 1. อัปโหลดรูปขึ้น Cloudinary ได้ URL กลับมา
      const profileImageUrl = await uploadImage(selectedFile);
      
      // 2. ส่ง URL รูปใหม่ไปอัปเดตในฐานข้อมูล
      const response = await axios.put('/user/profile', { profileImageUrl: profileImageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('📸 Profile updated successfully!');
      
      // 💥 3. จุดสำคัญ: ถ้า API ส่ง Token ใบใหม่ (ที่มีรูปอัปเดต) กลับมา
      // ให้โยน Token นั้นเข้า Zustand (ผ่านฟังก์ชัน login) เพื่ออัปเดตทั้งระบบทันที!
      if (response.data.token) {
        login(response.data.token);
      }
  
      setPreviewImage(null);
      setSelectedFile(null);
      
      // ลบคำสั่ง window.location.reload() ทิ้งไปได้เลยครับ 
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 💥 ถ้ายังดึงข้อมูล User ไม่เสร็จ ให้โชว์หน้าโหลดไปก่อน
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-primary font-bold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex justify-center py-12 px-6 font-body">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(7,30,39,0.06)] border border-outline-variant/10 p-10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary-container"></div>

        <div className="relative z-10 flex flex-col items-center mt-8">
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-surface-container-low shadow-lg flex items-center justify-center">
              {/* 💥 ดึงรูปจากตัวแปร user (ที่เชื่อมกับ Zustand) มาโชว์ได้เลย */}
              {previewImage || user.profileImageUrl ? (
                <img src={previewImage || user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-outline-variant text-6xl">person</span>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform border-2 border-surface-container-lowest">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {/* 💥 ดึงข้อมูลชื่อและอีเมลจาก Store */}
          <h2 className="font-headline font-black text-2xl text-on-background mt-4">{user.name}</h2>
          <p className="text-on-surface-variant font-medium text-sm">{user.email}</p>

          {selectedFile && (
            <div className="mt-6 flex gap-3 w-full">
              <button 
                onClick={() => { setSelectedFile(null); setPreviewImage(null); }}
                className="flex-1 py-3 rounded-xl font-bold text-on-surface-variant bg-surface-container-low hover:bg-outline-variant/30 transition-all"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-container transition-all flex justify-center items-center gap-2 shadow-md shadow-primary/20"
                disabled={loading}
              >
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Save Image 💾'}
              </button>
            </div>
          )}

          <div className="w-full mt-10 space-y-4">
            <div className="bg-background p-4 rounded-xl border border-outline-variant/20">
              <span className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">Role</span>
              <span className="font-bold text-on-background">Pro Runner 🏃‍♂️</span>
            </div>
            <div className="bg-background p-4 rounded-xl border border-outline-variant/20">
              <span className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">Status</span>
              <span className="font-bold text-primary">Ready to move! 🔥</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;