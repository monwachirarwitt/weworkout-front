import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { uploadImage } from '../utils/upload'; 

function Profile() {
  const [user, setUser] = useState({ name: '', email: '', profileImageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 💥 ดึงรูปที่แอบจำไว้ในเครื่องมาใช้ (ถ้ามี)
      const localImage = localStorage.getItem('myProfileImage'); 
      
      setUser({
        name: payload.name || 'Athletic User',
        email: payload.email || 'user@example.com',
        profileImageUrl: localImage || payload.profileImageUrl || '' // 💥 ถ้ามีรูปในเครื่อง ให้ใช้ก่อนเลย!
      });
    } catch (e) {
      console.error("แกะ Token ไม่สำเร็จ");
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
    if (!selectedFile) return alert('กรุณาเลือกรูปก่อน');
    
    setLoading(true);

    try {
      const profileImageUrl = await uploadImage(selectedFile);
      
      const response = await axios.put('/user/profile', { profileImageUrl: profileImageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('📸 อัปเดตโปรไฟล์สำเร็จ!');
        
      setUser({ ...user, profileImageUrl: profileImageUrl }); 
      setPreviewImage(null);
      setSelectedFile(null);
      
      window.location.reload(); 
      
    } catch (error) {
      console.error('อัปโหลดล้มเหลว:', error);
      alert('❌ อัปโหลดไม่สำเร็จ ลองใหม่อีกครั้งนะ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex justify-center py-12 px-6 font-body">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(7,30,39,0.06)] border border-outline-variant/10 p-10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary-container"></div>

        <div className="relative z-10 flex flex-col items-center mt-8">
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-surface-container-low shadow-lg flex items-center justify-center">
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

          <h2 className="font-headline font-black text-2xl text-on-background mt-4">{user.name}</h2>
          <p className="text-on-surface-variant font-medium text-sm">{user.email}</p>

          {selectedFile && (
            <div className="mt-6 flex gap-3 w-full">
              <button 
                onClick={() => { setSelectedFile(null); setPreviewImage(null); }}
                className="flex-1 py-3 rounded-xl font-bold text-on-surface-variant bg-surface-container-low hover:bg-outline-variant/30 transition-all"
                disabled={loading}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleUpload}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-primary-container transition-all flex justify-center items-center gap-2 shadow-md shadow-primary/20"
                disabled={loading}
              >
                {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'บันทึกรูปภาพ 💾'}
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