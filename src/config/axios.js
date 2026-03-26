import axios from 'axios';

// ตั้งค่าให้ยิงไปที่พอร์ต 8000 ของหลังบ้านเราเสมอ
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default axiosInstance;