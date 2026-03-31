import { useState, useEffect, useRef } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Balloons', 'Lights', 'Props', 'Flowers', 'Furniture', 'Backdrops', 'Candles', 'Ribbons', 'Tableware', 'Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list mode, 'new' or object for form

  const formPreset = { name: '', description: '', category: 'Balloons', listingType: 'sale', salePrice: 0, discountPrice: 0, rentPrice: 0, rentMinDays: 1, rentDeposit: 0, stock: 1, images: [] };
  const [form, setForm] = useState(formPreset);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    try { const { data } = await API.get('/products/vendor/my'); setProducts(data); }
    catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData(); formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/products/upload-image', formData, { headers: {'Content-Type': 'multipart/form-data'} });
      setForm(f => ({ ...f, images: [...f.images, data.url] }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const removeImage = (url) => setForm(f => ({ ...f, images: f.images.filter(i => i !== url) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) return toast.error('Please upload at least 1 image');
    try {
      if (editing === 'new') await API.post('/products', form);
      else await API.put(`/products/${editing._id}`, form);
      toast.success(editing === 'new' ? 'Product created' : 'Product updated');
      setEditing(null);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await API.delete(`/products/${id}`); toast.success('Deleted'); fetchProducts(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        
        {!editing ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-black text-[#1a1208]">My Products</h1>
              <button onClick={() => { setEditing('new'); setForm(formPreset); }} className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] flex items-center gap-2 hover:shadow-lg transition-all">
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p._id} className="bg-white rounded-2xl border border-[#f0dead] overflow-hidden group">
                  <div className="h-40 bg-[#f8f0d7] relative">
                    {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-[#c4922a]"><ImageIcon size={40} className="opacity-30" /></div>}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-[#875c1b]">{p.category}</p>
                    <h3 className="font-bold text-[#1a1208] mb-1 truncate">{p.name}</h3>
                    <div className="flex gap-2 text-xs mb-3 font-semibold">
                      {p.listingType !== 'rent' && <span className="bg-[#fdf9ef] text-[#1a1208] px-2 py-1 rounded">Sale: ₹{p.salePrice}</span>}
                      {p.listingType !== 'sale' && <span className="bg-[#f8f0d7] text-[#c4922a] px-2 py-1 rounded">Rent: ₹{p.rentPrice}/day</span>}
                    </div>
                    <div className="flex justify-end gap-2 mt-auto border-t border-[#f0dead] pt-3">
                      <button onClick={() => { setEditing(p); setForm(p); }} className="p-2 text-[#c4922a] bg-[#f8f0d7] rounded-lg hover:bg-[#e5c47a]"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {!products.length && <div className="col-span-full py-10 text-center text-[#875c1b]">No products yet. Start adding!</div>}
            </div>
          </>
        ) : (
          <div className="max-w-4xl bg-white rounded-3xl border border-[#e5c47a] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#1a1208]">{editing === 'new' ? 'New Product' : 'Edit Product'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 bg-[#f8f0d7] text-[#875c1b] rounded-xl hover:bg-[#e5c47a]"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold mb-1">Product Name</label>
                  <input required type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold mb-1">Category</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea required rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">Listing Type</label>
                  <div className="flex gap-4">
                    {[{v:'sale',l:'For Sale Only'},{v:'rent',l:'For Rent Only'},{v:'both',l:'Both (Sale & Rent)'}].map(t =>(
                      <label key={t.v} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input type="radio" name="listingType" value={t.v} checked={form.listingType === t.v} onChange={e=>setForm({...form,listingType:e.target.value})} className="accent-[#c4922a]" /> {t.l}
                      </label>
                    ))}
                  </div>
                </div>

                {(form.listingType === 'sale' || form.listingType === 'both') && (
                  <>
                    <div className="col-span-1 border border-[#f0dead] bg-[#fdf9ef] p-4 rounded-xl">
                      <label className="block text-sm font-bold text-[#c4922a] mb-2">Sale Price (₹)</label>
                      <input required type="number" min="0" value={form.salePrice} onChange={e=>setForm({...form,salePrice:Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e5c47a] outline-none focus:ring-1 focus:ring-[#c4922a] mb-2" />
                      
                      <label className="block text-sm font-semibold mb-1">Discount Price (opt)</label>
                      <input type="number" min="0" value={form.discountPrice} onChange={e=>setForm({...form,discountPrice:Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e5c47a] outline-none focus:ring-1 focus:ring-[#c4922a]" />
                    </div>
                  </>
                )}

                {(form.listingType === 'rent' || form.listingType === 'both') && (
                  <>
                    <div className="col-span-1 border border-[#f0dead] bg-[#fcf8f2] p-4 rounded-xl">
                      <label className="block text-sm font-bold text-[#875c1b] mb-2">Rent Price/Day (₹)</label>
                      <input required type="number" min="0" value={form.rentPrice} onChange={e=>setForm({...form,rentPrice:Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e5c47a] outline-none focus:ring-1 focus:ring-[#c4922a] mb-2" />
                      
                      <label className="block text-sm font-semibold mb-1">Refundable Deposit</label>
                      <input type="number" min="0" value={form.rentDeposit} onChange={e=>setForm({...form,rentDeposit:Number(e.target.value)})} className="w-full p-2.5 rounded-lg border border-[#e5c47a] outline-none focus:ring-1 focus:ring-[#c4922a]" />
                    </div>
                  </>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Total Stock Quantity</label>
                  <input required type="number" min="1" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})} className="w-full p-3 rounded-xl border border-[#e5c47a] outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold mb-3">Images (Upload to Cloudinary)</label>
                <div className="flex gap-4 flex-wrap">
                  {form.images.map(img => (
                    <div key={img} className="relative w-24 h-24 rounded-xl border border-[#e5c47a] overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={()=>removeImage(img)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={()=>fileInputRef.current.click()} disabled={uploading} className="w-24 h-24 rounded-xl border-2 border-dashed border-[#c4922a] bg-[#f8f0d7] flex flex-col items-center justify-center text-[#c4922a] font-bold text-xs hover:bg-[#f0dead] transition-colors">
                    <ImageIcon size={20} className="mb-1" />
                    {uploading ? 'Uploading...' : 'Add Image'}
                  </button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full py-4 text-lg rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg disabled:opacity-50">
                {editing === 'new' ? 'Create Product' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
