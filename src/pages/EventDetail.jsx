import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import useAuthStore from '../store/authStore'; // 💥 1. อิมพอร์ต Store ของเรามาใช้

function EventDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // 💥 2. ดึง token และ user ออกมาจาก Zustand 
  // (ไม่ต้องมานั่งใช้ atob() ถอดรหัสหา ID อีกต่อไป!)
  const { token, user: currentUser } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ถ้าไม่มี Token ให้เตะกลับไปหน้า Login
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const eventRes = await axios.get(`/event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setEvent(eventRes.data);

        const commentRes = await axios.get(`/event/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } });
        setComments(commentRes.data);
      } catch (error) {
        console.error('Fetch data failed:', error);
      } finally {
        setLoading(false);
      }
    };
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

  // ฟังก์ชันส่งข้อความแชท
  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(`/event/${id}/comments`, { message: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setNewComment(''); 
      window.location.reload(); 
    } catch (error) {
      alert('❌ Failed to send comment: ' + (error.response?.data?.error || error.message));
    }
  };

  // ฟังก์ชันสำหรับ Host เอาไว้เตะหรือรับคนเข้าตี้
  const handleManageParticipant = async (participantId, status) => {
    try {
      await axios.put(`/event/${id}/participants/${participantId}`, 
        { status: status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); 
    } catch (error) {
      alert('❌ Failed to update status: ' + (error.response?.data?.error || error.message));
    }
  };

  // 💥 3. ฟังก์ชันสำหรับลบตี้ (Delete Activity)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this activity? This cannot be undone.")) {
      try {
        await axios.delete(`/event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        alert('🗑️ Activity deleted successfully!');
        navigate('/'); // ลบเสร็จแล้วเด้งกลับหน้า Feed หลัก
      } catch (error) {
        alert('❌ Failed to delete: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  // ฟังก์ชันสุ่มรูปปก (เหมือนในหน้าอื่นๆ)
  const getCoverImage = (category) => {
    switch(category) {
      case 'Football': return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop';
      case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop';
      case 'Running': return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop';
      case 'Fitness': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
    }
  };

  // ----------------------------------------------------------------------
  // โซนแสดงผล (UI)
  // ----------------------------------------------------------------------

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
      <div className="w-full h-64 md:h-80 relative">
        <img src={event.imgEvent || getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        
        {/* ปุ่ม Back มุมซ้ายบน */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 md:left-12 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full font-bold text-on-surface-variant hover:bg-white transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 คอลัมน์ซ้าย (70%): รายละเอียดหลัก + คอมเมนต์แชท */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: รายละเอียดของตี้ (Detail Card) */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black text-xs uppercase tracking-widest rounded-full">
                {event.category}
              </div>

              {/* 💥 ปุ่ม Delete โชว์ตรงนี้เลยครับ (ใช้สีแดงมาตรฐานของ Tailwind ให้เห็นชัวร์ๆ) */}
              {isHost && (
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase transition-all shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">delete</span> Delete Activity
                </button>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-headline font-black text-on-background mb-6 leading-tight">
              {event.title}
            </h1>
            
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <span className="material-symbols-outlined text-2xl">calendar_month</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="font-bold text-on-background">{new Date(event.eventDate).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{event.startTime} - {event.endTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Location</p>
                  <p className="font-bold text-on-background line-clamp-1">{event.locationName}</p>
                  <a href={event.locationUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1 mt-1">
                    View on Map <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

            {/* โชว์ปุ่ม Join เฉพาะคนที่ไม่ใช่ Host */}
            {!isHost && (
              <button 
                onClick={handleJoin}
                className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Join Activity
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            )}
          </div>

          {/* Card 2: โซนแชทคอมเมนต์ (Discussion Board) */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col h-[500px]">
            <h2 className="text-2xl font-headline font-black text-on-background mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">forum</span> Discussion Board
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
              {/*ถ้า comments ว่างเปล่า (ความยาวเป็น 0) มันจะแสดงไอคอนรูปคำพูดพร้อมข้อความว่า "No messages yet. Start the conversation!" เพื่อบอกผู้ใช้ว่ายังไม่มีใครพิมพ์อะไรเลย */}
              {comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
                  <p className="font-medium">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                
                comments.map(c => (
                                                  //(คนพิมพ์ใช่ตัวเราไหม? ถ้าใช่ให้อยู่ท้าย ถ้าไม่ให้อยู่ขวา)
                  <div key={c.id} className={`flex ${c.user.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${c.user.id === currentUser?.id ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container-low text-on-background rounded-bl-none border border-outline-variant/20'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${c.user.id === currentUser?.id ? 'text-white/80' : 'text-primary'}`}>
                          {c.user.name} {c.user.id === event.hostId && '(Host)'}
                        </span>
                        <span className="text-[10px] opacity-70">
                          {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm md:text-base leading-relaxed">{c.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-3 relative">
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                className="w-full bg-surface-container-low border-none rounded-full px-6 py-4 pr-16 focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px] ml-1">send</span>
              </button>
            </form>
          </div>

        </div>

        {/* 🟢 คอลัมน์ขวา (30%): โฮสต์ + ลูกตี้ */}

        <div className="space-y-8">
          
          {/* Host Card */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary to-primary-container"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-lowest p-1 mb-3">
                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
                  {event.host?.name?.charAt(0) || 'H'}
                </div>
              </div>
              <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Event Host</p>
              <h3 className="text-xl font-headline font-black text-on-background">{event.host?.name}</h3>
              {isHost && (
                <span className="inline-block mt-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  It's You!
                </span>
              )}
            </div>
          </div>

          {/* Participants Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-black text-lg text-on-background">Participants</h3>
              <span className="bg-surface-container-low text-primary text-xs font-bold px-3 py-1 rounded-full">
                {event.participants?.length || 0} / {event.maxParticipants}
              </span>
            </div>

            {event.participants?.length === 0 ? (
              <p className="text-center text-sm font-medium text-outline italic py-6">No participants yet.</p>
            ) : (
              <ul className="space-y-3">
                {event.participants.map(p => (
                  <li key={p.id} className="flex flex-col bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                          {p.user?.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-sm text-on-background line-clamp-1">{p.user?.name}</span>
                      </div>
                      
                      {/* ป้ายบอกสถานะ */}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                        p.status === 'ACCEPTED' ? 'bg-tertiary-fixed-dim text-on-tertiary-container' : 
                        p.status === 'REJECTED' ? 'bg-error-container text-error' : 
                        'bg-secondary-fixed text-on-secondary-fixed-variant'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    {/* 💥 โซนพลังอำนาจ: ถ้าเราเป็น Host และลูกตี้คนนี้ยัง PENDING อยู่ จะโชว์ปุ่มให้กดยอมรับ/ปฏิเสธ */}
                    {isHost && p.status === 'PENDING' && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-outline-variant/10">
                        <button 
                          onClick={() => handleManageParticipant(p.userId || p.user.id, 'ACCEPTED')} 
                          className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1f5021] transition-colors shadow-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleManageParticipant(p.userId || p.user.id, 'REJECTED')} 
                          className="flex-1 bg-red-500 text-on-surface py-1.5 rounded-lg text-xs font-bold hover:bg-error hover:text-white transition-colors shadow-sm"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default EventDetail;