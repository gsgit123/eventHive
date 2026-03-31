import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Sidebar from '../../components/vendor/Sidebar';
import toast from 'react-hot-toast';
import { Calendar, User as UserIcon, MapPin, Clock } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try { const { data } = await API.get('/bookings/vendor'); setBookings(data); }
    catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBookings();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fdf9ef] flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-black text-[#1a1208] mb-8">Event Bookings</h1>
        
        {bookings.length === 0 ? <p className="text-[#875c1b]">No bookings yet.</p> : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {bookings.map(book => (
              <div key={book._id} className="bg-white rounded-2xl border border-[#f0dead] p-6 shadow-sm">
                
                <div className="flex justify-between items-start border-b border-[#f0dead] pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold bg-[#f8f0d7] text-[#c4922a] px-2 py-0.5 rounded uppercase">{book.packageId?.eventType}</span>
                    <h3 className="font-black text-[#1a1208] text-lg mt-1">{book.packageName}</h3>
                    <p className="text-xs text-[#875c1b]">Booking ID: {book._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#1a1208]">₹{book.totalAmount.toLocaleString()}</p>
                    <p className={`text-xs font-bold ${book.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {book.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-[#c4922a] mt-0.5" />
                    <div><p className="font-bold text-[#1a1208]">{new Date(book.eventDate).toLocaleDateString()} at {book.eventTime}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#c4922a] mt-0.5" />
                    <div><p className="text-[#5a4a35]">{book.eventAddress}, {book.city}</p></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <UserIcon size={16} className="text-[#c4922a] mt-0.5" />
                    <div><p className="font-bold">{book.customerId?.name} <span className="font-normal text-[#5a4a35]">- {book.customerId?.phone}</span></p></div>
                  </div>
                  {book.notes && (
                    <div className="bg-[#f8f0d7] p-3 rounded-xl mt-2 text-xs text-[#875c1b] italic">
                      "{book.notes}"
                    </div>
                  )}
                </div>

                <div className="bg-[#fdf9ef] border border-[#e5c47a] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#875c1b] uppercase">Update Status</p>
                  </div>
                  <select 
                    value={book.status} 
                    onChange={e => updateStatus(book._id, e.target.value)}
                    className="p-2 rounded-lg border border-[#c4922a] outline-none focus:ring-2 focus:ring-[#c4922a] bg-white font-semibold text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
