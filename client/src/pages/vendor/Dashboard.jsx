import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import { Package, CalendarHeart, TrendingUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/vendors/me/stats').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="ml-64 p-8 text-[#c4922a]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef]">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Dashboard Overview</h1>

        {!stats?.vendor?.isApproved && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-xl mb-8 flex items-start gap-3 shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Your account is pending admin approval.</p>
              <p className="text-sm mt-1">You can add products and packages, but they won't be visible to customers until approved.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#f0dead] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#875c1b] uppercase">Active Products</p>
              <p className="text-3xl font-black text-[#1a1208]">{stats?.totalProducts || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#f0dead] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <CalendarHeart size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#875c1b] uppercase">Event Packages</p>
              <p className="text-3xl font-black text-[#1a1208]">{stats?.totalPackages || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#f0dead] shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#875c1b] uppercase">Total Sales & Bookings</p>
              <p className="text-3xl font-black text-[#1a1208]">
                {((stats?.vendor?.totalSales || 0) + (stats?.vendor?.totalBookings || 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#f0dead] shadow-sm">
            <h3 className="text-lg font-bold text-[#1a1208] mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <Link to="/vendor/products" className="flex-1 py-3 text-center rounded-xl bg-[#f8f0d7] text-[#c4922a] font-bold hover:bg-[#c4922a] hover:text-white transition-colors">Add Product</Link>
              <Link to="/vendor/packages" className="flex-1 py-3 text-center rounded-xl bg-[#f8f0d7] text-[#c4922a] font-bold hover:bg-[#c4922a] hover:text-white transition-colors">Add Package</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
