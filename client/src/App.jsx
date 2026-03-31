import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import VendorProfile from './pages/VendorProfile';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import MyBookings from './pages/MyBookings';

// Vendor pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorPackages from './pages/vendor/Packages';
import VendorOrders from './pages/vendor/Orders';
import VendorBookings from './pages/vendor/Bookings';
import VendorSettings from './pages/vendor/Settings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminVendors from './pages/admin/Vendors';
import AdminOrders from './pages/admin/Orders';
import AdminBookings from './pages/admin/Bookings';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const NoNavFooter = ({ children }) => <>{children}</>;

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Routes>
        {/* Auth Routes — no navbar */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Vendor Dashboard — separate layout */}
        <Route path="/vendor/*" element={
          <ProtectedRoute roles={['vendor', 'admin']}>
            <Routes>
              <Route path="dashboard" element={<VendorDashboard />} />
              <Route path="products"  element={<VendorProducts />} />
              <Route path="packages"  element={<VendorPackages />} />
              <Route path="orders"    element={<VendorOrders />} />
              <Route path="bookings"  element={<VendorBookings />} />
              <Route path="settings"  element={<VendorSettings />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Admin Dashboard */}
        <Route path="/admin/*" element={
          <ProtectedRoute roles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vendors"   element={<AdminVendors />} />
              <Route path="orders"    element={<AdminOrders />} />
              <Route path="bookings"  element={<AdminBookings />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Public + Customer Routes with Navbar/Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"              element={<Home />} />
                <Route path="/shop"          element={<Shop />} />
                <Route path="/shop/:id"      element={<ProductDetail />} />
                <Route path="/events"        element={<Events />} />
                <Route path="/events/:id"    element={<EventDetail />} />
                <Route path="/vendor/:id"    element={<VendorProfile />} />
                <Route path="/cart"          element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
                <Route path="/checkout"      element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
                <Route path="/my-orders"     element={<ProtectedRoute roles={['customer']}><MyOrders /></ProtectedRoute>} />
                <Route path="/my-bookings"   element={<ProtectedRoute roles={['customer']}><MyBookings /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}
