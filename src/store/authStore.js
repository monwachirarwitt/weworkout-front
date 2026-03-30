import { create } from 'zustand';
import axios from '../config/axios';

const useAuthStore = create((set, get) => ({
  // 1. ตัวแปร State ที่เราจะเก็บไว้ตรงกลาง
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false, // เอาไว้บอกว่ากำลังดึงข้อมูลอยู่ไหม

  // 2. Action: ฟังก์ชันตอน Login
  login: (token) => {
    localStorage.setItem('token', token);
    set({ token });
    get().fetchMe(); // พอได้ Token ปุ๊บ สั่งดึงข้อมูล User ทันที
  },

  // 3. Action: ฟังก์ชันตอน Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // 4. Action: ฟังก์ชันดึงข้อมูล Profile (ตัวตายตัวแทนของ useEffect)
  fetchMe: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get('/auth/me');
      const userData = response.data.user ? response.data.user : response.data;
      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("❌ Fetch Profile Error:", error);
      // ถ้า Token หมดอายุ หรือ API พัง ให้เตะออกเลย
      get().logout(); 
      set({ isLoading: false });
    }
  },

  // 5. Action: เอาไว้อัปเดต State ในเครื่อง (เช่น ตอนเปลี่ยนรูปเสร็จ จะได้ไม่ต้องโหลด API ใหม่)
  updateUser: (newData) => {
    set((state) => ({ user: { ...state.user, ...newData } }));
  }
}));

export default useAuthStore;