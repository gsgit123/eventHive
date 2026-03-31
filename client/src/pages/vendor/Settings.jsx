import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ businessName: '', description: '', logo: '', city: '', state: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    API.get(`/vendors/me/stats`).then(r => {
      const v = r.data.vendor;
      setForm({ businessName: v.businessName, description: v.description, logo: v.logo, city: v.city, state: v.state, address: v.address });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('image', file);
    try {
      const { data } = await API.post('/vendors/upload-logo', fd, { headers: {'Content-Type':'multipart/form-data'} });
      setForm(f => ({ ...f, logo: data.url }));
      toast.success('Logo uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/vendors/profile', form);
      toast.success('Profile updated');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Business Settings</h1>
        
        <div className="max-w-2xl bg-white rounded-3xl border border-[#e5c47a] p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Logo */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-[#f8f0d7] border-2 border-[#e5c47a] overflow-hidden flex-shrink-0">
                {form.logo ? <img src={form.logo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#c4922a] font-bold text-3xl">{form.businessName?.[0]}</div>}
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current.click()} className="px-4 py-2 bg-[#f8f0d7] text-[#c4922a] font-bold rounded-xl flex items-center gap-2 hover:bg-[#e5c47a] transition-all text-sm mb-2">
                  <UploadCloud size={16} /> Upload New Logo
                </button>
                <p className="text-xs text-[#875c1b]">Recommended: Square 500x500px</p>
                <input type="file" hidden ref={fileRef} onChange={handleUpload} accept="image/*" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Business Name</label>
                <input required type="text" value={form.businessName} onChange={e=>setForm({...form, businessName: e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">About Your Business</label>
                <textarea rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-1">City</label>
                <input required type="text" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold mb-1">State</label>
                <input type="text" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Full Address</label>
                <input type="text" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full py-4 text-lg rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
