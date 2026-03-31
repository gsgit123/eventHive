import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Calendar, Clock, MapPin, CheckCircle, ChevronLeft, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data);
    } catch { toast.error('Failed to fetch bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePay = async (id) => {
    try {
      await API.put(`/bookings/${id}/pay`);
      toast.success('Payment successful!');
      fetchBookings();
    } catch { toast.error('Payment failed'); }
  };

  if (loading) return <div className="p-8 text-center text-[#c4922a]">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black text-[#1a1208] mb-8">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#f8f0d7] rounded-3xl border border-[#e5c47a]">
          <Calendar size={48} className="mx-auto text-[#c4922a] opacity-50 mb-4" />
          <h2 className="text-xl font-bold text-[#1a1208]">No bookings yet</h2>
          <p className="text-[#875c1b] mb-6">Plan your first event today!</p>
          <Link to="/events" className="inline-block px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg transition-all">
            Browse Packages
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white border border-[#f0dead] shadow-sm rounded-2xl overflow-hidden hover:border-[#c4922a] transition-colors">
              <div className="p-5 flex flex-col md:flex-row gap-6">
                
                {/* Left Area: Img + Basic Info */}
                <div className="flex gap-4 md:w-1/2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-[#e5c47a]">
                    <img src={booking.packageImage || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#1a1208] text-lg mb-1 line-clamp-2">{booking.packageName}</h3>
                    <p className="text-[#c4922a] font-bold text-sm bg-[#f8f0d7] inline-block px-2 py-0.5 rounded-full mb-3">{booking.packageId?.eventType}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#875c1b]">Vendor:</p>
                      <Link to={`/vendor/${booking.vendorId?._id}`} className="text-sm font-bold text-[#c4922a] hover:underline">{booking.vendorId?.businessName}</Link>
                    </div>
                    <div className="text-2xl font-black text-[#1a1208]">₹{booking.totalAmount?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block w-px bg-[#f0dead]" />
                
                {/* Horizontal Divider (Mobile) */}
                <div className="md:hidden h-px w-full bg-[#f0dead]" />

                {/* Right Area: Event Details */}
                <div className="md:w-1/2 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-[#c4922a] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#875c1b] font-semibold uppercase">Date & Time</p>
                        <p className="text-sm font-medium text-[#1a1208]">
                          {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#c4922a] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#875c1b] font-semibold uppercase">Location</p>
                        <p className="text-sm font-medium text-[#1a1208]">{booking.eventAddress}, {booking.city}</p>
                      </div>
                    </div>
                  </div>

                  {['confirmed', 'in-progress'].includes(booking.status) && booking.vendorId?.userId && (
                    <div className="mb-4 pt-4 border-t border-[#f0dead]">
                      <p className="text-[10px] text-[#875c1b] font-black uppercase tracking-widest mb-2">Vendor Contact Details</p>
                      <div className="flex flex-wrap gap-2">
                        {booking.vendorId.userId.phone && (
                          <a href={`tel:${booking.vendorId.userId.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f0d7] hover:bg-[#c4922a] hover:text-white text-[#875c1b] rounded-lg text-sm font-semibold transition-colors">
                            <Phone size={14} /> Call
                          </a>
                        )}
                        {booking.vendorId.userId.email && (
                          <a href={`mailto:${booking.vendorId.userId.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8f0d7] hover:bg-[#c4922a] hover:text-white text-[#875c1b] rounded-lg text-sm font-semibold transition-colors">
                            <Mail size={14} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      booking.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                    
                    {booking.paymentStatus === 'pending' ? (
                      <button onClick={() => handlePay(booking._id)} className="px-5 py-2 font-bold bg-[#c4922a] text-white rounded-xl shadow hover:bg-[#a97620] hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2">
                        Pay Now <CheckCircle size={16}/>
                      </button>
                    ) : (
                      <span className="px-4 py-1.5 bg-green-50 text-green-700 font-black rounded-lg text-sm border border-green-200 flex items-center gap-1">
                        <CheckCircle size={14}/> Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
