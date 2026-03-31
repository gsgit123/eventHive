import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (user.role !== 'customer') { toast.error('Only customers can shop'); return; }
    const ok = await addToCart(product._id, { quantity: 1, itemType: 'sale' });
    if (ok) toast.success('Added to cart!');
    else toast.error('Failed to add to cart');
  };

  const displayPrice = product.listingType === 'rent' ? product.rentPrice : (product.discountPrice || product.salePrice);
  const originalPrice = product.discountPrice ? product.salePrice : null;
  const discount = originalPrice ? Math.round((1 - product.discountPrice / product.salePrice) * 100) : null;

  const getOptimizedUrl = (url) => url?.includes('unsplash.com') && !url.includes('&w=') ? `${url}&w=600` : url;
  const imageUrl = getOptimizedUrl(product.images?.[0]);

  return (
    <Link to={`/shop/${product._id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden border border-[#f0dead] hover:border-[#c4922a] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-[#f8f0d7]">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#c4922a]">
              <Tag size={48} className="opacity-30" />
            </div>
          )}
          {discount && (
            <span className="absolute top-3 left-3 bg-[#c4922a] text-white text-xs font-bold px-2 py-1 rounded-lg">
              {discount}% OFF
            </span>
          )}
          {product.listingType !== 'sale' && (
            <span className="absolute top-3 right-3 bg-[#1a1208] text-[#c4922a] text-xs font-bold px-2 py-1 rounded-lg">
              {product.listingType === 'both' ? 'Sale+Rent' : 'Rent'}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#875c1b] font-medium mb-1">{product.category}</p>
          <h3 className="font-semibold text-[#1a1208] text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} fill="#c4922a" className="text-[#c4922a]" />
            <span className="text-xs text-[#875c1b] font-medium">{product.rating || '0.0'}</span>
            <span className="text-xs text-[#a09070]">({product.totalReviews || 0})</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-[#1a1208]">₹{displayPrice?.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-xs text-[#a09070] line-through ml-1.5">₹{originalPrice?.toLocaleString()}</span>
              )}
              {product.listingType === 'rent' && (
                <span className="text-xs text-[#875c1b] block">/day</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c4922a] to-[#875c1b] flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-0.5 transform transition-all"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
