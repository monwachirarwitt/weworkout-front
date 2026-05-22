import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store ของเรามาใช้
import { io } from 'socket.io-client';

import EventBanner from '../components/EventDetail/EventBanner';
import EventInfoCard from '../components/EventDetail/EventInfoCard';
import DiscussionBoard from '../components/EventDetail/DiscussionBoard';
import EventHostCard from '../components/EventDetail/EventHostCard';
import EventParticipantsCard from '../components/EventDetail/EventParticipantsCard';

function EventDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  //  2. ดึง token และ user ออกมาจาก Zustand 
  const { token, user: currentUser } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [loading, setLoading] = useState(true);

  // ตั้งค่า Socket.IO เมื่อเข้ามาที่หน้านี้
  useEffect(() => {
    if (!id) return;

    const socket = io('http://localhost:8000');

    // เมื่อเชื่อมต่อสำเร็จ ให้ส่งคำขอเข้าห้องแชทของ Event นี้
    socket.on('connect', () => {
      socket.emit('join_room', id);
    });

    // รอรับข้อความใหม่
    socket.on('new_comment', (newCommentData) => {
      // เอาคอมเมนต์ใหม่ไปต่อท้ายคอมเมนต์เดิมที่มีอยู่
      setComments((prevComments) => [...prevComments, newCommentData]);
    });

    // ตัดการเชื่อมต่อเมื่อออกจากหน้านี้
    return () => {
      socket.disconnect();
    };
  }, [id]);

  //พอหน้าจอวาดเสร็จปุ๊บ โค้ดชุดนี้จะทำงานทันทีเพื่อเช็กว่า "เฮ้ย! คนที่เข้ามาเนี่ย มีบัตรผ่าน (Token) หรือเปล่า?"
  useEffect(() => {
    // ถ้าไม่มี Token ให้เตะกลับไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

// สร้างฟังก์ชันแบบ Asynchronous เพื่อจัดการการดึงข้อมูลจาก API
    const fetchData = async () => {
      try {
        // 1. ดึงข้อมูลรายละเอียดของ Event (ใช้ id จาก URL หรือ State)
        // มีการส่ง Header 'Authorization' พร้อม Token (JWT) เพื่อยืนยันสิทธิ์เข้าถึงข้อมูล
        const eventRes = await axios.get(`/event/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        // เมื่อได้ข้อมูลมาแล้ว (response.data) ก็นำไปเก็บไว้ใน State ชื่อ event
        setEvent(eventRes.data);

        // 2. ดึงข้อมูลคอมเมนต์ที่เกี่ยวข้องกับ Event นี้
        const commentRes = await axios.get(`/event/${id}/comments`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        // นำข้อมูลคอมเมนต์ไปเก็บไว้ใน State ชื่อ comments
        setComments(commentRes.data);

      } catch (error) {
        // หากเกิด Error ระหว่างดึงข้อมูล (เช่น Token หมดอายุ หรือหาข้อมูลไม่เจอ) ให้แสดง Error ใน Console
        console.error('Fetch data failed:', error);
      } finally {
        // ไม่ว่าจะสำเร็จหรือพัง ให้ปิดสถานะ Loading (เพื่อให้หน้าจอหยุดแสดงไอคอนหมุนๆ)
        setLoading(false);
      }
    };

    // เรียกใช้งานฟังก์ชันที่เขียนไว้ข้างบน
    fetchData();
  }, [id, token, navigate]);

  // ฟังก์ชันกดเข้าร่วมตี้
  const handleJoin = async () => {
    try {
      await axios.post(`/event/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('🎉 Request sent successfully! Waiting for host approval.');
      window.location.reload(); 
    } catch (error) {
      alert('❌ Failed to join: ' + (error.response?.data?.error || error.message));
    }
  };

// ฟังก์ชันสำหรับจัดการการส่งข้อความแชท/คอมเมนต์
  const handleSendComment = async (e) => {
    // 🛑 เบรกบราวเซอร์ไว้ก่อน! 
    // ปกติพอกด Submit Form บราวเซอร์จะรีเฟรชหน้าเว็บทิ้ง (Default Behavior)
    // เราสั่ง e.preventDefault() เพื่อบอกว่า "ไม่ต้องรีเฟรชหน้า" ให้หยุดรออยู่ที่หน้าเดิม 
    // เพื่อให้โค้ด JavaScript (Axios) ด้านล่างรันต่อจนจบ
    e.preventDefault(); 

    // ตรวจสอบความว่างเปล่า: ถ้าไม่ได้พิมพ์อะไรมาเลย หรือพิมพ์แค่ช่องว่าง (Space) ก็ไม่ต้องทำอะไรต่อ
    if (!newComment.trim()) return;

    try {
      // ยิง API ไปที่หลังบ้านเพื่อบันทึกคอมเมนต์ลง Database
      // ส่ง Object { message: newComment } ไปใน Body 
      // และแนบบัตรผ่าน (Token) ไปใน Header เพื่อยืนยันตัวตน
      await axios.post(`/event/${id}/comments`, 
        { message: newComment }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // เมื่อส่งสำเร็จ: ล้างช่องพิมพ์ให้ว่างเปล่าเหมือนเดิม เตรียมพร้อมรับข้อความถัดไป
      setNewComment(''); 

    } catch (error) {
      // หากส่งไม่สำเร็จ (เช่น เน็ตหลุด หรือ Token หมดอายุ) ให้แจ้งเตือน Error
      alert('❌ Failed to send comment: ' + (error.response?.data?.error || error.message));
    }
  };


// ฟังก์ชันสำหรับเจ้าของตี้ (Host) ใช้จัดการสถานะของคนที่มาขอเข้าร่วม
  // รับพารามิเตอร์ 2 ตัวคือ: ID ของคนที่จะจัดการ และ สถานะใหม่ (เช่น 'ACCEPTED' หรือ 'REJECTED')
  const handleManageParticipant = async (participantId, status) => {
    try {
      // ยิง API แบบ PUT เพื่อไปแก้ไขข้อมูลสมาชิกในตี้ (Update)
      // ส่งสถานะใหม่ { status: status } ไปที่ URL เฉพาะของสมาชิกคนนั้น
      await axios.put(`/event/${id}/participants/${participantId}`, 
        { status: status }, 
        { headers: { Authorization: `Bearer ${token}` } } // ยืนยันว่าเราคือ Host ที่มีสิทธิ์สั่งการ
      );

      // เมื่ออัปเดตสถานะสำเร็จ (เช่น กด Accept ปุ๊บ)
      // ให้รีเฟรชหน้าเว็บเพื่อให้เห็นสถานะล่าสุดในรายการ Participants
      window.location.reload(); 

    } catch (error) {
      // หากเกิดข้อผิดพลาด (เช่น เราไม่ใช่เจ้าของตี้ หรือหลังบ้านมีปัญหา)
      // ให้โชว์ Alert บอก Error ที่ส่งกลับมาจาก Server
      alert('❌ Failed to update status: ' + (error.response?.data?.error || error.message));
    }
  };

// 💥 ฟังก์ชันสำหรับเจ้าของตี้ (Host) ใช้ลบกิจกรรมทิ้งถาวร
  const handleDelete = async () => {
    // ✋ ขั้นตอนที่ 1: เช็คซ้ำเพื่อความชัวร์ (Confirmation)
    // ใช้ window.confirm เพื่อเด้ง Pop-up ถามผู้ใช้ก่อน เพราะถ้าลบแล้วข้อมูลใน Database จะหายถาวร (Undo ไม่ได้)
    // ถ้าผู้ใช้กด "OK" เงื่อนไขจะเป็น true และเริ่มทำงานใน try
    if (window.confirm("Are you sure you want to delete this activity? This cannot be undone.")) {
      try {
        // 🚀 ขั้นตอนที่ 2: ส่งคำสั่งลบไปยัง Backend
        // ใช้ axios.delete และแนบ id ของกิจกรรมที่ต้องการลบไปใน URL
        // พร้อมส่ง Header Authorization (Token) เพื่อพิสูจน์ว่า "เราคือเจ้าของตี้ตัวจริง" ถึงจะมีสิทธิ์ลบ
        await axios.delete(`/event/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        // 🎊 ขั้นตอนที่ 3: แจ้งเตือนเมื่อลบสำเร็จ
        alert('🗑️ Activity deleted successfully!');

        // 🏠 ขั้นตอนที่ 4: พาย้ายบ้าน
        // พอดึงข้อมูลหน้านี้ไม่ได้แล้ว (เพราะโดนลบไปแล้ว) เราจึงต้องใช้ navigate('/') 
        // เพื่อพาผู้ใช้เด้งกลับไปที่หน้า Feed หลัก (Home) ทันที
        navigate('/'); 

      } catch (error) {
        // ❌ หากเกิดข้อผิดพลาด (เช่น ไม่ใช่เจ้าของตี้ หรือ Server มีปัญหา) ให้แจ้งเตือน Error
        alert('❌ Failed to delete: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // โซนแสดงผล (UI)

  // หน้าโหลดข้อมูล
  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body">
      <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
      <p className="text-xl font-bold text-on-surface-variant">Loading Activity...</p>
    </div>
  );

  // กรณีหาตี้ไม่เจอ (บั๊ก หรือโดนลบไปแล้ว)
  if (!event) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body">
      <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <p className="text-xl font-bold text-on-surface">Activity Not Found</p>
      <button onClick={() => navigate(-1)} className="mt-6 text-primary font-bold hover:underline">Go Back</button>
    </div>
  );

  // 💥 เช็คสิทธิ์ความยิ่งใหญ่: ตัวเราคือ Host ของตี้นี้ใช่หรือไม่?
  // (แอบเช็คชื่อด้วย เผื่อกรณีที่ระบบมีปัญหาดึง ID มาไม่ครบ)
  const isHost = event.hostId === currentUser?.id || event.host?.id === currentUser?.id || event.host?.name === currentUser?.name;

  return (
    <div className="min-h-screen bg-surface-container-low font-body pb-20">
      
      {/* 🖼️ Cover Image Section (รูปแบนเนอร์ด้านบน) */}
      <EventBanner event={event} onBack={() => navigate(-1)} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 คอลัมน์ซ้าย (70%): รายละเอียดหลัก + คอมเมนต์แชท */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: รายละเอียดของตี้ (Detail Card) */}
          <EventInfoCard 
            event={event} 
            isHost={isHost} 
            onDelete={handleDelete} 
            onJoin={handleJoin} 
          />

          {/* Card 2: โซนแชทคอมเมนต์ (Discussion Board) */}
          <DiscussionBoard 
            comments={comments}
            currentUser={currentUser}
            eventHostId={event.host?.id || event.hostId}
            newComment={newComment}
            setNewComment={setNewComment}
            onSendComment={handleSendComment}
          />

        </div>

        {/* 🟢 คอลัมน์ขวา (30%): โฮสต์ + ลูกตี้ */}
        <div className="space-y-8">
          
          {/* Host Card */}
          <EventHostCard 
            host={event.host} 
            isHost={isHost} 
          />

          {/* Participants Card */}
          <EventParticipantsCard 
            participants={event.participants}
            maxParticipants={event.maxParticipants}
            isHost={isHost}
            onManageParticipant={handleManageParticipant}
          />

        </div>

      </div>
    </div>
  );
}

export default EventDetail;