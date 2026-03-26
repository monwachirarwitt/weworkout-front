import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // สร้างกระปุก (State) เอาไว้เก็บรายการตี้ที่ดึงมาจากหลังบ้าน
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // เอาไว้ทำสถานะโหลดหมุนๆ

  // useEffect จะทำงานอัตโนมัติ 1 ครั้ง ตอนที่เราเปิดเข้ามาหน้านี้
  useEffect(() => {
    // ถ้าไม่มี Token ให้เตะกลับไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

    // ฟังก์ชันยิง API ไปดึงข้อมูลตี้
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/event', {
          // สำคัญมาก! ต้องแนบ Token ส่งไปให้หลังบ้านด้วย ไม่งั้นจะโดนเตะออกมา (401 Unauthorized)
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        // เอาข้อมูลตี้ที่ได้ ยัดลงกระปุก setEvents
        setEvents(response.data.events);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      } finally {
        setLoading(false); // โหลดเสร็จแล้ว ปิดตัวหมุนๆ
      }
    };

    fetchEvents();
  }, [navigate, token]);
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🏠 หน้า Feed: รวมตี้กีฬา</h2>
      </div>
      <hr />

      {/* ส่วนแสดงผลรายการตี้ */}
      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล... ⏳</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {events.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'gray' }}>ยังไม่มีตี้กีฬาในระบบตอนนี้ครับ ไปสร้างกันเถอะ!</p>
          ) : (
            // เอาข้อมูลตี้มาวนลูป (map) สร้างเป็นการ์ดทีละใบ
            events.map((event) => (
              <div key={event.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>{event.title}</h3>
                <p style={{ margin: '5px 0' }}><strong>📍 สถานที่:</strong> {event.locationName}</p>
                <p style={{ margin: '5px 0' }}><strong>🗓️ วันที่:</strong> {new Date(event.eventDate).toLocaleDateString('th-TH')}</p>
                <p style={{ margin: '5px 0' }}><strong>⏰ เวลา:</strong> {event.startTime} - {event.endTime}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                  <span style={{ color: 'gray', fontSize: '14px' }}>สร้างโดย: {event.host.name}</span>
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>คนจอย: {event._count.participants} / {event.maxParticipants}</span>
                </div>
                
                {/* 💥 ปุ่มดูรายละเอียดตี้ที่เพิ่มเข้ามาใหม่ 💥 */}
                <button 
                  onClick={() => navigate(`/event/${event.id}`)} 
                  style={{ width: '100%', padding: '10px', marginTop: '15px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ดูรายละเอียดตี้
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Home;