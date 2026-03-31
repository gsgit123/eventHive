import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Pagination from '../components/Pagination';

const CATEGORIES = ['Balloons', 'Lights', 'Props', 'Flowers', 'Furniture', 'Backdrops', 'Candles', 'Ribbons', 'Tableware', 'Other'];
const LISTING_TYPES = [{ value: '', label: 'All' }, { value: 'sale', label: 'For Sale' }, { value: 'rent', label: 'For Rent' }];
const SORT_OPTIONS = [{ value: '', label: 'Newest' }, { value: 'price_asc', label: 'Price: Low to High' }, { value: 'price_desc', label: 'Price: High to Low' }, { value: 'rating', label: 'Top Rated' }];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '', category: searchParams.get('category') || '',
    listingType: searchParams.get('listingType') || '', sort: searchParams.get('sort') || '',
    minPrice: searchParams.get('minPrice') || '', maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1
  });

  const fetchProducts = async (f) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
      const { data } = await API.get('/products', { params });
      setProducts(data.products); setTotal(data.total); setPages(data.pages);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  useEffect(() => {
    const f = {
      search: searchParams.get('search') || '', category: searchParams.get('category') || '',
      listingType: searchParams.get('listingType') || '', sort: searchParams.get('sort') || '',
      minPrice: searchParams.get('minPrice') || '', maxPrice: searchParams.get('maxPrice') || '',
      page: Number(searchParams.get('page')) || 1
    };
    setFilters(f);
    fetchProducts(f);
  }, [searchParams]);

  const applyFilters = (overrides = {}) => {
    const current = { ...filters, ...overrides, page: overrides.page || 1 };
    const params = {};
    Object.entries(current).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1208]">Event Supplies</h1>
        <p className="text-[#875c1b] mt-1">{total} products available</p>
      </div>

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setShowFilters(false)} 
      />

      <div className="flex gap-6 items-stretch">
        {/* Sidebar filters */}
        <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#fffdf7] shadow-2xl transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64 lg:bg-transparent lg:shadow-none lg:flex-shrink-0 ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full overflow-y-auto p-5 custom-scrollbar lg:bg-white lg:border lg:border-[#f0dead] lg:rounded-2xl lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-6 lg:mb-4">
              <h3 className="font-bold text-[#1a1208] text-xl lg:text-base">Filters</h3>
              <div className="flex items-center gap-4">
                <button onClick={clearFilters} className="text-xs font-semibold text-[#c4922a] hover:underline">Clear all</button>
                <button onClick={() => setShowFilters(false)} className="lg:hidden text-[#875c1b] p-1 bg-[#f8f0d7] rounded-lg hover:bg-[#f0dead]"><X size={18}/></button>
              </div>
            </div>

            {/* Listing Type */}
            <div className="mb-5">
              <p className="text-xs font-bold text-[#875c1b] uppercase tracking-wider mb-2">Type</p>
              <div className="flex flex-col gap-1.5">
                {LISTING_TYPES.map(lt => (
                  <button key={lt.value} onClick={() => applyFilters({ listingType: lt.value })}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.listingType === lt.value ? 'bg-[#c4922a] text-white font-semibold' : 'text-[#1a1208] hover:bg-[#f8f0d7]'}`}>
                    {lt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-bold text-[#875c1b] uppercase tracking-wider mb-2">Category</p>
              <div className="flex flex-col gap-1.5">
                <button onClick={() => applyFilters({ category: '' })}
                  className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${!filters.category ? 'bg-[#c4922a] text-white font-semibold' : 'text-[#1a1208] hover:bg-[#f8f0d7]'}`}>
                  All Categories
                </button>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => applyFilters({ category: c })}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filters.category === c ? 'bg-[#c4922a] text-white font-semibold' : 'text-[#1a1208] hover:bg-[#f8f0d7]'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-5">
              <p className="text-xs font-bold text-[#875c1b] uppercase tracking-wider mb-2">Price Range (₹)</p>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-2 py-2 text-sm rounded-lg border border-[#e5c47a] focus:outline-none focus:ring-1 focus:ring-[#c4922a]" />
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-2 py-2 text-sm rounded-lg border border-[#e5c47a] focus:outline-none focus:ring-1 focus:ring-[#c4922a]" />
              </div>
            </div>

            <button onClick={() => { applyFilters(); setShowFilters(false); }}
              className="w-full py-3 lg:py-2.5 rounded-xl bg-gradient-to-r from-[#c4922a] to-[#875c1b] text-white font-semibold text-sm hover:shadow-md transition-all">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search + Sort bar */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09070]" />
              <input
                type="text" placeholder="Search products..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e5c47a] bg-white focus:outline-none focus:ring-2 focus:ring-[#c4922a] text-sm"
              />
            </div>
            <select value={filters.sort} onChange={e => applyFilters({ sort: e.target.value })}
              className="px-3 py-2.5 rounded-xl border border-[#e5c47a] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c4922a]">
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2.5 rounded-xl border border-[#e5c47a] bg-white">
              <SlidersHorizontal size={18} className="text-[#875c1b]" />
            </button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array(9).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-[#f8f0d7] animate-pulse h-72" />)}
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-[#a09070]">
              <Search size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <button onClick={clearFilters} className="mt-4 text-[#c4922a] font-semibold hover:underline">Clear filters</button>
            </div>
          )}

          {/* Pagination */}
          <Pagination 
            currentPage={filters.page} 
            totalPages={pages} 
            onPageChange={(p) => applyFilters({ page: p })} 
          />
        </div>
      </div>
    </div>
  );
}
