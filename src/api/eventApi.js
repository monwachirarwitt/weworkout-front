import axios from '../config/axios';

/**
 * Event API
 * รวม function ทุกอย่างที่เกี่ยวกับ Event / Activity
 */

// ดึงรายการ event ทั้งหมด
export const getEvents = () => {
  return axios.get('/event');
};

// ดึงข้อมูล event เดียว
export const getEvent = (id) => {
  return axios.get(`/event/${id}`);
};

// สร้าง event ใหม่
export const createEvent = (payload) => {
  return axios.post('/event', payload);
};

// เข้าร่วม event
export const joinEvent = (id) => {
  return axios.post(`/event/${id}/join`, {});
};

// ลบ event
export const deleteEvent = (id) => {
  return axios.delete(`/event/${id}`);
};

// จัดการสถานะ participant (approve/reject)
export const manageParticipant = (eventId, participantId, status) => {
  return axios.put(`/event/${eventId}/participants/${participantId}`, { status });
};

// ดึง comments ของ event
export const getComments = (eventId) => {
  return axios.get(`/event/${eventId}/comments`);
};

// ส่ง comment ใหม่
export const addComment = (eventId, message) => {
  return axios.post(`/event/${eventId}/comments`, { message });
};
