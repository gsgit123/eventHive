import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Users, Store, CheckCircle, XCircle } from 'lucide-react';

function AdminNav() {
  const { logout } = useAuth();
  return (
    <nav className="bg-[#fffdf7] border-b border-[#f0dead] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/admin/dashboard" className="text-xl font-black text-[#1a1208]">
        Event<span className="text-[#c4922a]">Hive</span> <span className="text-xs font-bold text-red-500 px-2 py-0.5 bg-red-50 rounded-md">ADMIN</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/admin/dashboard" className="text-sm font-semibold text-[#875c1b] hover:text-[#c4922a]">Dashboard</Link>
        <Link to="/admin/vendors" className="text-sm font-semibold text-[#875c1b] hover:text-[#c4922a]">Vendors</Link>
        <button onClick={() => { logout(); window.location.href='/'; }} className="text-sm font-bold text-red-500">Logout</button>
      </div>
    </nav>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { API.get('/admin/stats').then(r => setStats(r.data)); }, []);

  return (
    <div className="min-h-screen bg-[#fdf9ef]">
      <AdminNav />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { l: 'Users', v: stats?.users || 0 },
            { l: 'Vendors', v: stats?.vendors || 0 },
            { l: 'Products', v: stats?.products || 0 },
            { l: 'Packages', v: stats?.packages || 0 },
            { l: 'Orders', v: stats?.orders || 0 },
            { l: 'Bookings', v: stats?.bookings || 0 },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-2xl p-6 border border-[#f0dead] shadow-sm text-center">
              <p className="text-sm font-bold text-[#875c1b] uppercase mb-2">{s.l}</p>
              <p className="text-4xl font-black text-[#1a1208]">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline Admin Vendors inside the same directory to save tools
export function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  useEffect(() => { fetchVendors(); }, []);
  const fetchVendors = () => API.get('/admin/vendors').then(r => setVendors(r.data));
  const approve = async (id) => { await API.put(`/admin/vendors/${id}/approve`); toast.success('Approved'); fetchVendors(); };
  const reject = async (id) => { await API.put(`/admin/vendors/${id}/reject`); toast.success('Rejected'); fetchVendors(); };

  return (
    <div className="min-h-screen bg-[#fdf9ef]">
      <AdminNav />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Manage Vendors</h1>
        <div className="bg-white rounded-2xl border border-[#f0dead] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f0d7] uppercase text-[#875c1b] text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0dead]">
              {vendors.map(v => (
                <tr key={v._id}>
                  <td className="px-6 py-4 font-bold text-[#1a1208]">{v.businessName}</td>
                  <td className="px-6 py-4 text-[#5a4a35]">{v.userId?.name}<br/>{v.userId?.email}</td>
                  <td className="px-6 py-4 text-[#5a4a35]">{v.city}</td>
                  <td className="px-6 py-4">
                    {v.isApproved ? <span className="px-2 py-1 bg-green-100 text-green-700 font-bold rounded text-xs uppercase">Approved</span>
                     : <span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-bold rounded text-xs uppercase">Pending</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!v.isApproved ? (
                      <button onClick={()=>approve(v._id)} className="text-green-600 font-bold hover:underline">Approve</button>
                    ) : (
                      <button onClick={()=>reject(v._id)} className="text-red-500 font-bold hover:underline">Reject</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
