import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import EventPackageCard from '../components/EventPackageCard';
import { ArrowRight, ShoppingBag, CalendarHeart, Star, Shield, Truck, Headphones } from 'lucide-react';

const CATEGORIES = [
  { name: 'Balloons',   emoji: '🎈', color: 'from-pink-400 to-rose-500' },
  { name: 'Lights',     emoji: '✨', color: 'from-yellow-400 to-amber-500' },
  { name: 'Flowers',    emoji: '🌸', color: 'from-purple-400 to-pink-500' },
  { name: 'Props',      emoji: '🎭', color: 'from-blue-400 to-indigo-500' },
  { name: 'Furniture',  emoji: '🪑', color: 'from-amber-500 to-orange-600' },
  { name: 'Backdrops',  emoji: '🖼️', color: 'from-teal-400 to-emerald-500' },
  { name: 'Candles',    emoji: '🕯️', color: 'from-orange-400 to-red-500' },
  { name: 'Tableware',  emoji: '🍽️', color: 'from-slate-400 to-gray-600' },
];

const EVENT_TYPES = [
  { type: 'Birthday',    emoji: '🎂', bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700' },
  { type: 'Wedding',     emoji: '💍', bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700' },
  { type: 'Proposal',    emoji: '💝', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { type: 'Anniversary', emoji: '🥂', bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700' },
  { type: 'Festive',     emoji: '🎊', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  { type: 'Baby Shower', emoji: '👶', bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-700' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingE, setLoadingE] = useState(true);

  useEffect(() => {
    API.get('/products/featured').then(r => { setFeaturedProducts(r.data); setLoadingP(false); }).catch(() => setLoadingP(false));
    API.get('/events/featured').then(r => { setFeaturedPackages(r.data); setLoadingE(false); }).catch(() => setLoadingE(false));
  }, []);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1208] via-[#2d1f0e] to-[#4a3018] min-h-[88vh] flex items-center">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c4922a22 0%, transparent 60%), radial-gradient(circle at 80% 20%, #87501822 0%, transparent 60%)' }} />
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#c4922a10] blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-[#87501810] blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#c4922a20] border border-[#c4922a40] text-[#c4922a] text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Star size={14} fill="#c4922a" /> India's #1 Event Decor Marketplace
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Make Every<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4922a] to-[#e5c47a]">
                  Celebration
                </span><br />
                Unforgettable
              </h1>
              <p className="text-[#a09070] text-lg leading-relaxed mb-8 max-w-md">
                Buy, rent or book complete decoration setups from verified vendors. Birthdays, weddings, proposals — we've got it all.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-2xl hover:shadow-[#c4922a40] hover:-translate-y-1 transform transition-all">
                  <ShoppingBag size={18} /> Shop Products
                </Link>
                <Link to="/events" className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[#c4922a] border-2 border-[#c4922a] hover:bg-[#c4922a] hover:text-white transition-all">
                  <CalendarHeart size={18} /> Book Decor
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-[#a09070]">
                <span>✓ 500+ Verified Vendors</span>
                <span>✓ Fixed Pricing</span>
                <span>✓ Rent Available</span>
              </div>
            </div>

            {/* Right side floating cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { emoji: '🎂', title: 'Birthday', price: '₹2,499' },
                { emoji: '💍', title: 'Wedding',  price: '₹15,999' },
                { emoji: '🎈', title: 'Balloon Arch', price: '₹899/day', rent: true },
                { emoji: '💝', title: 'Proposal',   price: '₹3,999' },
              ].map((c, i) => (
                <div key={i} className={`bg-[#ffffff0d] backdrop-blur-sm border border-[#c4922a30] rounded-2xl p-5 hover:border-[#c4922a] transition-all hover:-translate-y-1 ${i === 1 ? 'mt-6' : ''}`}>
                  <div className="text-4xl mb-3">{c.emoji}</div>
                  <div className="text-white font-bold text-sm">{c.title}</div>
                  <div className="text-[#c4922a] font-black text-lg">{c.price}</div>
                  {c.rent && <span className="text-xs bg-[#c4922a20] text-[#c4922a] px-2 py-0.5 rounded-full">Rentable</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1a1208]">Shop by Category</h2>
            <p className="text-[#875c1b] mt-1">Browse our curated event supplies</p>
          </div>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-[#c4922a] hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/shop?category=${cat.name}`}
              className="group flex flex-col items-center gap-2 p-4 bg-white border border-[#f0dead] rounded-2xl hover:border-[#c4922a] hover:shadow-lg transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold text-[#1a1208] text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1a1208]">Featured Products</h2>
            <p className="text-[#875c1b] mt-1">Top-rated event supplies — buy or rent</p>
          </div>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-[#c4922a] hover:gap-2 transition-all">
            See all <ArrowRight size={16} />
          </Link>
        </div>
        {loadingP ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#f8f0d7] animate-pulse h-72" />
            ))}
          </div>
        ) : featuredProducts.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[#a09070]">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Products coming soon!</p>
            <p className="text-sm mt-1">Vendors are setting up their stores</p>
          </div>
        )}
      </section>

      {/* ─── EVENT TYPES STRIP ─── */}
      <section className="py-12 bg-[#f8f0d7]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-[#1a1208] mb-2 text-center">What Are You Celebrating?</h2>
          <p className="text-[#875c1b] text-center mb-8">Complete decoration packages for every occasion</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {EVENT_TYPES.map(et => (
              <Link key={et.type} to={`/events?eventType=${et.type}`}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${et.bg} border ${et.border} hover:shadow-lg hover:-translate-y-1 transition-all`}>
                <span className="text-4xl">{et.emoji}</span>
                <span className={`text-sm font-bold ${et.text}`}>{et.type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PACKAGES ─── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#1a1208]">Popular Packages</h2>
            <p className="text-[#875c1b] mt-1">Complete decoration setups, booked in minutes</p>
          </div>
          <Link to="/events" className="flex items-center gap-1 text-sm font-semibold text-[#c4922a] hover:gap-2 transition-all">
            See all <ArrowRight size={16} />
          </Link>
        </div>
        {loadingE ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-[#f8f0d7] animate-pulse h-80" />)}
          </div>
        ) : featuredPackages.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPackages.map(p => <EventPackageCard key={p._id} pkg={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-[#a09070]">
            <CalendarHeart size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Packages coming soon!</p>
          </div>
        )}
      </section>

      {/* ─── WHY EVENTHIVE ─── */}
      <section className="py-16 bg-gradient-to-br from-[#1a1208] to-[#2d1f0e]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-white text-center mb-2">Why EventHive?</h2>
          <p className="text-[#a09070] text-center mb-12">The smarter way to plan event décor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Shield,      title: 'Verified Vendors',   desc: 'All vendors are manually verified for quality and reliability' },
              { Icon: Star,        title: 'Fixed Pricing',      desc: 'No bargaining. Transparent prices upfront always' },
              { Icon: Truck,       title: 'On-Time Setup',      desc: 'Vendors commit to your event date and time' },
              { Icon: Headphones,  title: '24/7 Support',       desc: 'Our team is always here to assist you' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="bg-[#ffffff08] border border-[#c4922a20] rounded-2xl p-6 hover:border-[#c4922a] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-[#a09070] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#1a1208] mb-4">Ready to plan your event?</h2>
          <p className="text-[#875c1b] mb-8">Join 10,000+ happy customers who planned their celebrations with EventHive</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-xl hover:-translate-y-1 transform transition-all text-lg">
              Get Started — It's Free
            </Link>
            <Link to="/events" className="px-8 py-4 rounded-xl font-bold text-[#c4922a] border-2 border-[#c4922a] hover:bg-[#f8f0d7] transition-colors text-lg">
              Browse Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
