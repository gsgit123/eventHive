import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EVENT_TYPES = ['Birthday', 'Wedding', 'Proposal', 'Anniversary', 'Festive', 'Baby Shower', 'Corporate'];

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const formPreset = { name: '', description: '', eventType: 'Birthday', price: 0, inclusions: [], duration: '4-5 hours', images: [] };
  const [form, setForm] = useState(formPreset);
  const [incInput, setIncInput] = useState('');
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const fetchPackages = async () => {
    try { const { data } = await API.get('/events/vendor/my'); setPackages(data); }
    catch { toast.error('Failed to load packages'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPackages(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData(); formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/events/upload-image', formData, { headers: {'Content-Type': 'multipart/form-data'} });
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const addInclusion = (e) => {
    e.preventDefault();
    if (!incInput.trim()) return;
    setForm(f => ({ ...f, inclusions: [...f.inclusions, incInput.trim()] }));
    setIncInput('');
  };
  const removeInclusion = (idx) => setForm(f => ({ ...f, inclusions: f.inclusions.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) return toast.error('Upload at least 1 image');
    try {
      if (editing === 'new') await API.post('/events', form);
      else await API.put(`/events/${editing._id}`, form);
      toast.success(editing === 'new' ? 'Package created' : 'Package updated');
      setEditing(null);
      fetchPackages();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await API.delete(`/events/${id}`); toast.success('Deleted'); fetchPackages(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        
        {!editing ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-black text-[#1a1208]">My Packages</h1>
              <button onClick={() => { setEditing('new'); setForm(formPreset); }} className="px-5 py-2.5 rounded-xl font-bold text-[#c4922a] bg-[#f8f0d7] border-2 border-[#c4922a] flex items-center gap-2 hover:bg-[#c4922a] hover:text-white transition-all">
                <Plus size={18} /> Add Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map(p => (
                <div key={p._id} className="bg-white rounded-2xl border border-[#f0dead] overflow-hidden group">
                  <div className="h-48 bg-gradient-to-br from-[#c4922a] to-[#875c1b] relative">
                    {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : null}
                    <span className="absolute top-2 left-2 bg-[#c4922a] text-white text-xs font-bold px-2 py-1 rounded-md">{p.eventType}</span>
                  </div>
                  <div className="p-5 flex flex-col">
                    <h3 className="text-lg font-black text-[#1a1208] mb-1">{p.name}</h3>
                    <p className="text-xl font-bold text-[#c4922a] mb-4">₹{p.price.toLocaleString()}</p>
                    <div className="flex justify-end gap-2 border-t border-[#f0dead] pt-3">
                      <button onClick={() => { setEditing(p); setForm(p); }} className="px-4 py-2 text-sm font-bold text-[#c4922a] bg-[#f8f0d7] rounded-xl hover:bg-[#e5c47a]">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-4 py-2 text-sm font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {!packages.length && <div className="col-span-full py-10 text-center text-[#875c1b]">No packages yet. Start creating!</div>}
            </div>
          </>
        ) : (
          <div className="max-w-4xl bg-white rounded-3xl border border-[#e5c47a] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#1a1208]">{editing === 'new' ? 'New Package' : 'Edit Package'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 bg-[#f8f0d7] text-[#875c1b] rounded-xl hover:bg-[#e5c47a]"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold mb-1">Package Name</label>
                  <input required type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1">Event Type</label>
                  <select value={form.eventType} onChange={e=>setForm({...form,eventType:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]">
                    {EVENT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea required rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                  <input required type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-semibold mb-1">Setup Duration</label>
                  <input required type="text" placeholder="e.g. 4-5 hours" value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>

                {/* Inclusions */}
                <div className="col-span-2 border border-[#f0dead] p-4 rounded-xl bg-[#fdf9ef]">
                  <label className="block text-sm font-semibold mb-2">What's Included?</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={incInput} onChange={e=>setIncInput(e.target.value)} placeholder="e.g. 100 metallic balloons" onKeyDown={e=>{if(e.key === 'Enter') addInclusion(e)}} className="flex-1 p-2.5 rounded-lg border border-[#e5c47a] outline-none focus:ring-1 focus:ring-[#c4922a]" />
                    <button type="button" onClick={addInclusion} className="px-4 bg-[#c4922a] text-white font-bold rounded-lg text-sm">Add</button>
                  </div>
                  <ul className="space-y-2">
                    {form.inclusions.map((inc, i) => (
                      <li key={i} className="flex justify-between items-center bg-white px-3 py-2 border border-[#f0dead] rounded-lg text-sm font-medium">
                        ✓ {inc} <button type="button" onClick={()=>removeInclusion(i)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={14}/></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold mb-3">Cover Images</label>
                <div className="flex gap-4 flex-wrap">
                  {form.images.map(img => (
                    <div key={img} className="relative w-24 h-24 rounded-xl border border-[#e5c47a] overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button type="button" onClick={()=>setForm(f=>({...f,images:f.images.filter(i=>i!==img)}))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={()=>fileInputRef.current.click()} disabled={uploading} className="w-24 h-24 rounded-xl border-2 border-dashed border-[#c4922a] bg-[#f8f0d7] flex flex-col items-center justify-center text-[#c4922a] font-bold text-xs">
                    <ImageIcon size={20} className="mb-1" />{uploading ? '...' : 'Add Image'}
                  </button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full py-4 text-lg rounded-xl font-bold text-[#c4922a] bg-[#f8f0d7] border-2 border-[#c4922a] hover:bg-[#c4922a] hover:text-white transition-all">
                {editing === 'new' ? 'Save Package' : 'Update Package'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
