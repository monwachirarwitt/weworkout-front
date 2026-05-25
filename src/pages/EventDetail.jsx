import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as eventApi from '../api/eventApi';
import useAuthStore from '../store/authStore';
import { io } from 'socket.io-client';

import EventBanner from '../components/EventDetail/EventBanner';
import EventInfoCard from '../components/EventDetail/EventInfoCard';
import DiscussionBoard from '../components/EventDetail/DiscussionBoard';
import EventHostCard from '../components/EventDetail/EventHostCard';
import EventParticipantsCard from '../components/EventDetail/EventParticipantsCard';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user: currentUser } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const socket = io(apiUrl);

    socket.on('connect', () => {
      socket.emit('join_room', id);
    });

    socket.on('new_comment', (newCommentData) => {
      setComments((prevComments) => [...prevComments, newCommentData]);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const eventRes = await eventApi.getEvent(id);
        setEvent(eventRes.data);

        const commentRes = await eventApi.getComments(id);
        setComments(commentRes.data);

      } catch (error) {
        console.error('Fetch data failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleJoin = async () => {
    try {
      await eventApi.joinEvent(id);
      alert('🎉 Request sent successfully! Waiting for host approval.');
      window.location.reload();
    } catch (error) {
      alert('❌ Failed to join: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await eventApi.addComment(id, newComment);
      setNewComment('');
    } catch (error) {
      alert('❌ Failed to send comment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleManageParticipant = async (participantId, status) => {
    try {
      await eventApi.manageParticipant(id, participantId, status);
      window.location.reload();
    } catch (error) {
      alert('❌ Failed to update status: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this activity? This cannot be undone.")) {
      try {
        await eventApi.deleteEvent(id);
        alert('🗑️ Activity deleted successfully!');
        navigate('/');
      } catch (error) {
        alert('❌ Failed to delete: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body">
      <span className="material-symbols-outlined animate-spin text-5xl text-primary mb-4">sync</span>
      <p className="text-xl font-bold text-on-surface-variant">Loading Activity...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-body">
      <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <p className="text-xl font-bold text-on-surface">Activity Not Found</p>
      <button onClick={() => navigate(-1)} className="mt-6 text-primary font-bold hover:underline">Go Back</button>
    </div>
  );

  const isHost = event.hostId === currentUser?.id || event.host?.id === currentUser?.id || event.host?.name === currentUser?.name;

  return (
    // เปลี่ยนพื้นหลังให้สว่างขึ้นนิดนึง (ใช้สีฟ้าอ่อนๆ หรือสีพื้นเว็บคุณ) เพื่อให้การ์ดสีขาวลอยเด่นขึ้นมา
    <div className="min-h-screen bg-[#F0F8FF] font-body pb-28 md:pb-20">

      {/* 🖼️ Cover Image Section */}
      <EventBanner event={event} onBack={() => navigate(-1)} />

      {/* 
        📱 โซนตั้งค่า Mobile-First (แบ่งเลเยอร์ชัดเจน ไม่เบลอ)
        - -mt-16 : ดึงการ์ดขึ้นมาซ้อนรูปภาพในหน้าจอมือถือ (ระยะกำลังสวย)
        - lg:-mt-24 : ดึงเพิ่มในจอคอม
        - z-20 : ดันเลเยอร์นี้ให้อยู่หน้าสุดเสมอ บังส่วนเงาของรูปภาพ
        - flex flex-col lg:grid : มือถือเรียงลงมาตรงๆ / จอคอมแยกเป็น 3 คอลัมน์
      */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 lg:-mt-24 relative z-20 flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">

        {/* 🟢 คอลัมน์ซ้าย (เนื้อหาหลัก) */}
        {/* ใช้ flex-col และ gap-6 สำหรับมือถือ แทน space-y เพื่อให้ช่องไฟเป๊ะขึ้น */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">

          <EventInfoCard
            event={event}
            isHost={isHost}
            onDelete={handleDelete}
            onJoin={handleJoin}
          />

          <DiscussionBoard
            comments={comments}
            currentUser={currentUser}
            eventHostId={event.host?.id || event.hostId}
            newComment={newComment}
            setNewComment={setNewComment}
            onSendComment={handleSendComment}
          />

        </div>

        {/* 🟢 คอลัมน์ขวา (Host & Participants) */}
        {/* ในมือถือจะเรียงต่อลงมาด้านล่างสุด */}
        <div className="flex flex-col gap-6 lg:gap-8">

          <EventHostCard
            host={event.host}
            isHost={isHost}
          />

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