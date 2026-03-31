import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import toast from 'react-hot-toast';
import { Package, User as UserIcon, MapPin, Truck } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try { const { data } = await API.get('/orders/vendor'); setOrders(data); }
    catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const refundDeposit = async (id) => {
    try {
      await API.put(`/orders/${id}/refund-deposit`);
      toast.success('Deposit refunded (dummy)');
      fetchOrders();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Incoming Orders</h1>
        
        {orders.length === 0 ? <p className="text-[#875c1b]">No orders yet.</p> : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl border border-[#f0dead] p-6 flex flex-col xl:flex-row gap-6">
                
                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start border-b border-[#f0dead] pb-4">
                    <div>
                      <p className="text-xs font-bold text-[#875c1b] uppercase">Order ID: {order._id}</p>
                      <p className="text-sm font-semibold text-[#1a1208] mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                      <span className="text-xs font-bold bg-[#f8f0d7] text-[#c4922a] px-2 py-0.5 rounded mt-2 inline-block uppercase">Type: {order.orderType}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#1a1208]">₹{order.totalAmount.toLocaleString()}</p>
                      <p className={`text-xs font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Payment: {order.paymentStatus.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <UserIcon size={16} className="text-[#c4922a]" />
                      <div><p className="font-bold">{order.customerId?.name}</p><p className="text-[#5a4a35]">{order.customerId?.phone}</p></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-[#c4922a]" />
                      <p className="text-[#5a4a35]">{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                    </div>
                  </div>

                  <div className="bg-[#f8f0d7] rounded-xl p-4 space-y-3">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div>
                          <p className="font-bold text-[#1a1208]">{it.name} <span className="text-[#875c1b] font-normal">x {it.quantity}</span></p>
                          {order.orderType === 'rent' && <p className="text-xs text-[#875c1b]">Rent: {it.rentDays} days (Dep: ₹{it.deposit || 0})</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full xl:w-64 bg-[#fdf9ef] rounded-xl p-5 border border-[#e5c47a] flex flex-col justify-center">
                  <p className="text-xs font-bold text-[#875c1b] uppercase mb-2">Order Status</p>
                  
                  <select 
                    value={order.status} 
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#c4922a] outline-none focus:ring-2 focus:ring-[#c4922a] bg-white font-semibold text-sm mb-4"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    {order.orderType === 'rent' && <option value="returned">Returned</option>}
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {order.orderType === 'rent' && order.status === 'returned' && (
                    <div className="mt-4 pt-4 border-t border-[#e5c47a]">
                      <p className="text-xs font-bold text-[#875c1b] mb-2">Deposit Status: {order.depositStatus}</p>
                      {order.depositStatus === 'held' && (
                        <button onClick={() => refundDeposit(order._id)} className="w-full py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm border border-green-200 hover:bg-green-200">
                          Refund Deposit
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
