import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, CalendarHeart, ShoppingBag, Calendar, Settings, LogOut } from 'lucide-react';

export default function VendorSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'My Products', path: '/vendor/products', icon: Package },
    { name: 'My Packages', path: '/vendor/packages', icon: CalendarHeart },
    { name: 'Orders (Products)', path: '/vendor/orders', icon: ShoppingBag },
    { name: 'Bookings (Events)', path: '/vendor/bookings', icon: Calendar },
    { name: 'Settings', path: '/vendor/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#fffdf7] border-r border-[#f0dead] min-h-screen flex flex-col fixed left-0 top-0 bottom-0">
      <div className="h-16 flex items-center px-6 border-b border-[#f0dead]">
        <Link to="/" className="text-xl font-black text-[#1a1208]">
          Event<span className="text-[#c4922a]">Hive</span> <span className="text-xs font-bold text-[#875c1b] px-2 py-0.5 bg-[#f8f0d7] rounded-md ml-1">VENDOR</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(l => (
          <Link key={l.path} to={l.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              pathname === l.path ? 'bg-[#c4922a] text-white shadow-md' : 'text-[#875c1b] hover:bg-[#f8f0d7] hover:text-[#c4922a]'
            }`}>
            <l.icon size={18} /> {l.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#f0dead]">
        <button onClick={() => { logout(); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
