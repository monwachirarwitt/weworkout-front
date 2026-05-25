import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authApi from '../api/authApi';
import useAuthStore from '../store/authStore';

function Login() {
  // --- [STATE MANAGEMENT] ---
  const [email, setEmail] = useState('');      // เก็บค่าอีเมลที่ผู้ใช้พิมพ์
  const [password, setPassword] = useState(''); // เก็บค่ารหัสผ่านที่ผู้ใช้พิมพ์
  const [error, setError] = useState('');        // เก็บข้อความแสดงข้อผิดพลาดถ้า Login ไม่ผ่าน
  const navigate = useNavigate();               // ฟังก์ชันสำหรับเปลี่ยนหน้า (Redirect)

  // ดึงฟังก์ชัน login มาจาก Zustand Store เพื่อบันทึก Token ลงระบบส่วนกลาง
  const login = useAuthStore((state) => state.login);

  // --- [EVENT HANDLER] ---
  const handleLogin = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้ Browser รีเฟรชหน้าจอตอนกดปุ่ม Submit
    setError('');       // ล้างข้อความ Error เดิมทิ้งก่อนเริ่มตรวจสอบใหม่

    try {
      // ส่งคำขอ Login ไปที่ API Backend
      const response = await authApi.login(email, password);

      // เมื่อสำเร็จ: เรียกฟังก์ชัน login(token) เพื่อเก็บ Token เข้า Store และ LocalStorage
      login(response.data.token);

      // เมื่อบันทึกสำเร็จ: ส่งผู้ใช้ไปที่หน้า Find Activities ทันที
      navigate('/activities');
    } catch (error) {
      // เมื่อล้มเหลว: ดึงข้อความ Error จากฝั่ง Server มาแสดงผล
      setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    // คอนเทนเนอร์หลัก: จัดกึ่งกลางหน้าจอ และใช้ Font/Color ตามธีมที่ตั้งไว้
    <div className="bg-background font-body text-on-background min-h-screen flex items-center justify-center p-6 relative z-10 overflow-hidden">

      {/* --- [DECORATION: แสงฟุ้งด้านหลัง] --- */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-432 flex items-center justify-center">
        {/* ใช้ Grid 12 คอลัมน์: หน้าจอคอมแบ่ง 7:5, หน้าจอมือถือยืดเต็ม */}
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl items-center gap-12">

          {/* --- [LEFT SIDE: ฝั่งข้อมูลและรูปภาพ (โชว์เฉพาะจอใหญ่)] --- */}
          <div className="hidden lg:flex lg:col-span-7 flex-col pr-12 relative z-10">
            {/* Logo & Brand Name */}
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-primary p-3 rounded-xl">
                <span className="material-symbols-outlined text-white text-3xl">fitness_center</span>
              </div>
              <span className="font-headline font-black text-3xl text-primary-container tracking-tight">WeWorkout</span>
            </div>

            <h1 className="font-headline font-extrabold text-6xl text-on-background leading-tight mb-8">
              Are you ready <span className="text-primary">to exercise with your new friends?</span>
            </h1>
            {/* ส่วนแสดงรูปภาพและ Metrics เสมือนจริง */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10 bg-surface-container-lowest">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Athlete"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"
              />
              {/* แผงข้อมูลที่ลอยอยู่บนรูปภาพ (Glassmorphism Effect) */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/50 via-black/10 to-transparent">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-lg bg-surface-container-lowest/10 backdrop-blur-[6px] p-6 rounded-3xl border border-white/10">
                  {/* กล่องข้อมูลย่อยต่างๆ */}
                  <div className="flex items-center gap-4 group">
                    <div className="bg-surface-container-low p-4 rounded-xl shadow-inner"><span className="material-symbols-outlined text-primary text-3xl">health_metrics</span></div>
                    <div><span className="font-bold text-lg text-white">Metrics</span></div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="bg-surface-container-low p-4 rounded-xl shadow-inner"><span className="material-symbols-outlined text-primary text-3xl">calendar_today</span></div>
                    <div><span className="font-bold text-lg text-white">Programs</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- [RIGHT SIDE: การ์ดฟอร์มล็อกอิน] --- */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="bg-surface-container-lowest p-10 md:p-14 rounded-[2rem] shadow-xl w-full max-w-md border border-outline-variant/10">

              {/* หัวข้อฟอร์ม */}
              <div className="mb-10 text-center lg:text-left">
                <h2 className="font-headline font-bold text-3xl text-on-background mb-2">Ready to move?</h2>
                <p className="text-on-surface-variant font-medium">Log in to continue your journey.</p>
              </div>

              {/* ฟอร์มรับข้อมูล */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Input สำหรับ Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // ผูกข้อมูลเข้ากับ State
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background"
                      placeholder="name@weworkout.com"
                      required
                    />
                  </div>
                </div>

                {/* Input สำหรับ Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-sm font-bold text-on-surface-variant" htmlFor="password">Password</label>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // ผูกข้อมูลเข้ากับ State
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* ส่วนแสดง Error (จะโชว์เฉพาะเมื่อมีข้อผิดพลาด) */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm text-center font-bold">
                    {error}
                  </div>
                )}

                {/* ปุ่มกด Submit */}
                <button type="submit" className="w-full bg-gradient-to-r from-secondary to-[#fe6f42] text-white font-headline font-bold py-5 rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                  Log In
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>

              {/* เส้นแบ่ง "หรือ" */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-bold"><span className="bg-surface-container-lowest px-4 text-outline">or</span></div>
              </div>

              {/* ลิงก์ไปหน้าสมัครสมาชิก */}
              <div className="mt-6 text-center">
                <p className="text-on-surface-variant font-medium">
                  Don't have an account?
                  <Link to="/register" className="text-secondary font-bold hover:underline ml-2">Sign up</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;