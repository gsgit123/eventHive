import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart]       = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role !== 'customer') return;
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, options = {}) => {
    setCartLoading(true);
    try {
      const { data } = await API.post('/cart/add', { productId, ...options });
      setCart(data);
      return true;
    } catch { return false; }
    finally { setCartLoading(false); }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${itemId}`);
      setCart(data);
    } catch {}
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await API.put('/cart/update', { itemId, quantity });
      setCart(data);
    } catch {}
  };

  const clearCart = async () => {
    try { await API.delete('/cart/clear'); setCart({ items: [] }); } catch {}
  };

  const cartCount = cart.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const cartTotal = cart.items.reduce((sum, i) => {
    const base = i.itemType === 'rent'
      ? i.price * (i.rentDays || 1) + (i.deposit || 0)
      : i.price * (i.quantity || 1);
    return sum + base;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
