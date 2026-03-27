import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 
    
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกันครับ ตรวจสอบอีกทีนะ!');
      return;
    }

    try {
      // ยิง API ไปหลังบ้าน (สมมติว่า Path คือ /auth/register)
      await axios.post('/auth/register', { name, email, password });
      alert('🎉 สมัครสมาชิกสำเร็จ! ไปล็อกอินกันเลย!');
      navigate('/login'); // สมัครเสร็จเด้งไปหน้า Login
    } catch (error) {
      setError(error.response?.data?.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <div className="bg-background font-body text-on-background min-h-screen flex items-center justify-center p-6 relative z-10 overflow-hidden">
      
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="w-full max-w-[1728px] flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-6xl items-center gap-12">
          
          {/* ซ้ายมือ: รูปภาพและคำโปรย (ล้อมาจาก Login) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col pr-12 relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-primary p-3 rounded-xl">
                <span className="material-symbols-outlined text-white text-3xl">fitness_center</span>
              </div>
              <span className="font-headline font-black text-3xl text-primary-container tracking-tight">WeWorkout</span>
            </div>
            <h1 className="font-headline font-extrabold text-6xl text-on-background leading-tight mb-8">
              Join the <span className="text-primary">Movement.</span> <br/>
            </h1>
            <p className="text-on-surface-variant text-xl max-w-md leading-relaxed mb-12">
              Create an account to find your next workout partner and discover activities near you.
            </p>
            
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(7,30,39,0.06)] border border-outline-variant/10 bg-surface-container-lowest">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Active lifestyle" 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
            </div>
          </div>

          {/* ขวามือ: ฟอร์มสมัครสมาชิก */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="bg-surface-container-lowest p-10 md:p-14 rounded-[2rem] shadow-[0_20px_40px_rgba(7,30,39,0.06)] w-full max-w-md border border-outline-variant/10">
              
              <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-4xl">fitness_center</span>
                  <span className="font-headline font-black text-2xl text-primary-container tracking-tight">WeWorkout</span>
                </div>
              </div>

              <div className="mb-10 text-center lg:text-left">
                <h2 className="font-headline font-bold text-3xl text-on-background mb-2">Sign Up</h2>
                <p className="text-on-surface-variant font-medium">Create your account to get started.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                
                {/* Name Input */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background" 
                      placeholder="Your name" 
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">mail</span>
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background" 
                      placeholder="name@example.com" 
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">lock</span>
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background" 
                      placeholder="••••••••" 
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-on-surface-variant ml-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">lock_reset</span>
                    </div>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-on-background" 
                      placeholder="••••••••" 
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm text-center font-bold">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4">
                  Create Account
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-on-surface-variant font-medium">
                  Already have an account? 
                  <Link to="/login" className="text-primary font-bold hover:underline ml-2">Log in</Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;