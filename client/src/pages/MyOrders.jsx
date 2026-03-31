import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Package, MapPin, ExternalLink, MessageSquare, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch { toast.error('Failed to fetch orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handlePay = async (id) => {
    try {
      await API.put(`/orders/${id}/pay`);
      toast.success('Payment successful!');
      fetchOrders();
    } catch { toast.error('Payment failed'); }
  };

  if (loading) return <div className="p-8 text-center text-[#c4922a]">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black text-[#1a1208] mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#f8f0d7] rounded-3xl border border-[#e5c47a]">
          <Package size={48} className="mx-auto text-[#c4922a] opacity-50 mb-4" />
          <h2 className="text-xl font-bold text-[#1a1208]">No orders yet</h2>
          <p className="text-[#875c1b]">Start shopping for event decor!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-[#f0dead] shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-[#f8f0d7] px-5 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#f0dead]">
                <div>
                  <p className="text-xs text-[#875c1b] font-bold uppercase tracking-wider">Order ID</p>
                  <p className="font-mono text-sm text-[#1a1208]">{order._id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#875c1b] font-bold uppercase tracking-wider">Date</p>
                  <p className="text-sm text-[#1a1208] font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#875c1b] font-bold uppercase tracking-wider">Vendor</p>
                  <p className="text-sm font-bold text-[#c4922a]">{order.vendorId?.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#875c1b] font-bold uppercase tracking-wider">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'returned' ? 'bg-teal-100 text-teal-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <img src={item.image || 'https://via.placeholder.com/80'} alt="" className="w-16 h-16 rounded-xl object-cover border border-[#e5c47a]" />
                      <div>
                        <p className="font-bold text-[#1a1208] text-sm">{item.name}</p>
                        <p className="text-xs text-[#875c1b] mt-1 space-x-2">
                          <span className="font-semibold bg-[#f8f0d7] px-2 py-0.5 rounded text-[10px] uppercase">
                            {order.orderType === 'rent' ? 'Rent' : 'Buy'}
                          </span>
                          <span>Qty: {item.quantity}</span>
                          {order.orderType === 'rent' && <span>• {item.rentDays} Days</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-64 bg-[#fdf9ef] rounded-xl p-4 border border-[#e5c47a]">
                  <h4 className="font-bold text-sm text-[#1a1208] mb-2 flex items-center gap-1"><MapPin size={14}/> Delivery</h4>
                  <p className="text-xs text-[#5a4a35] mb-4">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  
                  <div className="border-t border-[#e5c47a] pt-3 flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-[#875c1b]">Total</span>
                    <span className="text-lg font-black text-[#1a1208]">₹{order.totalAmount.toLocaleString()}</span>
                  </div>

                  {order.paymentStatus === 'pending' ? (
                    <button onClick={() => handlePay(order._id)} className="w-full py-2 bg-[#c4922a] text-white text-sm font-bold rounded-lg hover:bg-[#a97620] transition-colors">
                      Pay Now (Dummy)
                    </button>
                  ) : (
                    <div className="text-center py-2 bg-green-100 text-green-700 text-sm font-bold rounded-lg border border-green-200">
                      Paid
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
