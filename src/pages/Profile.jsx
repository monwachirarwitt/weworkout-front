import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { uploadImage } from '../utils/upload'; 
import useAuthStore from '../store/authStore'; 

function Profile() {
  const navigate = useNavigate();
  const { user, token, login, updateUser } = useAuthStore();
  

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // 💥 State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    medicalNotes: '',
    bio: ''
  });

  // 💥 State สำหรับเก็บค่า BMI
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // 💥 ถ้าโหลด User สำเร็จ ให้ดึงข้อมูลเก่ามาใส่ฟอร์มรอไว้เลย
    if (user) {
      setFormData({
        weight: user.weight || '',
        height: user.height || '',
        medicalNotes: user.medicalNotes || '',
        bio: user.bio || ''
      });
      calculateBmi(user.weight, user.height);
    }
  }, [navigate, token, user]);

  // ฟังก์ชันคำนวณ BMI
  const calculateBmi = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
    } else {
      setBmi(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ถ้าแก้ค่าน้ำหนักหรือส่วนสูง ให้คำนวณ BMI ใหม่ทันที
    if (name === 'weight' || name === 'height') {
      const newWeight = name === 'weight' ? value : formData.weight;
      const newHeight = name === 'height' ? value : formData.height;
      calculateBmi(newWeight, newHeight);
    }
  };

  // ... (อย่าลืมไปเพิ่ม `updateUser` ในตอนดึงค่าบรรทัดต้นไฟล์: const { user, token, login, updateUser } = useAuthStore();) ...

  const handleUpdateProfile = async () => {
    setLoading(true);

    try {
      let profileImageUrl = user.profileImageUrl;

      if (selectedFile) {
        profileImageUrl = await uploadImage(selectedFile);
      }
      
      const payload = { 
        ...formData,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        profileImageUrl 
      };

      const response = await axios.put('/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('🎉 Profile updated successfully!');
      
      // 💥 4. โคตรสำคัญ! ถ้าอัปเดตสำเร็จ บังคับเอาข้อมูลจาก response มาทับใน Zustand ทันที!
      if (response.data.user) {
        // ใช้ฟังก์ชัน updateUser เพื่อเปลี่ยนข้อมูลใน Store (หน้าจอจะเปลี่ยนตามทันทีโดยไม่ต้องรีเฟรช)
        updateUser(response.data.user);
      }
      
      if (response.data.token) {
        login(response.data.token);
      }
  
      setPreviewImage(null);
      setSelectedFile(null);
      
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Failed to update profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // โชว์หน้าโหลดไปก่อนถ้าระบบยังหา User ไม่เจอ
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center font-body">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
      </div>
    );
  }

  // ตัวช่วยแสดงสีของ BMI ตามเกณฑ์มาตรฐาน
  const getBmiColor = (bmi) => {
    if (!bmi) return 'text-on-surface-variant';
    if (bmi < 18.5) return 'text-blue-500'; // ผอม
    if (bmi >= 18.5 && bmi <= 24.9) return 'text-green-500'; // ปกติ
    if (bmi >= 25 && bmi <= 29.9) return 'text-orange-500'; // ท้วม
    return 'text-red-500'; // อ้วน
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex justify-center py-12 px-6 font-body pb-24">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_40px_rgba(7,30,39,0.06)] border border-outline-variant/10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-primary-container"></div>

        <div className="relative z-10 flex flex-col items-center mt-12 px-8 pb-10">
          
          <div className="relative group mb-4">
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

          <h2 className="font-headline font-black text-3xl text-on-background">{user.name}</h2>
          <p className="text-on-surface-variant font-medium text-sm mb-8">{user.email}</p>

          {/* 💥 โซนกรอกข้อมูลสุขภาพ */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-headline font-black text-lg border-b border-outline-variant/20 pb-2">Physical Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 70" className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-outline uppercase mb-1">Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 175" className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-outline uppercase tracking-wider mb-1">Body Mass Index (BMI)</span>
                  <span className={`font-black text-2xl ${getBmiColor(bmi)}`}>{bmi || '--'}</span>
                </div>
                <span className="material-symbols-outlined text-4xl text-outline-variant/50">monitor_weight</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-headline font-black text-lg border-b border-outline-variant/20 pb-2">Medical Profile</h3>
              <div>
                <label className="block text-xs font-bold text-outline uppercase mb-1">Medical Notes</label>
                <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="2" placeholder="Any allergies, injuries, or conditions?" className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase mb-1">Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="2" placeholder="Tell everyone a bit about yourself!" className="w-full p-3 rounded-xl border border-outline-variant/50 bg-background/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"></textarea>
              </div>
            </div>

          </div>

          <div className="w-full mt-10">
            <button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-headline font-black text-lg transition-all flex justify-center items-center gap-2 shadow-lg ${loading ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed' : 'text-white bg-primary hover:bg-primary-container hover:-translate-y-1 shadow-primary/20'}`}
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin">sync</span> Updating...</>
              ) : (
                'Save Profile'
              )}
            </button>

            {/* ปุ่ม Cancel จะโชว์เฉพาะตอนที่มีการเลือกรูปใหม่มาเตรียมอัปโหลด */}
            {selectedFile && (
               <button 
                onClick={() => { setSelectedFile(null); setPreviewImage(null); }}
                className="w-full mt-3 py-3 rounded-xl font-bold text-on-surface-variant bg-surface-container-low hover:bg-outline-variant/30 transition-all"
                disabled={loading}
              >
                Cancel Photo Change
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;