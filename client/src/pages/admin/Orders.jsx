import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    API.get('/admin/orders').then(r => setOrders(r.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-6">All Orders</h1>
      <table className="w-full text-left text-sm bg-white rounded-xl shadow">
        <thead className="bg-[#f8f0d7] uppercase text-[#875c1b] text-xs font-bold">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Vendor</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0dead]">
          {orders.map(o => (
            <tr key={o._id}>
              <td className="px-6 py-4 font-mono">{o._id}</td>
              <td className="px-6 py-4 text-[#5a4a35]">{o.customerId?.name}</td>
              <td className="px-6 py-4 font-bold text-[#c4922a]">{o.vendorId?.businessName}</td>
              <td className="px-6 py-4 border">₹{o.totalAmount}</td>
              <td className="px-6 py-4">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
