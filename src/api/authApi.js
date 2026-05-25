import axios from '../config/axios';

/**
 * Auth API
 * รวม function ทุกอย่างที่เกี่ยวกับ Authentication
 */

// ล็อกอิน
export const login = (email, password) => {
  return axios.post('/api/auth/login', { email, password });
};

// สมัครสมาชิก
export const register = (name, email, password) => {
  return axios.post('/api/auth/register', { name, email, password });
};

// ดึงข้อมูล user ที่ล็อกอินอยู่
export const getMe = () => {
  return axios.get('/api/auth/me');
};
