import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { uploadImage } from '../utils/upload'; // ฟังก์ชัน Utility สำหรับอัปโหลดรูปภาพ
import useAuthStore from '../store/authStore'; 

function Profile() {
  const navigate = useNavigate();
   
  // 1. ดึงข้อมูลและฟังก์ชันจาก Global State (Zustand)
 
  const { user, token, login, updateUser } = useAuthStore();
   
  // 2. การตั้งค่า Local State
 
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์รูปภาพที่ผู้ใช้เลือก
  const [previewImage, setPreviewImage] = useState(null); // เก็บ URL สำหรับพรีวิวรูปภาพก่อนอัปโหลด
  const [loading, setLoading] = useState(false);          // สถานะการโหลดตอนกด Save
  const [isEditing, setIsEditing] = useState(false);      // โหมดแก้ไขโปรไฟล์ (เปิด/ปิด)
  
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    medicalNotes: '',
    bio: ''
  });

  const [bmi, setBmi] = useState(null); // State เก็บค่า BMI ที่คำนวณได้

  // 3. Effects (ทำงานเมื่อ Component โหลด หรือ State เปลี่ยน)
 
  useEffect(() => {
    // Route Protection: ถ้าไม่มี Token ให้กลับไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

    // ถ้ามีข้อมูล user ใน Store ให้นำมาเซ็ตเป็นค่าเริ่มต้นในฟอร์ม
    if (user) {
      setFormData({
        weight: user.weight || '',
        height: user.height || '',
        medicalNotes: user.medicalNotes || '',
        bio: user.bio || ''
      });
      // คำนวณ BMI ทันทีที่ได้ข้อมูลน้ำหนักและส่วนสูงมา
      calculateBmi(user.weight, user.height);
    }
  }, [navigate, token, user]);

  // 4. ฟังก์ชันจัดการข้อมูล (Handlers & Logic)
 
  // ฟังก์ชันคำนวณหาค่าดัชนีมวลกาย (BMI)
  const calculateBmi = (weight, height) => {
    if (weight && height) {
      const heightInMeters = height / 100; // แปลงส่วนสูงจากซม.เป็นเมตร
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1); // คำนวณและปัดทศนิยม 1 ตำแหน่ง
      setBmi(bmiValue);
    } else {
      setBmi(null);
    }
  };

  // ดักจับการเลือกรูปภาพโปรไฟล์ใหม่
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // สร้าง URL จำลองเพื่อแสดงรูปพรีวิว
      setIsEditing(true); // บังคับเข้าโหมดแก้ไขเมื่อเลือกรูป
    }
  };

  // ดักจับการพิมพ์แก้ข้อมูลใน Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ถ้าแก้ช่องน้ำหนักหรือส่วนสูง ให้คำนวณ BMI ใหม่แบบ Real-time
    if (name === 'weight' || name === 'height') {
      const newWeight = name === 'weight' ? value : formData.weight;
      const newHeight = name === 'height' ? value : formData.height;
      calculateBmi(newWeight, newHeight);
    }
  };

  // ฟังก์ชันบันทึกข้อมูลโปรไฟล์
  const handleUpdateProfile = async () => {
    setLoading(true);

    try {
      let profileImageUrl = user.profileImageUrl;

      // ถ้ามีการเลือกรูปใหม่ ให้ทำการอัปโหลดรูปก่อน (เรียกใช้ฟังก์ชัน uploadImage)
      if (selectedFile) {
        profileImageUrl = await uploadImage(selectedFile);
      }
      
      // เตรียมข้อมูล Payload ที่จะส่งไปให้ API (ถ้าเป็น string ว่าง ให้แปลงเป็น null)
      const payload = { 
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        medicalNotes: formData.medicalNotes || null,
        bio: formData.bio || null,
        profileImageUrl: profileImageUrl || null
      };

      // ยิง API อัปเดตข้อมูล
      const response = await axios.put('/user/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('🎉 Profile updated successfully!');
      
      // อัปเดตข้อมูลใน Global Store เพื่อให้ทุกหน้าที่ใช้ข้อมูล user อัปเดตตาม
      if (response.data.user) {
        updateUser(response.data.user);
      }
      if (response.data.token) {
        login(response.data.token); // รีเฟรช token ถ้า API ส่งกลับมาให้ใหม่
      }
  
      // รีเซ็ตเคลียร์ค่าพรีวิวรูปภาพและปิดโหมดแก้ไข
      setPreviewImage(null);
      setSelectedFile(null);
      setIsEditing(false); 
      
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Failed to update profile: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันยกเลิกการแก้ไข (Reset กลับไปเป็นค่าเดิม)
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewImage(null);
    setFormData({
      weight: user.weight || '',
      height: user.height || '',
      medicalNotes: user.medicalNotes || '',
      bio: user.bio || ''
    });
    calculateBmi(user.weight, user.height);
  };

  // 5. ส่วนควบคุมการแสดงผลขณะรอข้อมูล (Loading State)
 
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-background flex items-center justify-center font-body">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
      </div>
    );
  }

  // Helper กำหนดสีของตัวเลข BMI ตามเกณฑ์สุขภาพ
  const getBmiColor = (bmi) => {
    if (!bmi) return 'text-gray-400';
    if (bmi < 18.5) return 'text-blue-500'; // น้ำหนักน้อย (ผอม)
    if (bmi >= 18.5 && bmi <= 24.9) return 'text-green-500'; // ปกติ
    if (bmi >= 25 && bmi <= 29.9) return 'text-orange-500'; // น้ำหนักเกิน
    return 'text-red-500'; // โรคอ้วน
  };

  // 6. ส่วนการแสดงผล (UI / JSX)
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#00A693]/10 to-gray-50 flex justify-center py-12 px-4 sm:px-6 font-body pb-24">
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* --- แบนเนอร์หัวโปรไฟล์ --- */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-[#00A693] to-[#007b6c]"></div>

        {/* --- ปุ่มเปิดโหมด Edit Profile (จะโชว์เฉพาะตอนยังไม่ได้อยู่ในโหมด Edit) --- */}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-sm border border-white/30"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
          </button>
        )}

        <div className="relative z-10 flex flex-col items-center mt-20 px-8 pb-12">
          
          {/* --- รูปโปรไฟล์ (Profile Picture) --- */}
          <div className="relative group mb-6">
            <div className="w-36 h-36 rounded-full border-[6px] border-white overflow-hidden bg-gray-100 shadow-xl flex items-center justify-center">
              {/* เลือกว่าจะโชว์รูปพรีวิว (เพิ่งเลือกมา), รูปโปรไฟล์ที่มีอยู่, หรือไอคอนคนถ้าไม่มีรูป */}
              {previewImage || user.profileImageUrl ? (
                <img src={previewImage || user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-gray-300 text-7xl">person</span>
              )}
            </div>
            
            {/* ปุ่มเปลี่ยนรูปโปรไฟล์ (โชว์เฉพาะตอนโหมด Edit) */}
            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-2 border-white">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                {/* อินพุตซ่อนไว้ (Hidden File Input) */}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>

          {/* ข้อมูลพื้นฐาน: ชื่อและอีเมล */}
          <h2 className="font-headline font-black text-3xl text-gray-800 mb-1 flex items-center gap-2">
            {user.name}
          </h2>
          <p className="text-gray-500 font-medium text-sm mb-10">{user.email}</p>

          {/* --- กริดแสดงข้อมูลแบบ 2 คอลัมน์ --- */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* คอลัมน์ 1: สัดส่วนร่างกาย (Physical Stats) */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
              <h3 className="font-headline font-black text-xl text-primary mb-6 flex items-center gap-2">
                Physical Stats 
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* --- น้ำหนัก (Weight) --- */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight</p>
                  {isEditing ? (
                    <div className="flex items-end gap-1">
                      {/* 💥 เพิ่มคลาสเพื่อซ่อนลูกศรขึ้นลงใน input number (Spin Buttons) เพื่อความสวยงาม */}
                      <input 
                        type="number" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleChange} 
                        className="w-full text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-primary focus:border-secondary transition-colors pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] m-0" 
                      />
                      <span className="text-gray-400 font-medium pb-1">kg</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-black text-gray-800">{user.weight ? `${user.weight} kg` : '-'}</p>
                  )}
                </div>
                
                {/* --- ส่วนสูง (Height) --- */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Height</p>
                  {isEditing ? (
                    <div className="flex items-end gap-1">
                      {/* 💥 ซ่อนลูกศรขึ้นลง (Spin Buttons) เหมือนน้ำหนัก */}
                      <input 
                        type="number" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleChange} 
                        className="w-full text-2xl font-black text-gray-800 bg-transparent outline-none border-b-2 border-primary focus:border-secondary transition-colors pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] m-0" 
                      />
                      <span className="text-gray-400 font-medium pb-1">cm</span>
                    </div>
                  ) : (
                    <p className="text-3xl font-black text-gray-800">{user.height ? `${user.height} cm` : '-'}</p>
                  )}
                </div>
              </div>

              {/* --- แสดงผล BMI --- */}
              <div className="bg-[#00A693]/10 p-5 rounded-2xl border border-[#00A693]/20 flex items-center justify-between mt-auto">
                <div>
                  <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Body Mass Index</span>
                  <span className={`font-black text-4xl ${getBmiColor(bmi)}`}>{bmi || '--'}</span>
                </div>
                <span className="text-4xl">📊</span>
              </div>
            </div>

            {/* คอลัมน์ 2: ข้อมูลส่วนตัวอื่นๆ (About Me & Medical Notes) */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6">
              
              {/* --- ประวัติย่อ (Bio) --- */}
              <div>
                <h3 className="font-headline font-black text-xl text-primary mb-4 flex items-center gap-2">
                   About Me
                </h3>
                {isEditing ? (
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell us about yourself..." className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-gray-700"></textarea>
                ) : (
                  <div className="bg-white p-4 rounded-2xl min-h-[80px] border border-gray-100 shadow-sm text-gray-600 relative">
                    {user.bio ? <p className="pr-6">{user.bio}</p> : <p className="italic text-gray-400">ยังไม่มีข้อมูลแนะนำตัว พิมพ์อะไรสักหน่อยสิ!</p>}
                  </div>
                )}
              </div>

              {/* --- ข้อมูลทางการแพทย์ (Medical Notes) --- */}
              <div>
                <h3 className="font-headline font-black text-xl text-primary mb-4 flex items-center gap-2">
                  Medical Notes
                </h3>
                {isEditing ? (
                  <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="3" placeholder="Any medical conditions we should know?" className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 outline-none transition-all resize-none text-gray-700"></textarea>
                ) : (
                  <div className="bg-white p-4 rounded-2xl min-h-[80px] border border-gray-100 shadow-sm text-gray-600 relative">
                    {user.medicalNotes ? <p className="text-orange-600 font-medium pr-6">{user.medicalNotes}</p> : <p className="italic text-gray-400"></p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- ปุ่มควบคุมด้านล่าง (จะโชว์เฉพาะตอนโหมด Edit) --- */}
          {isEditing && (
            <div className="w-full mt-10 flex flex-col sm:flex-row gap-4">
              {/* ปุ่มยกเลิก */}
              <button 
                onClick={handleCancel}
                disabled={loading} // ปิดการกดระหว่างกำลังโหลด
                className="w-full sm:w-1/3 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex justify-center items-center gap-2"
              >
                Cancel
              </button>
              
              {/* ปุ่มบันทึก */}
              <button 
                onClick={handleUpdateProfile}
                disabled={loading} // ปิดการกดระหว่างกำลังโหลด
                className={`w-full sm:w-2/3 py-4 rounded-2xl font-headline font-black text-lg transition-all flex justify-center items-center gap-2 shadow-lg ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-white bg-[#E65C2F] hover:bg-[#cc5128] shadow-[#E65C2F]/30 hover:-translate-y-1'}`}
              >
                {/* เปลี่ยนหน้าตาปุ่มตามสถานะ loading */}
                {loading ? (
                  <><span className="material-symbols-outlined animate-spin">sync</span> Updating...</>
                ) : (
                  <>Save Profile </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;