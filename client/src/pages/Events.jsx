import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import EventPackageCard from '../components/EventPackageCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { Search, CalendarHeart } from 'lucide-react';

const EVENT_TYPES = ['Birthday', 'Wedding', 'Proposal', 'Anniversary', 'Festive', 'Baby Shower', 'Corporate'];
const SORT_OPTIONS = [{ value: '', label: 'Newest' }, { value: 'price_asc', label: 'Price: Low to High' }, { value: 'price_desc', label: 'Price: High to Low' }, { value: 'rating', label: 'Top Rated' }];

export default function Events() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);

  const [filters, setFilters] = useState({
    eventType: searchParams.get('eventType') || '',
    sort:      '',
    minPrice:  '',
    maxPrice:  '',
    city:      user?.city || '',
    page:      1,
  });

  const fetchPackages = async (f = filters) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const { data } = await API.get('/events', { params });
      setPackages(data.packages);
      setTotal(data.total);
      setPages(data.pages);
    } catch { setPackages([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPackages(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1208]">Event Decoration Packages</h1>
        <p className="text-[#875c1b] mt-1">{total} packages available{user?.city ? ` in ${user.city}` : ''}</p>
      </div>

      {/* City notice */}
      {user?.city && (
        <div className="mb-6 px-4 py-3 bg-[#f8f0d7] border border-[#e5c47a] rounded-xl text-sm text-[#875c1b] flex items-center gap-2">
          📍 Showing packages available in <strong>{user.city}</strong>. Event vendors serve their local city only.
        </div>
      )}

      {/* Event Type Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { const f = { ...filters, eventType: '', page: 1 }; setFilters(f); fetchPackages(f); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!filters.eventType ? 'bg-[#c4922a] text-white' : 'bg-white border border-[#e5c47a] text-[#875c1b] hover:border-[#c4922a]'}`}>
          All Events
        </button>
        {EVENT_TYPES.map(et => (
          <button key={et} onClick={() => { const f = { ...filters, eventType: et, page: 1 }; setFilters(f); fetchPackages(f); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filters.eventType === et ? 'bg-[#c4922a] text-white' : 'bg-white border border-[#e5c47a] text-[#875c1b] hover:border-[#c4922a]'}`}>
            {et}
          </button>
        ))}
      </div>

      {/* Sort + Price */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filters.sort} onChange={e => { const f = { ...filters, sort: e.target.value, page: 1 }; setFilters(f); fetchPackages(f); }}
          className="px-3 py-2 rounded-xl border border-[#e5c47a] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]">
          {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="number" placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
          onBlur={() => fetchPackages({ ...filters, page: 1 })}
          className="w-24 px-3 py-2 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
        <input type="number" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
          onBlur={() => fetchPackages({ ...filters, page: 1 })}
          className="w-24 px-3 py-2 rounded-xl border border-[#e5c47a] text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]" />
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-[#f8f0d7] animate-pulse h-80" />)}
        </div>
      ) : packages.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map(p => <EventPackageCard key={p._id} pkg={p} />)}
          </div>
          <Pagination 
            currentPage={filters.page} 
            totalPages={pages} 
            onPageChange={(p) => { const f = { ...filters, page: p }; setFilters(f); fetchPackages(f); }} 
          />
        </>
      ) : (
        <div className="text-center py-20 text-[#a09070]">
          <CalendarHeart size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-lg">No packages found</p>
          <p className="text-sm mt-1">{user?.city ? `No vendors serving ${user.city} yet` : 'Try different filters'}</p>
        </div>
      )}
    </div>
  );
}
