import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userApi from '../api/userApi';
import { uploadImage } from '../utils/upload';
import useAuthStore from '../store/authStore';

function Profile() {
  const navigate = useNavigate();

  // 1. ดึงข้อมูลและฟังก์ชันจาก Global State (รวมถึง logout)
  const { user, token, login, updateUser, logout } = useAuthStore();

  // 2. การตั้งค่า Local State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State สำหรับควบคุมการเปิด-ปิด Accordion
  const [expanded, setExpanded] = useState({ about: false, medical: false });

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    medicalNotes: '',
    bio: ''
  });

  const [bmi, setBmi] = useState(null);

  // 3. Effects
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

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

  // 4. ฟังก์ชันจัดการข้อมูล
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
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'weight' || name === 'height') {
      const newWeight = name === 'weight' ? value : formData.weight;
      const newHeight = name === 'height' ? value : formData.height;
      calculateBmi(newWeight, newHeight);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let profileImageUrl = user.profileImageUrl;

      if (selectedFile) {
        profileImageUrl = await uploadImage(selectedFile);
      }

      const payload = {
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        medicalNotes: formData.medicalNotes || null,
        bio: formData.bio || null,
        profileImageUrl: profileImageUrl || null
      };

      const response = await userApi.updateProfile(payload);

      alert('🎉 Profile updated successfully!');

      if (response.data.user) updateUser(response.data.user);
      if (response.data.token) login(response.data.token);

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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      if (logout) logout(); // เคลียร์ token จาก store
      navigate('/login'); // กลับไปหน้า login
    }
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 5. Loading State
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-body">
        <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
      </div>
    );
  }

  // Helper กำหนดสถานะ BMI
  const getBmiStatus = (bmi) => {
    if (!bmi) return { text: '', color: 'text-gray-400' };
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi >= 18.5 && bmi <= 24.9) return { text: 'Normal', color: 'text-[#007b6c]' };
    if (bmi >= 25 && bmi <= 29.9) return { text: 'Overweight', color: 'text-orange-500' };
    return { text: 'Obese', color: 'text-red-500' };
  };

  const bmiStatus = getBmiStatus(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-white flex justify-center py-10 px-5 sm:px-6 font-body pb-32">
      <div className="w-full max-w-md mx-auto relative">

        {/* --- ข้อมูลส่วนตัว (Header) --- */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group mb-4">
            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md flex items-center justify-center">
              {previewImage || user.profileImageUrl ? (
                <img src={previewImage || user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-gray-400 text-6xl">person</span>
              )}
            </div>

            {/* ปุ่มเปลี่ยนรูปโปรไฟล์ (ไอคอนดินสอ) */}
            <label className="absolute bottom-0 right-0 bg-[#C85A17] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform border-2 border-white">
              <span className="material-symbols-outlined text-[16px]">{isEditing ? 'photo_camera' : 'edit'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                handleFileChange(e);
                setIsEditing(true); // เปิดโหมด edit ด้วยเมื่อเปลี่ยนรูป
              }} />
            </label>
          </div>

          <h2 className="font-headline font-black text-2xl text-gray-900 mb-1">
            {user.name}
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            {user.email}
          </p>
        </div>

        {/* --- ส่วนแก้ไขปุ่ม Toggle (ถ้าไม่ได้เลือกแก้รูปจากไอคอนข้างบน) --- */}
        {!isEditing && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setIsEditing(true);
                // เปิด Accordion อัตโนมัติเมื่อกดแก้
                setExpanded({ about: true, medical: true });
              }}
              className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1"
            >
              Edit Stats
            </button>
          </div>
        )}

        {/* --- กริดแสดงสัดส่วนร่างกาย (Physical Stats) --- */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Weight */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Weight</p>
            {isEditing ? (
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full text-xl font-black text-gray-800 bg-transparent outline-none border-b border-primary pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                placeholder="kg"
              />
            ) : (
              <div>
                <span className="text-2xl font-black text-gray-800">{user.weight || '-'}</span>
                <span className="text-xs text-gray-500 ml-1">kg</span>
              </div>
            )}
            <p className="text-[10px] font-bold text-green-600 mt-1">~</p>
          </div>

          {/* Height */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Height</p>
            {isEditing ? (
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full text-xl font-black text-gray-800 bg-transparent outline-none border-b border-primary pb-1 appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                placeholder="cm"
              />
            ) : (
              <div>
                <span className="text-2xl font-black text-gray-800">{user.height || '-'}</span>
                <span className="text-xs text-gray-500 ml-1">cm</span>
              </div>
            )}
            <p className="text-[10px] font-bold text-transparent mt-1">-</p>
          </div>

          {/* BMI */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">BMI</p>
            <div>
              <span className="text-2xl font-black text-[#007b6c]">{bmi || '-'}</span>
            </div>
            <p className={`text-[10px] font-bold mt-1 ${bmiStatus.color}`}>{bmiStatus.text}</p>
          </div>
        </div>

        {/* --- ส่วน Accordion (About Me & Medical Notes) --- */}
        <div className="flex flex-col gap-3 mb-8">

          {/* About Me */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => !isEditing && toggleSection('about')}
              className={`w-full p-4 flex items-center justify-between ${isEditing ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3 text-gray-800">
                <span className="material-symbols-outlined text-[#007b6c]">person_search</span>
                <span className="font-bold">About Me</span>
              </div>
              {!isEditing && (
                <span className={`material-symbols-outlined text-gray-400 transition-transform ${expanded.about ? 'rotate-180' : ''}`}>expand_more</span>
              )}
            </button>
            {(expanded.about || isEditing) && (
              <div className="px-4 pb-4 pt-1">
                {isEditing ? (
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell us about yourself..." className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#007b6c] focus:ring-1 focus:ring-[#007b6c] outline-none text-sm text-gray-700 resize-none"></textarea>
                ) : (
                  <p className="text-sm text-gray-600">{user.bio || 'No bio provided yet.'}</p>
                )}
              </div>
            )}
          </div>

          {/* Medical Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => !isEditing && toggleSection('medical')}
              className={`w-full p-4 flex items-center justify-between ${isEditing ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3 text-gray-800">
                <span className="material-symbols-outlined text-[#C85A17]">medical_services</span>
                <span className="font-bold">Medical Notes</span>
              </div>
              {!isEditing && (
                <span className={`material-symbols-outlined text-gray-400 transition-transform ${expanded.medical ? 'rotate-180' : ''}`}>expand_more</span>
              )}
            </button>
            {(expanded.medical || isEditing) && (
              <div className="px-4 pb-4 pt-1">
                {isEditing ? (
                  <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} rows="3" placeholder="Any medical conditions?" className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#C85A17] focus:ring-1 focus:ring-[#C85A17] outline-none text-sm text-gray-700 resize-none"></textarea>
                ) : (
                  <p className="text-sm text-gray-600">{user.medicalNotes || 'No medical notes provided.'}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- ปุ่มบันทึก (เมื่ออยู่ในโหมด Edit) --- */}
        {isEditing && (
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleCancel} disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile} disabled={loading}
              className={`flex-[2] py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-md ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#C85A17] text-white hover:bg-[#a64a13]'}`}
            >
              {loading ? <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Saving...</> : 'Save Changes'}
            </button>
          </div>
        )}

        {/* --- ปุ่ม Logout --- */}
        {!isEditing && (
          <div className="mt-12">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all flex justify-center items-center gap-2 border border-red-100"
            >
              <span className="material-symbols-outlined">logout</span> Log Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;