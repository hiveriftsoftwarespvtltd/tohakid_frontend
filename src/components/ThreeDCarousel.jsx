import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart, Star, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatImageUrl } from '../utils/imageUtils';

export default function ThreeDCarousel({ items = [], autoPlay = true, interval = 3500 }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardImageIndices, setCardImageIndices] = useState({});
  const touchStartX = useRef(0);

  const getItemImages = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) return item.images;
    if (item.image) return [item.image];
    return [];
  };

  const itemCount = items.length;

  useEffect(() => {
    if (!autoPlay || isHovered || itemCount <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, itemCount, interval]);

  if (!items || itemCount === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % itemCount);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  // Compute 3D transformation properties for each item index
  const getCardStyle = (index) => {
    let offset = index - activeIndex;

    // Handle wrapping for infinite loop illusion
    if (offset > itemCount / 2) offset -= itemCount;
    if (offset < -itemCount / 2) offset += itemCount;

    const absOffset = Math.abs(offset);

    // Only render cards within range of 2 on either side
    if (absOffset > 2) {
      return { display: 'none' };
    }

    // 3D Coverflow Matrix Calculations
    const rotateY = offset === 0 ? 0 : offset < 0 ? 32 : -32;
    const translateX = offset * 220; // horizontal separation
    const translateZ = offset === 0 ? 120 : -140 * absOffset;
    const scale = offset === 0 ? 1.05 : 0.82 - absOffset * 0.05;
    const opacity = offset === 0 ? 1 : Math.max(0.4, 0.85 - absOffset * 0.25);
    const zIndex = 30 - absOffset * 10;

    return {
      transform: `perspective(1200px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <div
      className="relative w-full py-8 md:py-12 overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Soft Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[300px] bg-gradient-to-r from-pink-200/40 via-purple-200/30 to-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Stage Container */}
      <div className="relative h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center">
        {items.map((item, idx) => {
          const isCenter = idx === activeIndex;
          const isWishlisted = wishlist.some((w) => (w.id || w._id) === (item.id || item._id));
          const style = getCardStyle(idx);
          const itemImages = getItemImages(item);
          const currentImgIdx = cardImageIndices[item.id || item._id || idx] || 0;
          const currentImgSrc = itemImages[currentImgIdx] || itemImages[0] || item.image;

          const handlePrevCardImage = (e) => {
            e.stopPropagation();
            if (itemImages.length > 1) {
              setCardImageIndices((prev) => ({
                ...prev,
                [item.id || item._id || idx]:
                  currentImgIdx === 0 ? itemImages.length - 1 : currentImgIdx - 1,
              }));
            } else {
              handlePrev();
            }
          };

          const handleNextCardImage = (e) => {
            e.stopPropagation();
            if (itemImages.length > 1) {
              setCardImageIndices((prev) => ({
                ...prev,
                [item.id || item._id || idx]: (currentImgIdx + 1) % itemImages.length,
              }));
            } else {
              handleNext();
            }
          };

          if (style.display === 'none') return null;

          return (
            <div
              key={item.id || item._id || idx}
              onClick={(e) => {
                if (e.target.closest('button')) return;
                if (!isCenter) {
                  setActiveIndex(idx);
                } else {
                  navigate(`/product/${item.id || item._id}`);
                }
              }}
              style={style}
              className="absolute w-[240px] sm:w-[280px] md:w-[310px] transition-all duration-500 ease-out cursor-pointer rounded-3xl"
            >
              <div
                className={`relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 isolate ${isCenter
                    ? 'border-pink-300 shadow-2xl shadow-pink-500/20 ring-4 ring-pink-100'
                    : 'border-gray-200/80 shadow-lg hover:border-pink-200'
                  }`}
                style={{
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  isolation: 'isolate',
                }}
              >
                {/* Product Image Container */}
                <div
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    if (isCenter) {
                      e.stopPropagation();
                      navigate(`/product/${item.id || item._id}`);
                    }
                  }}
                  className="relative aspect-[4/5] bg-pink-50/40 rounded-t-3xl overflow-hidden group cursor-pointer isolate"
                  style={{
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    isolation: 'isolate',
                  }}
                >
                  <img
                    src={formatImageUrl(currentImgSrc)}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                  />

                  {/* Left & Right Image Navigation Buttons directly on Image (Only on hover if multiple images) */}
                  {itemImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevCardImage}
                        className="opacity-0 group-hover:opacity-100 absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-110 border border-pink-100/90 active:scale-95"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        onClick={handleNextCardImage}
                        className="opacity-0 group-hover:opacity-100 absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-110 border border-pink-100/90 active:scale-95"
                        aria-label="Next Image"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      </button>
                    </>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer ${isWishlisted
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white hover:text-pink-600'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Card Text & Pricing Info */}
                <div
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    if (isCenter) {
                      e.stopPropagation();
                      navigate(`/product/${item.id || item._id}`);
                    }
                  }}
                  className="p-4 bg-white text-center space-y-1.5 cursor-pointer"
                >
                  <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-widest block">
                    {item.category || 'Kids Ethnic'}
                  </span>

                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${item.id || item._id}`);
                    }}
                    className="font-heading font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1 hover:text-[#D81B60] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-center gap-2 pt-0.5">
                    <span className="font-extrabold text-sm sm:text-base text-gray-900">
                      ₹{(item.price || 0).toLocaleString()}
                    </span>
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-xs text-gray-400 line-through font-semibold">
                        ₹{item.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3D Navigation Controls (Only when multiple items exist) */}
      {itemCount > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-[#D81B60] border border-pink-200/80 flex items-center justify-center hover:bg-[#D81B60] hover:text-white transition-all z-40 hover:scale-110 cursor-pointer"
            aria-label="Previous 3D Slide"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-[#D81B60] border border-pink-200/80 flex items-center justify-center hover:bg-[#D81B60] hover:text-white transition-all z-40 hover:scale-110 cursor-pointer"
            aria-label="Next 3D Slide"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Pagination Dots Indicator */}
      <div className="flex items-center justify-center gap-2 pt-4 z-40 relative">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                ? 'w-6 h-2.5 bg-[#D81B60] shadow-sm'
                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-pink-300'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
