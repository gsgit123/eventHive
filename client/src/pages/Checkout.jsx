import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: user?.city || '',
    state: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!cart?.items?.length && !success) navigate('/cart');
  }, [cart, navigate, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/orders', { shippingAddress: form, orderType: cart.items.some(i => i.itemType === 'rent') ? 'rent' : 'sale' });
      await clearCart();
      setSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        <h1 className="text-4xl font-black text-[#1a1208] mb-4">Order Placed!</h1>
        <p className="text-[#875c1b] text-lg mb-8">Thank you for your order. We've received it.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/my-orders')} className="px-6 py-3 rounded-xl font-bold border-2 border-[#c4922a] text-[#c4922a] hover:bg-[#f8f0d7] transition-all">
            View My Orders
          </button>
          <button onClick={() => navigate('/shop')} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:-translate-y-1 transition-all shadow-lg">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black text-[#1a1208] mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold text-[#1a1208] mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">Full Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">Phone</label>
                <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">Address</label>
                <textarea required rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none resize-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">City</label>
                <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">State</label>
                <input required type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none" />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1">Pincode</label>
                <input required type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-[#e5c47a] focus:ring-2 focus:ring-[#c4922a] outline-none" />
              </div>
            </div>

            <div className="bg-[#f8f0d7] p-4 rounded-xl border border-[#e5c47a] flex items-start gap-3 mt-6">
              <CreditCard className="text-[#c4922a] shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1a1208]">Payment</h4>
                <p className="text-sm text-[#875c1b]">Dummy payment mode. You'll complete the payment virtually from your orders page after placing the order.</p>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg disabled:opacity-70 mt-6 text-lg">
              {loading ? 'Processing...' : `Place Order • ₹${cartTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-[#f8f0d7] rounded-2xl p-6 border border-[#e5c47a] sticky top-24">
            <h2 className="text-xl font-bold text-[#1a1208] mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
              {cart?.items?.map(item => (
                <div key={item._id} className="flex gap-3 text-sm">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1208] line-clamp-1">{item.name}</p>
                    <p className="text-[#875c1b] text-xs mt-0.5">Qty: {item.quantity} {item.itemType === 'rent' ? `• Rent: ${item.rentDays} days` : ''}</p>
                  </div>
                  <div className="text-right font-bold text-[#1a1208]">
                    ₹{(item.itemType === 'rent' ? item.price * item.rentDays + (item.deposit || 0) : item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#e5c47a] pt-4 flex justify-between font-black text-xl text-[#1a1208]">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
