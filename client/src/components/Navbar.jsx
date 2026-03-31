import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut, Package, Calendar, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav className="sticky top-0 z-50 bg-[#fffdf7]/85 backdrop-blur-lg border-b border-[#f0dead] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-black">E</span>
            </div>
            <span className="text-xl font-black text-[#1a1208]">
              Event<span className="text-[#c4922a]">Hive</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/"       className="text-sm font-medium text-[#1a1208] hover:text-[#c4922a] transition-colors">Home</Link>
            <Link to="/shop"   className="text-sm font-medium text-[#1a1208] hover:text-[#c4922a] transition-colors">Shop</Link>
            <Link to="/events" className="text-sm font-medium text-[#1a1208] hover:text-[#c4922a] transition-colors">Events</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {(!user || user.role === 'customer') && (
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-[#f8f0d7] transition-colors">
                <ShoppingCart size={20} className="text-[#1a1208]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#c4922a] text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f8f0d7] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-[#1a1208]">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-[#875c1b]" />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#fffdf7] border border-[#f0dead] rounded-2xl shadow-xl py-2 z-50">
                    {user.role === 'customer' && (
                      <>
                        <Link to="/my-orders"   onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#f8f0d7] text-[#1a1208]"><Package size={15} />My Orders</Link>
                        <Link to="/my-bookings" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#f8f0d7] text-[#1a1208]"><Calendar size={15} />My Bookings</Link>
                      </>
                    )}
                    {(user.role === 'vendor' || user.role === 'admin') && (
                      <Link to="/vendor/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#f8f0d7] text-[#1a1208]"><LayoutDashboard size={15} />Vendor Dashboard</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#f8f0d7] text-[#1a1208]"><LayoutDashboard size={15} />Admin Panel</Link>
                    )}
                    <div className="border-t border-[#f0dead] my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <LogOut size={15} />Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-[#875c1b] hover:text-[#c4922a] px-3 py-2 rounded-xl hover:bg-[#f8f0d7] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-semibold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] px-4 py-2 rounded-xl hover:shadow-md hover:-translate-y-0.5 transform transition-all">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-xl hover:bg-[#f8f0d7]" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#f0dead] py-3 space-y-1">
            <Link to="/"       onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#1a1208] hover:bg-[#f8f0d7] rounded-xl">Home</Link>
            <Link to="/shop"   onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#1a1208] hover:bg-[#f8f0d7] rounded-xl">Shop</Link>
            <Link to="/events" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-[#1a1208] hover:bg-[#f8f0d7] rounded-xl">Events</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
