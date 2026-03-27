import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    <div className="bg-background font-body text-on-background min-h-screen flex items-center justify-center p-6 relative z-10 overflow-hidden">

      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-432 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl items-center gap-12">

          <div className="hidden lg:flex lg:col-span-7 flex-col pr-12 relative z-10">

            <div className="flex items-center gap-3 mb-10">
              <div className="bg-primary p-3 rounded-xl">
                <span className="material-symbols-outlined text-white text-3xl">fitness_center</span>
              </div>
              <span className="font-headline font-black text-3xl text-primary-container tracking-tight">WeWorkout</span>
            </div>

            <h1 className="font-headline font-extrabold text-6xl text-on-background leading-tight mb-8">
              Are you ready <span className="text-primary">to exercise with your new friends?</span> <br />
            </h1>

            <p className="text-on-surface-variant text-xl max-w-md leading-relaxed mb-12">
              Access your personalized programs, track your vitality metrics, and join the sanctuary of movement.
            </p>

            {/* แผงข้อมูลเสมือนจริง (Vitality Metrics) */}
            {/* 💥 เปลี่ยน ambient-shadow เป็น Tailwind เพียวๆ */}
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(7,30,39,0.06)] border border-outline-variant/10 bg-surface-container-lowest">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                alt="Fit athlete"
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/50 via-black/10 to-transparent">

                <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-lg bg-surface-container-lowest/10 backdrop-blur-[6px] p-6 rounded-3xl border border-white/10">

                  <div className="flex items-center gap-4 group">
                    <div className="bg-surface-container-low p-4 rounded-xl shadow-inner border border-outline-variant/5">
                      <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">health_metrics</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg text-white">Metrics</span>
                      <span className="block text-sm text-white/80 font-medium">Track your vitality</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="bg-surface-container-low p-4 rounded-xl shadow-inner border border-outline-variant/5">
                      <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">calendar_today</span>
                    </div>
                    <div>
                      <span className="font-bold text-lg text-white">Programs</span>
                      <span className="block text-sm text-white/80 font-medium">Personalized plans</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group col-span-2">
                    <div className="bg-surface-container-low p-4 rounded-xl shadow-inner border border-outline-variant/5">
                      <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">supervised_user_circle</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-lg text-white">Community</span>
                      <span className="block text-sm text-white/80 font-medium">Join the sanctuary of movement</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* แสงเอฟเฟกต์ */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/5 to-transparent blur-[60px] opacity-40"></div>
            </div>

          </div>
          {/* Right Side: Login Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            {/* 💥 เปลี่ยน ambient-shadow เป็น Tailwind เพียวๆ */}
            <div className="bg-surface-container-lowest p-10 md:p-14 rounded-[2rem] shadow-[0_20px_40px_rgba(7,30,39,0.06)] w-full max-w-md border border-outline-variant/10">

              <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-4xl">fitness_center</span>
                  <span className="font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
                </div>
              </div>

              <div className="mb-10 text-center lg:text-left">
                <h2 className="font-headline font-bold text-3xl text-on-background mb-2">Ready to move?</h2>
                <p className="text-on-surface-variant font-medium">Log in to continue your journey.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-sm font-bold text-on-surface-variant" htmlFor="password">Password</label>
                    <span className="text-xs font-bold text-primary cursor-pointer">Forgot?</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm text-center font-bold">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                {/* 💥 เปลี่ยน btn-gradient เป็น bg-gradient-to-r ของ Tailwind เพียวๆ */}
                <button type="submit" className="w-full bg-gradient-to-r from-secondary to-[#fe6f42] text-white font-headline font-bold py-5 rounded-full shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                  Log In
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>

              {/* Divider & Socials */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-surface-container-lowest px-4 text-outline">or</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-on-surface-variant font-medium">
                  Don't have an account?
                  {/* 💥 แก้ Link ตรงนี้ครับ */}
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