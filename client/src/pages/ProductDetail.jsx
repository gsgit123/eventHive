import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, ShoppingCart, Package, Truck, Shield, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState('sale');   // 'sale' or 'rent'
  const [imgIdx, setImgIdx]     = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentDays, setRentDays] = useState(1);
  const [rentStart, setRentStart] = useState('');
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`).then(r => { setProduct(r.data); setLoading(false); }).catch(() => navigate('/shop'));
    API.get(`/reviews/product/${id}`).then(r => setReviews(r.data)).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login to add to cart'); return navigate('/login'); }
    if (user.role !== 'customer') return toast.error('Only customers can shop');
    setAdding(true);
    const opts = tab === 'rent'
      ? { itemType: 'rent', rentDays, rentStartDate: rentStart, rentEndDate: new Date(new Date(rentStart).getTime() + rentDays * 86400000).toISOString(), quantity: 1 }
      : { itemType: 'sale', quantity };
    const ok = await addToCart(product._id, opts);
    if (ok) { toast.success('Added to cart!'); }
    else toast.error('Could not add to cart');
    setAdding(false);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-[#f8f0d7] h-96" />
        <div className="space-y-4"><div className="h-8 bg-[#f8f0d7] rounded-xl w-3/4" /><div className="h-4 bg-[#f8f0d7] rounded-xl" /></div>
      </div>
    </div>
  );
  if (!product) return null;

  const rentTotal = product.rentPrice * rentDays + (product.rentDeposit || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-[#f8f0d7] h-96 mb-3">
            {product.images?.length > 0 ? (
              <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#c4922a]"><Package size={64} className="opacity-30" /></div>
            )}
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-xl flex items-center justify-center hover:bg-white shadow">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-xl flex items-center justify-center hover:bg-white shadow">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-[#c4922a]' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-[#875c1b] font-semibold mb-1">{product.category}</p>
          <h1 className="text-2xl font-black text-[#1a1208] mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(product.rating) ? '#c4922a' : 'none'} className="text-[#c4922a]" />)}
            </div>
            <span className="text-sm text-[#875c1b]">{product.rating} ({product.totalReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-sm text-[#875c1b]">
            <MapPin size={14} /> {product.city}
            <span className="text-[#e5c47a]">·</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <p className="text-[#5a4a35] leading-relaxed mb-6 text-sm">{product.description}</p>

          {/* Sale / Rent tabs */}
          {product.listingType !== 'rent' && product.listingType !== 'sale' ? (
            <div className="flex gap-2 mb-5 bg-[#f8f0d7] p-1 rounded-xl">
              {[['sale', '🛒 Buy'], ['rent', '📦 Rent']].map(([v, l]) => (
                <button key={v} onClick={() => setTab(v)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === v ? 'bg-[#c4922a] text-white shadow-md' : 'text-[#875c1b]'}`}>
                  {l}
                </button>
              ))}
            </div>
          ) : null}

          {/* Pricing */}
          {(tab === 'sale' && product.listingType !== 'rent') && (
            <div className="bg-[#f8f0d7] rounded-2xl p-5 mb-5">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-black text-[#1a1208]">₹{(product.discountPrice || product.salePrice)?.toLocaleString()}</span>
                {product.discountPrice && <span className="text-lg text-[#a09070] line-through">₹{product.salePrice?.toLocaleString()}</span>}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-[#1a1208]">Qty:</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg bg-white border border-[#e5c47a] text-lg font-bold hover:border-[#c4922a]">−</button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-8 h-8 rounded-lg bg-white border border-[#e5c47a] text-lg font-bold hover:border-[#c4922a]">+</button>
                </div>
                <span className="text-sm text-[#875c1b]">Total: ₹{((product.discountPrice || product.salePrice) * quantity)?.toLocaleString()}</span>
              </div>
            </div>
          )}

          {(tab === 'rent' || product.listingType === 'rent') && (
            <div className="bg-[#f8f0d7] rounded-2xl p-5 mb-5">
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-black text-[#1a1208]">₹{product.rentPrice?.toLocaleString()}</span>
                <span className="text-[#875c1b] mb-1">/day</span>
              </div>
              {product.rentDeposit > 0 && <p className="text-xs text-[#875c1b] mb-3">+ ₹{product.rentDeposit} refundable deposit</p>}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Start Date</label>
                  <input type="date" value={rentStart} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setRentStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Days</label>
                  <input type="number" value={rentDays} min={product.rentMinDays || 1}
                    onChange={e => setRentDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
                </div>
              </div>
              <p className="text-sm font-bold text-[#1a1208]">Total: ₹{rentTotal?.toLocaleString()}</p>
            </div>
          )}

          <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-xl hover:-translate-y-0.5 transform transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-base mb-3">
            <ShoppingCart size={18} /> {adding ? 'Adding...' : 'Add to Cart'}
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[[Shield, 'Verified Vendor'], [Truck, 'Timely Delivery'], [Package, 'Quality Assured']].map(([Icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center p-2">
                <Icon size={16} className="text-[#c4922a]" />
                <span className="text-xs text-[#875c1b]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-black text-[#1a1208] mb-6">Customer Reviews</h2>
        {reviews.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r._id} className="bg-white border border-[#f0dead] rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-white font-bold text-sm">
                    {r.reviewerName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1208] text-sm">{r.reviewerName}</p>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? '#c4922a' : 'none'} className="text-[#c4922a]" />)}</div>
                  </div>
                </div>
                <p className="text-sm text-[#5a4a35]">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#a09070]">
            <Star size={32} className="mx-auto mb-2 opacity-30" />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
