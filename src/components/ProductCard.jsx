import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatImageUrl } from '../utils/imageUtils';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isLiked = isInWishlist(product.id || product._id);

  const variantPrices = (product.sizeVariants && Array.isArray(product.sizeVariants))
    ? product.sizeVariants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0)
    : [];
  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : Number(product.price || 0);
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : Number(product.price || 0);
  const hasPriceRange = minPrice !== maxPrice && variantPrices.length > 1;

  const displayPrice = hasPriceRange ? minPrice : (product.price || minPrice || 0);
  const discountPercent = product.mrp
    ? Math.round(((product.mrp - displayPrice) / product.mrp) * 100)
    : 0;

  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  const handleCardClick = (e) => {
    // Avoid navigating if clicking heart, navigation arrows, dots or cart button
    if (e.target.closest('.no-card-nav')) return;
    navigate(`/product/${product.id || product._id}`);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-3 border border-pink-100/70 hover:border-pink-300 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] md:aspect-auto md:h-[350px] w-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-pink-50/40 p-1 mb-2.5 group/img">
        <img
          src={formatImageUrl(imageList[currentImageIndex] || imageList[0])}
          alt={product.name}
          className="w-full h-full object-cover object-top rounded-lg transition-transform duration-500"
          loading="lazy"
        />

        {/* Left & Right Image Navigation Arrow Buttons */}
        <button
          type="button"
          onClick={handlePrevImage}
          className="no-card-nav absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-110 border border-pink-100/90 active:scale-95"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNextImage}
          className="no-card-nav absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-110 border border-pink-100/90 active:scale-95"
          aria-label="Next Image"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Pagination Dots Indicator for multiple photos */}
        {imageList.length > 1 && (
          <div className="no-card-nav absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {imageList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentImageIndex === idx
                    ? 'w-2 h-2 bg-[#D81B60]'
                    : 'w-1.5 h-1.5 bg-white/80 hover:bg-white'
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top-Left Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-pink-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-amber-400 text-gray-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isTrending && !product.isNew && (
            <span className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              TRENDING
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id || product._id);
          }}
          className="no-card-nav absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-600 hover:text-pink-600 shadow-xs hover:scale-110 transition-all z-10 cursor-pointer"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-pink-600 fill-pink-600' : ''}`} />
        </button>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-500">({product.reviewsCount || 12})</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors mb-1.5">
            {product.name}
          </h3>
        </div>

        {/* Price & Colors Row */}
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm md:text-base font-extrabold text-gray-900 font-mono">
                {hasPriceRange
                  ? `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`
                  : `₹${Number(product.price || minPrice || 0).toLocaleString('en-IN')}`}
              </span>
              {product.mrp && product.mrp > (hasPriceRange ? minPrice : product.price) && (
                <span className="text-xs text-gray-400 line-through font-mono">
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Color Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-gray-300 shadow-2xs"
                    style={{ backgroundColor: typeof c === 'string' ? c : c.hex }}
                    title={typeof c === 'string' ? c : c.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Card Bottom CTA Button */}
          <div className="pt-2 mt-1.5 border-t border-gray-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, product.sizes?.[0] || 'Standard', 1);
              }}
              className="no-card-nav w-full bg-[#FFF0F4] hover:bg-[#D81B60] text-[#D81B60] hover:text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl border border-pink-200/80 hover:border-transparent shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ADD TO CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
