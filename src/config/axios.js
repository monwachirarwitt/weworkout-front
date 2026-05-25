import axios from 'axios';

// ตั้งค่าให้ยิงไปที่พอร์ต 8000 ของหลังบ้านเราเสมอ
const axiosInstance = axios.create({
  baseURL: 'https://weworkout-back.onrender.com/api',
});

// แนบ Token ไปกับ Header อัตโนมัติเวลาคุยกับหลังบ้าน (ตามที่โค้ดส่วนอื่นสมมติไว้)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;