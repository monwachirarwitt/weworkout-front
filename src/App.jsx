import { useEffect } from 'react'; // 💥 1. อิมพอร์ต useEffect
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import useAuthStore from './store/authStore'; // 💥 2. อิมพอร์ต Store ของเรามาใช้

function App() {
  // 💥 3. ดึงฟังก์ชัน fetchMe ออกมาจาก Store
  const fetchMe = useAuthStore((state) => state.fetchMe);

  // 💥 4. สั่งให้ fetchMe ทำงานทันทีที่ App โหลดเสร็จครั้งแรก
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return <RouterProvider router={router} />;
}

export default App;