import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

export default function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart?.items?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-[#f8f0d7] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-[#c4922a]" />
        </div>
        <h2 className="text-3xl font-black text-[#1a1208] mb-2">Your Cart is Empty</h2>
        <p className="text-[#875c1b] mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-xl hover:-translate-y-1 transform transition-all text-lg">
          Start Shopping <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-[#875c1b] hover:text-[#c4922a] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black text-[#1a1208] mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-[#1a1208]">Items ({cart.items.length})</h2>
            <button onClick={clearCart} className="text-sm text-red-500 font-semibold hover:underline">Clear Cart</button>
          </div>

          {cart.items.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row gap-4 bg-white border border-[#f0dead] rounded-2xl p-4 items-start sm:items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover border border-[#f8f0d7]" />
              
              <div className="flex-1">
                <h3 className="font-bold text-[#1a1208] text-sm sm:text-base">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.itemType === 'rent' ? 'bg-[#f8f0d7] text-[#c4922a]' : 'bg-[#e5c47a] text-[#1a1208]'}`}>
                    {item.itemType === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                  {item.itemType === 'rent' && (
                    <span className="text-xs text-[#875c1b]">{item.rentDays} Days ({new Date(item.rentStartDate).toLocaleDateString()})</span>
                  )}
                </div>
                <p className="text-[#c4922a] font-black text-lg">₹{(item.itemType === 'rent' ? item.price * item.rentDays + (item.deposit || 0) : item.price).toLocaleString()}</p>
                {item.itemType === 'rent' && item.deposit > 0 && <p className="text-xs text-[#a09070]">Includes ₹{item.deposit} deposit</p>}
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                {item.itemType === 'sale' ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-lg bg-[#f8f0d7] text-[#875c1b] font-bold hover:bg-[#c4922a] hover:text-white transition-colors">−</button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-[#f8f0d7] text-[#875c1b] font-bold hover:bg-[#c4922a] hover:text-white transition-colors">+</button>
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-[#1a1208] px-3 py-1.5 bg-[#f8f0d7] rounded-lg">Qty: 1</div>
                )}
                
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#f8f0d7] rounded-2xl p-6 sticky top-24 border border-[#e5c47a]">
            <h2 className="text-xl font-bold text-[#1a1208] mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-[#5a4a35]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#5a4a35]">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t border-[#e5c47a] pt-3 flex justify-between font-black text-lg text-[#1a1208]">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#c4922a] to-[#875c1b] hover:shadow-xl hover:-translate-y-0.5 transform transition-all flex justify-center items-center gap-2">
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
