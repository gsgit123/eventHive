import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back!');
      if (res.role === 'admin') navigate('/admin/dashboard');
      else if (res.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1208] via-[#2d1f0e] to-[#4a3018] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #c4922a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #875c1b 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-4xl font-black">E</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Event<span className="text-[#c4922a]">Hive</span></h1>
          <p className="text-[#a09070] text-lg leading-relaxed max-w-sm">
            Your trusted marketplace for beautiful event decorations
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-center">
            {[['🎂', 'Birthdays'], ['💍', 'Weddings'], ['💝', 'Proposals'], ['🎊', 'Festive']].map(([e, l]) => (
              <div key={l} className="bg-[#ffffff10] border border-[#c4922a30] rounded-xl py-3">
                <div className="text-2xl mb-1">{e}</div>
                <div className="text-xs text-[#c4922a] font-semibold">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fffdf7] relative">
        <Link to="/" className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-1 text-sm font-bold text-[#875c1b] hover:text-[#c4922a] transition-colors">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="w-full max-w-md pt-8 lg:pt-0">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center">
              <span className="text-white font-black">E</span>
            </div>
            <span className="text-xl font-black">Event<span className="text-[#c4922a]">Hive</span></span>
          </div>

          <h2 className="text-3xl font-black text-[#1a1208] mb-2">Welcome back</h2>
          <p className="text-[#875c1b] mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Email</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] focus:border-transparent text-[#1a1208] placeholder-[#c9b07a]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Password</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] focus:border-transparent text-[#1a1208]"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg hover:-translate-y-0.5 transform transition-all disabled:opacity-60 text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#875c1b] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#c4922a] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
