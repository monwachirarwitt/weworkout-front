import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function CreateEvent() {
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
      // 💥 ไฮไลท์การแก้บั๊ก: แปลงชนิดข้อมูลให้ตรงใจ Prisma ก่อนส่ง!
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '40px auto', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '20px' }}>สร้างตี้กีฬาใหม่ 🏃‍♂️</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>ชื่อตี้/กิจกรรม</label>
          <input type="text" name="title" required onChange={handleChange} placeholder="เช่น เตะบอลหญ้าเทียมขำๆ" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>รายละเอียด</label>
          <textarea name="description" rows="3" onChange={handleChange} placeholder="บอกรายละเอียดเพื่อนๆ หน่อย..." style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}></textarea>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>ชื่อสถานที่</label>
            <input type="text" name="locationName" required onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>ลิงก์ Google Map</label>
            <input type="url" name="locationUrl" required onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>วันที่จัด</label>
            <input type="date" name="eventDate" required onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>เริ่มกี่โมง</label>
            <input type="time" name="startTime" required onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>ถึงกี่โมง</label>
            <input type="time" name="endTime" required onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>ชนิดกีฬา</label>
            <select name="category" onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }}>
              <option value="Football">ฟุตบอล</option>
              <option value="Badminton">แบดมินตัน</option>
              <option value="Basketball">บาสเกตบอล</option>
              <option value="Running">วิ่ง</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 'bold', color: 'var(--color-neutral)' }}>รับกี่คน</label>
            <input type="number" name="maxParticipants" required onChange={handleChange} min="2" placeholder="เช่น 10" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
          </div>
        </div>

        {/* ปุ่มสร้างตี้ ใช้สีส้ม Secondary จาก Figma! */}
        <button type="submit" style={{ width: '100%', padding: '15px', marginTop: '10px', backgroundColor: 'var(--color-secondary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          สร้างตี้เลย!
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;