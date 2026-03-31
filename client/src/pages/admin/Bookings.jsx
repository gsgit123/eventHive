import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    API.get('/admin/bookings').then(r => setBookings(r.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black mb-6">All Bookings</h1>
      <table className="w-full text-left text-sm bg-white rounded-xl shadow">
        <thead className="bg-[#f8f0d7] uppercase text-[#875c1b] text-xs font-bold">
          <tr>
            <th className="px-6 py-4">Booking ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Vendor</th>
            <th className="px-6 py-4">Event Date</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0dead]">
          {bookings.map(b => (
            <tr key={b._id}>
              <td className="px-6 py-4 font-mono">{b._id}</td>
              <td className="px-6 py-4 text-[#5a4a35]">{b.customerId?.name}</td>
              <td className="px-6 py-4 font-bold text-[#c4922a]">{b.vendorId?.businessName}</td>
              <td className="px-6 py-4 border">{new Date(b.eventDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
