// 📦 1. อิมพอร์ตเครื่องมือสร้าง "โกดังข้อมูล" (Store) จาก Zustand
import { create } from 'zustand';
// 📦 2. อิมพอร์ต axios ที่เราตั้งค่าไว้แล้ว (ตัวที่คอยแนบ Token ไปกับ Header อัตโนมัติเวลาคุยกับหลังบ้าน)
import axios from '../config/axios';

/**
 * 🛠️ การสร้าง Store ด้วย Zustand
 * - เราใช้คำสั่ง `create()` เพื่อสร้างพื้นที่เก็บข้อมูลส่วนกลาง
 * - `set`: คือฟังก์ชันที่เอาไว้ "เปลี่ยน/อัปเดต" ค่าใน Store (เหมือน setState ใน React)
 * - `get`: คือฟังก์ชันที่เอาไว้ "อ่าน/ดึง" ค่าปัจจุบันใน Store ออกมาใช้ในฟังก์ชันอื่นๆ
 */
const useAuthStore = create((set, get) => ({
  
  // ==========================================
  // 🌟 ส่วนที่ 1: ตัวแปรเก็บข้อมูล (State)
  // ==========================================
  
  // user: เก็บข้อมูลโปรไฟล์ของคนที่ล็อกอินอยู่ (เริ่มต้นเป็น null แปลว่ายังไม่มีใครล็อกอิน)
  user: null, 
  
  // token: พยายามงัด Token จากเครื่อง (localStorage) ออกมาตั้งแต่แรก
  // ถ้ามีคนเคยล็อกอินค้างไว้ จะได้จำได้ ไม่ต้องล็อกอินใหม่
  token: localStorage.getItem('token') || null, 
  
  // isLoading: เอาไว้บอกสถานะว่า "กำลังโหลดข้อมูลจากหลังบ้านอยู่ไหม?" (เอาไปทำตัวหมุนๆ โหลดดิ้งได้)
  isLoading: false,

  // ==========================================
  // 🚀 ส่วนที่ 2: ฟังก์ชันสำหรับใช้งาน (Actions)
  // ==========================================

  /**
   * 🔑 ฟังก์ชันล็อกอิน (ถูกเรียกใช้ตอนหน้า Login ยิง API สำเร็จ)
   * @param {string} token - Token ใหม่เอี่ยมที่ได้มาจากหลังบ้าน
   */
  login: (token) => {
    // 1. ฝาก Token ไว้ในเครื่อง (เพื่อให้อยู่ทนแม้จะปิดเว็บ)
    localStorage.setItem('token', token);
    // 2. อัปเดตตัวแปร token ใน Store 
    set({ token });
    // 3. พอได้ Token ปุ๊บ สั่งให้ไปดึงข้อมูล Profile ต่อทันที!
    get().fetchMe(); 
  },

  /**
   * 🚪 ฟังก์ชันล็อกเอาท์ (ล้างไพ่ทั้งหมด)
   */
  logout: () => {
    // 1. ลบ Token และรูปเก่าออกจากเครื่องให้สะอาด
    localStorage.removeItem('token');
    localStorage.removeItem('myProfileImage');
    // 2. เคลียร์ค่า user และ token ใน Store ให้กลับเป็น null
    set({ user: null, token: null });
  },

  /**
   * 📡 ฟังก์ชันดึงข้อมูล User (พระเอกของงานนี้)
   * ทำหน้าที่ไปขอข้อมูลโปรไฟล์ (ชื่อ, รูป, น้ำหนัก) จากหลังบ้านมาเก็บไว้
   */
  fetchMe: async () => {
    // 1. ดึง Token ออกมาจาก Store ดูซิว่ามีไหม
    const { token } = get();
    // ถ้าไม่มี Token ก็แปลว่าไม่ได้ล็อกอิน ให้หยุดการทำงานไปเลย
    if (!token) return;

    // 2. เปิดโหมด Loading แจ้งให้หน้าเว็บรู้ว่ากำลังทำงานนะ
    set({ isLoading: true });
    
    try {
      // 🎯 แผน A: ลองยิง API ไปถามหลังบ้านแบบตรงไปตรงมา
      const response = await axios.get('/auth/me');
      
      // จัดรูปแบบข้อมูล (เผื่อหลังบ้านส่งมาเป็น { user: {...} } หรือส่งแค่ Object ตรงๆ)
      const userData = response.data.user ? response.data.user : response.data;
      
      // เอาข้อมูลที่ได้ไปอัปเดตใส่ตัวแปร user และปิดโหมด Loading
      set({ user: userData, isLoading: false });
      
    } catch (error) {
      console.error("❌ Fetch Profile Error:", error);
      
      // 🛡️ แผน B (Fallback): ถ้าเกิด API พัง หรือ Backend ยังไม่ได้รัน
      // เราจะไม่ยอมให้หน้าเว็บขาวโพลน! เราจะไป "แงะ" เอาข้อมูลจาก Token มาโชว์แก้ขัดไปก่อน
      try {
        // แงะ Payload ออกมาจาก Token (ใช้ atob ถอดรหัส Base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const localImage = localStorage.getItem('myProfileImage'); 
        
        // เอาข้อมูลที่แงะได้ ไปใส่ในตัวแปร user ชั่วคราว
        set({ 
          user: {
            name: payload.name || 'Athletic User',
            role: 'Pro Runner', // ข้อมูลสมมติ เพราะใน DB เรายังไม่มี Role
            profileImageUrl: localImage || payload.profileImageUrl || ''
          }, 
          isLoading: false 
        });
      } catch (e) {
        // 🚨 แผน C (ขั้นสุดยอด): ถ้าแกะ Token ก็ไม่ออก (แปลว่า Token ปลอม, มั่ว, หรือหมดอายุ)
        console.error("❌ Token พัง เตะออกจากระบบ");
        
        // เตะออกจากระบบทันที! สั่งลบข้อมูลทิ้งทั้งหมด
        // (สาเหตุที่เขียนตรงๆ ไม่เรียก get().logout() เพื่อป้องกันปัญหาฟังก์ชันตีกันใน Zustand)
        localStorage.removeItem('token');
        localStorage.removeItem('myProfileImage');
        set({ user: null, token: null, isLoading: false }); 
      }
    }
  },

  /**
   * ✍️ ฟังก์ชันอัปเดตข้อมูล User ในเครื่อง (แบบไม่ต้องยิง API ใหม่)
   * เหมาะสำหรับตอนเปลี่ยนข้อมูลเล็กๆ น้อยๆ แล้วอยากให้หน้าเว็บเปลี่ยนตามทันที
   * @param {object} newData - ข้อมูลใหม่ที่อยากเอาไปอัปเดตทับของเดิม
   */
  updateUser: (newData) => {
    // เอาข้อมูลใหม่ (newData) ไปทับข้อมูลเก่า (...state.user)
    set((state) => ({ user: { ...state.user, ...newData } }));
  }
}));

// ส่งออกเอาไปให้ไฟล์อื่นๆ (เช่น Navbar, Profile) เรียกใช้งาน
export default useAuthStore;