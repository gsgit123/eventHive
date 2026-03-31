import { Link } from 'react-router-dom';
import { Star, Calendar, Clock, MapPin } from 'lucide-react';

const EVENT_GRADIENTS = {
  Birthday:     'from-pink-400 to-pink-600',
  Wedding:      'from-rose-400 to-red-600',
  Proposal:     'from-purple-400 to-purple-600',
  Anniversary:  'from-amber-400 to-orange-500',
  Festive:      'from-yellow-400 to-amber-500',
  'Baby Shower':'from-sky-400 to-blue-500',
  Corporate:    'from-slate-400 to-slate-600',
};

export default function EventPackageCard({ pkg }) {
  const gradient = EVENT_GRADIENTS[pkg.eventType] || 'from-[#c4922a] to-[#875c1b]';

  const getOptimizedUrl = (url) => url?.includes('unsplash.com') && !url.includes('&w=') ? `${url}&w=600` : url;
  const imageUrl = getOptimizedUrl(pkg.images?.[0]);

  return (
    <Link to={`/events/${pkg._id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-[#f0dead] hover:border-[#c4922a] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={pkg.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-white text-5xl">🎉</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className={`absolute top-3 left-3 bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {pkg.eventType}
          </span>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-base leading-tight line-clamp-2">{pkg.name}</h3>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} fill="#c4922a" className="text-[#c4922a]" />
            <span className="text-xs text-[#875c1b] font-medium">{pkg.rating || '0.0'}</span>
            <span className="text-xs text-[#a09070]">({pkg.totalReviews || 0} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-[#875c1b]"><Clock size={11} />{pkg.duration}</span>
            <span className="flex items-center gap-1 text-xs text-[#875c1b]"><MapPin size={11} />{pkg.city}</span>
          </div>

          {/* Inclusions preview */}
          {pkg.inclusions?.length > 0 && (
            <p className="text-xs text-[#a09070] mb-3 line-clamp-1">
              ✓ {pkg.inclusions.slice(0, 2).join(' · ')}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#a09070]">Starting from</p>
              <span className="text-xl font-black text-[#1a1208]">₹{pkg.price?.toLocaleString()}</span>
            </div>
            <span className="text-xs font-semibold text-[#c4922a] bg-[#f8f0d7] px-3 py-1.5 rounded-xl group-hover:bg-[#c4922a] group-hover:text-white transition-colors">
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
