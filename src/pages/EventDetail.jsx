import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

function EventDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [loading, setLoading] = useState(true);

  // 🕵️‍♂️ ฟังก์ชันลับ: ถอดรหัส Token ดูว่าเราคือใคร (User ID)
  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.userId; // แกะ ID ของเราออกมาจากกระเป๋า
    } catch (e) {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await axios.get(`/event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setEvent(eventRes.data);

        const commentRes = await axios.get(`/event/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } });
        setComments(commentRes.data);
      } catch (error) {
        console.error('ดึงข้อมูลไม่สำเร็จ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleJoin = async () => {
    try {
      await axios.post(`/event/${id}/join`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('ส่งคำขอเข้าร่วมสำเร็จ! รอ Host อนุมัตินะครับ 🎉');
      window.location.reload(); 
    } catch (error) {
      alert('❌ กดจอยไม่ได้: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(`/event/${id}/comments`, { message: newComment }, { headers: { Authorization: `Bearer ${token}` } });
      setNewComment(''); 
      window.location.reload(); 
    } catch (error) {
      alert('❌ ส่งคอมเมนต์ไม่ได้: ' + (error.response?.data?.error || error.message));
    }
  };

  // 💥 ฟังก์ชันใหม่: กดยอมรับ หรือ ปฏิเสธ ลูกตี้
  const handleManageParticipant = async (participantId, status) => {
    try {
      // ยิง API ไปอัปเดตสถานะ (ACCEPTED หรือ REJECTED)
      // 💡 หมายเหตุ: สมมติว่า Path หลังบ้านเราคือ /event/:id/participants/:participantId
      await axios.put(`/event/${id}/participants/${participantId}`, 
        { status: status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); // รีเฟรชเพื่อโชว์สถานะใหม่
    } catch (error) {
      alert('❌ อัปเดตไม่สำเร็จ: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล... ⏳</p>;
  if (!event) return <p style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>❌ ไม่พบข้อมูลตี้</p>;

  // เช็กว่าคนที่ล็อกอินอยู่ คือ Host ของตี้นี้ใช่หรือไม่?
  const isHost = event.hostId === currentUserId || event.host.id === currentUserId;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', paddingBottom: '50px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
        ⬅️ กลับหน้า Feed
      </button>

      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
        <h2 style={{ color: '#00A693', marginTop: '0' }}>{event.title}</h2>
        <p style={{ color: '#555', lineHeight: '1.6' }}>{event.description}</p>
        <hr style={{ margin: '20px 0', borderTop: '1px solid #eee' }} />
        <p><strong>📍 สถานที่:</strong> <a href={event.locationUrl} target="_blank" rel="noreferrer" style={{ color: '#00A693' }}>{event.locationName}</a></p>
        <p><strong>🗓️ วันที่:</strong> {new Date(event.eventDate).toLocaleDateString('th-TH')}</p>
        <p><strong>⏰ เวลา:</strong> {event.startTime} - {event.endTime}</p>
        
        {/* ซ่อนปุ่มจอย ถ้าเราเป็น Host เอง */}
        {!isHost && (
          <button 
            onClick={handleJoin}
            style={{ width: '100%', padding: '12px', marginTop: '20px', backgroundColor: '#FF7043', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
            ✋ กดขอเข้าร่วมตี้นี้
          </button>
        )}
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', borderLeft: '4px solid #00A693' }}>
          <h3 style={{ margin: '0 0 5px 0' }}>👑 ผู้จัด (Host)</h3>
          <p style={{ margin: '0', fontWeight: 'bold' }}>{event.host.name} {isHost && <span style={{ color: '#FF7043', fontSize: '12px' }}>(คุณคือ Host)</span>}</p>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>👥 ผู้เข้าร่วม ({event.participants.length} / {event.maxParticipants})</h3>
          {event.participants.length === 0 ? (
            <p style={{ color: 'gray', fontStyle: 'italic' }}>ยังไม่มีใครจอยตี้เลย...</p>
          ) : (
            <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
              {event.participants.map(p => (
                <li key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                  
                  <div>
                    <strong>{p.user.name}</strong> 
                    <span style={{ marginLeft: '10px', fontSize: '12px', padding: '3px 8px', borderRadius: '12px', backgroundColor: p.status === 'ACCEPTED' ? '#d9f7be' : '#ffe58f', color: p.status === 'ACCEPTED' ? '#389e0d' : '#d48806' }}>
                      {p.status === 'ACCEPTED' ? '✅ อนุมัติ' : '⏳ รอพิจารณา'}
                    </span>
                  </div>

                 {/* 💥 โซนปุ่มอำนาจของ Host 💥 */}
                  {isHost && p.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {/* เปลี่ยนตรงวงเล็บเป็น p.userId || p.user.id ครับ */}
                      <button onClick={() => handleManageParticipant(p.userId || p.user.id, 'ACCEPTED')} style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        รับเข้าตี้
                      </button>
                      <button onClick={() => handleManageParticipant(p.userId || p.user.id, 'REJECTED')} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- ส่วนคอมเมนต์ --- */}
      <div style={{ marginTop: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
        <h3>💬 พูดคุยในตี้ ({comments.length} ข้อความ)</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #eee', borderRadius: '4px' }}>
          {comments.length === 0 ? (
            <p style={{ color: 'gray', textAlign: 'center' }}>ยังไม่มีข้อความ พิมพ์ทักทายเลย!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0' }}>
                <strong style={{ color: '#00A693' }}>{c.user.name}</strong> 
                <span style={{ fontSize: '12px', color: 'gray', marginLeft: '10px' }}>
                  {new Date(c.createdAt).toLocaleTimeString('th-TH')}
                </span>
                <p style={{ margin: '5px 0 0 0' }}>{c.message}</p>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="พิมพ์ข้อความที่นี่..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00A693', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>ส่ง</button>
        </form>
      </div>

    </div>
  );
}

export default EventDetail;