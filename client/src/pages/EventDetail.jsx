import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, Clock, MapPin, CheckCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pkg, setPkg]         = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [booking, setBooking] = useState(false);
  const [form, setForm]       = useState({ eventDate: '', eventTime: '', eventAddress: '', notes: '' });

  useEffect(() => {
    API.get(`/events/${id}`).then(r => { setPkg(r.data); setLoading(false); }).catch(() => navigate('/events'));
    API.get(`/reviews/package/${id}`).then(r => setReviews(r.data)).catch(() => {});
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); return navigate('/login'); }
    if (user.role !== 'customer') return toast.error('Only customers can book');
    setBooking(true);
    try {
      await API.post('/bookings', { packageId: id, ...form, city: pkg.city });
      toast.success('Booking confirmed! Check My Bookings.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setBooking(false);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-80 rounded-2xl bg-[#f8f0d7] mb-6" />
    </div>
  );
  if (!pkg) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden h-80 mb-4">
        {pkg.images?.length > 0 ? (
          <img src={pkg.images[imgIdx]} alt={pkg.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-8xl">🎉</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="bg-[#c4922a] text-white text-sm font-bold px-3 py-1 rounded-full">{pkg.eventType}</span>
        </div>
        {pkg.images?.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + pkg.images.length) % pkg.images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-xl flex items-center justify-center hover:bg-white shadow">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % pkg.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-xl flex items-center justify-center hover:bg-white shadow">
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Package Info */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-black text-[#1a1208] mb-3">{pkg.name}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#875c1b]">
            <div className="flex items-center gap-1"><Star size={14} fill="#c4922a" className="text-[#c4922a]" /> {pkg.rating} ({pkg.totalReviews} reviews)</div>
            <div className="flex items-center gap-1"><Clock size={14} /> {pkg.duration}</div>
            <div className="flex items-center gap-1"><MapPin size={14} /> {pkg.city}</div>
          </div>

          <p className="text-[#5a4a35] leading-relaxed mb-6">{pkg.description}</p>

          {/* Inclusions */}
          {pkg.inclusions?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-[#1a1208] mb-3">What's Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#5a4a35]">
                    <CheckCircle size={15} className="text-[#c4922a] mt-0.5 flex-shrink-0" /> {inc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendor Card */}
          {pkg.vendorId && (
            <Link to={`/vendor/${pkg.vendorId._id}`} className="block bg-[#f8f0d7] border border-[#e5c47a] rounded-2xl p-4 hover:border-[#c4922a] transition-colors">
              <div className="flex items-center gap-3">
                {pkg.vendorId.logo ? (
                  <img src={pkg.vendorId.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-white font-bold text-lg">
                    {pkg.vendorId.businessName?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-[#1a1208]">{pkg.vendorId.businessName}</p>
                  <p className="text-xs text-[#875c1b]">📍 {pkg.vendorId.city} · ⭐ {pkg.vendorId.rating || 0}</p>
                </div>
                <span className="ml-auto text-xs text-[#c4922a] font-semibold">View Profile →</span>
              </div>
            </Link>
          )}

          {/* Reviews */}
          <div className="mt-8">
            <h3 className="font-bold text-[#1a1208] mb-4">Reviews</h3>
            {reviews.length ? (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white border border-[#f0dead] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-white text-xs font-bold">{r.reviewerName?.[0]}</div>
                      <span className="font-semibold text-sm text-[#1a1208]">{r.reviewerName}</span>
                      <div className="flex gap-0.5 ml-auto">{[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= r.rating ? '#c4922a' : 'none'} className="text-[#c4922a]" />)}</div>
                    </div>
                    <p className="text-sm text-[#5a4a35]">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-[#a09070] text-sm">No reviews yet</p>}
          </div>
        </div>

        {/* Right: Booking Form */}
        <div>
          <div className="bg-white border border-[#e5c47a] rounded-2xl p-5 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-xs text-[#875c1b]">Starting from</p>
              <p className="text-3xl font-black text-[#1a1208]">₹{pkg.price?.toLocaleString()}</p>
            </div>
            <form onSubmit={handleBook} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Event Date</label>
                <input type="date" required min={new Date().toISOString().split('T')[0]}
                  value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Event Time</label>
                <input type="time" required value={form.eventTime} onChange={e => setForm({ ...form, eventTime: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Event Address</label>
                <textarea rows={2} required placeholder="Full address where setup needed"
                  value={form.eventAddress} onChange={e => setForm({ ...form, eventAddress: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a] resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#1a1208] mb-1 block">Notes (optional)</label>
                <textarea rows={2} placeholder="Any special requirements..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a] resize-none" />
              </div>
              <button type="submit" disabled={booking}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-lg hover:-translate-y-0.5 transform transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                <Calendar size={16} /> {booking ? 'Booking...' : 'Book This Package'}
              </button>
            </form>
            <p className="text-xs text-[#a09070] text-center mt-3">Payment after vendor confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
