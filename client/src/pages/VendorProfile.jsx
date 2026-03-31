import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import EventPackageCard from '../components/EventPackageCard';
import { MapPin, Star, Package, CalendarHeart, ChevronLeft } from 'lucide-react';

export default function VendorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/vendors/${id}`).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-[#c4922a]">Loading...</div>;
  if (!data?.vendor) return <div className="p-8 text-center">Vendor not found</div>;

  const { vendor, products, packages } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header Profile */}
      <div className="bg-[#f8f0d7] rounded-3xl p-8 border border-[#e5c47a] mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
        
        <div className="w-32 h-32 rounded-3xl bg-white border-4 border-[#fffdf7] shadow-lg flex-shrink-0 relative z-10 overflow-hidden">
          {vendor.logo ? (
            <img src={vendor.logo} alt={vendor.businessName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-4xl font-black text-white">
              {vendor.businessName[0]}
            </div>
          )}
        </div>

        <div className="text-center md:text-left relative z-10 flex-1">
          <h1 className="text-4xl font-black text-[#1a1208] mb-2">{vendor.businessName}</h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-semibold text-[#875c1b] mb-4">
            <span className="flex items-center gap-1"><MapPin size={16} className="text-[#c4922a]"/> {vendor.city}</span>
            <span className="flex items-center gap-1"><Star size={16} fill="#c4922a" className="text-[#c4922a]"/> {vendor.rating || 0} ({vendor.totalReviews} reviews)</span>
          </div>
          
          <p className="text-[#5a4a35] max-w-2xl leading-relaxed">{vendor.description || 'Verified EventHive Vendor offering premium decorations and setups.'}</p>
        </div>
      </div>

      {/* Packages Section */}
      {packages.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6 text-[#1a1208]">
            <CalendarHeart className="text-[#c4922a]" />
            <h2 className="text-2xl font-black">Event Packages</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map(p => <EventPackageCard key={p._id} pkg={p} />)}
          </div>
        </div>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6 text-[#1a1208]">
            <Package className="text-[#c4922a]" />
            <h2 className="text-2xl font-black">Event Supplies (Sale & Rent)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
      
      {!packages.length && !products.length && (
        <p className="text-center text-[#875c1b]">This vendor hasn't listed any items yet.</p>
      )}
    </div>
  );
}
