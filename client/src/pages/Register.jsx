import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'];

export default function Register() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'customer', phone: '', city: '', businessName: '',
  });

  useEffect(() => {
    if (user) navigate(user.role === 'vendor' ? '/vendor/dashboard' : '/');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    const res = await register(form);
    if (res.success) {
      toast.success('Account created!');
      navigate(res.role === 'vendor' ? '/vendor/dashboard' : '/');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1a1208] via-[#2d1f0e] to-[#4a3018] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #c4922a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #875c1b 0%, transparent 50%)' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center shadow-2xl mb-6">
            <span className="text-white text-4xl font-black">E</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Join <span className="text-[#c4922a]">EventHive</span></h1>
          <p className="text-[#a09070] text-lg leading-relaxed max-w-sm">
            Start planning beautiful events or grow your decoration business
          </p>
          <div className="mt-10 space-y-4">
            {[['🛍️', 'Shop Products', 'Buy & rent event supplies'],
              ['📦', 'Book Packages', 'Complete decoration setups'],
              ['💼', 'Sell as Vendor', 'Reach thousands of customers']
            ].map(([e, t, d]) => (
              <div key={t} className="flex items-center gap-3 bg-[#ffffff10] border border-[#c4922a30] rounded-xl p-3 text-left">
                <span className="text-2xl">{e}</span>
                <div>
                  <div className="text-white text-sm font-bold">{t}</div>
                  <div className="text-[#a09070] text-xs">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fffdf7] overflow-y-auto relative">
        <Link to="/" className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-1 text-sm font-bold text-[#875c1b] hover:text-[#c4922a] transition-colors z-10">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="w-full max-w-md py-6 mt-8 lg:mt-0">
          <h2 className="text-3xl font-black text-[#1a1208] mb-2">Create account</h2>
          <p className="text-[#875c1b] mb-6">Join thousands of happy customers</p>

          {/* Role toggle */}
          <div className="flex gap-2 mb-6 bg-[#f8f0d7] p-1 rounded-xl">
            {['customer', 'vendor'].map(r => (
              <button key={r} onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${form.role === r ? 'bg-[#c4922a] text-white shadow-md' : 'text-[#875c1b]'}`}>
                {r === 'customer' ? '🛍️ Customer' : '💼 Vendor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
              </div>
              {form.role === 'vendor' && (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#1a1208] mb-1">Business Name</label>
                  <input type="text" required value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                    placeholder="Your business name" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">City</label>
                <select required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm">
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">Password</label>
                <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1a1208] mb-1">Confirm Password</label>
                <input type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg hover:-translate-y-0.5 transform transition-all disabled:opacity-60 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#875c1b] mt-4">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#c4922a] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
