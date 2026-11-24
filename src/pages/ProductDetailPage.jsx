import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw,
  Ruler, Share2, Check, MapPin, ChevronRight, Tag, Info,
  ZoomIn, ZoomOut, Maximize2, X, ChevronLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Swal from 'sweetalert2';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';
import { formatImageUrl } from '../utils/imageUtils';
import { productService } from '../services/productService';
import { enrichProductWithVariants, findMatchedVariant, isProductSizeAvailable } from '../utils/variantStorage';
import { getSizeAgeLabel, getSizeCompactLabel, getFullProductSizeList } from '../utils/sizeConstants';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    isLoggedIn,
    user,
    addresses,
    freeShippingThreshold,
    clearCart,
    refreshOrders,
    showToast,
  } = useShop();

  const [remoteProduct, setRemoteProduct] = useState(null);
  const [variantUpdateTrigger, setVariantUpdateTrigger] = useState(0);

  // Load single product fresh from API if available
  useEffect(() => {
    let isMounted = true;
    if (id) {
      productService.getProductById(id)
        .then((res) => {
          if (isMounted && res?.data) {
            setRemoteProduct(res.data);
          }
        })
        .catch(() => { });
    }

    const handleUpdate = () => {
      setVariantUpdateTrigger((prev) => prev + 1);
    };

    window.addEventListener('variants_updated', handleUpdate);
    window.addEventListener('products_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('variants_updated', handleUpdate);
      window.removeEventListener('products_updated', handleUpdate);
    };
  }, [id]);

  const rawProduct = useMemo(() => {
    if (remoteProduct) return remoteProduct;
    if (!products || products.length === 0) return null;
    return products.find((p) => String(p.id) === String(id) || String(p._id) === String(id)) || products[0] || null;
  }, [remoteProduct, products, id, variantUpdateTrigger]);

  const product = useMemo(() => {
    if (!rawProduct) return null;
    return enrichProductWithVariants(rawProduct);
  }, [rawProduct, variantUpdateTrigger]);

  const displaySizes = useMemo(() => {
    if (!product) return [];
    return getFullProductSizeList(product);
  }, [product]);

  const images = (product?.images && product.images.length > 0)
    ? product.images
    : (product?.image ? [product.image] : ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80']);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(displaySizes[0] || '');
  const [child1Size, setChild1Size] = useState(displaySizes[0] || '');
  const [child2Size, setChild2Size] = useState(displaySizes[1] || displaySizes[0] || '');
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, isHovered: false });
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleMouseMove = (e) => {
    // Disable in-card zoom on mobile / touch devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, isHovered: true });
  };

  const handleMouseLeave = () => {
    setZoomPos({ x: 50, y: 50, isHovered: false });
  };

  const handleSelectImage = (idx) => {
    setZoomPos({ x: 50, y: 50, isHovered: false });
    setActiveImage(idx);
  };

  // Touch Swipe tracking refs for mobile image slider
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isSwipingRef = useRef(false);

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setZoomPos({ x: 50, y: 50, isHovered: false });
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setZoomPos({ x: 50, y: 50, isHovered: false });
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.touches[0].clientX;
    const diffY = touchStartYRef.current - e.touches[0].clientY;

    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    const minSwipeDistance = 35; // 35px threshold

    if (Math.abs(diffX) > minSwipeDistance && images.length > 1) {
      if (diffX > 0) {
        // Swiped left -> Next photograph
        handleNextImage();
      } else {
        // Swiped right -> Previous photograph
        handlePrevImage();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setTimeout(() => {
      isSwipingRef.current = false;
    }, 150);
  };

  const handleMainImageClick = (e) => {
    if (isSwipingRef.current) return;
    if (e.target.closest('.no-zoom-trigger')) return;
    setLightboxScale(1);
    setIsZoomModalOpen(true);
  };

  const isSizeInStock = (sizeName) => isProductSizeAvailable(product, sizeName);

  useEffect(() => {
    if (displaySizes && displaySizes.length > 0) {
      const availableSizes = displaySizes.filter((sz) => isProductSizeAvailable(product, sz));
      const firstInStock = availableSizes[0] || '';

      setSelectedSize(firstInStock);
      setChild1Size(availableSizes[0] || '');
      setChild2Size(availableSizes[1] || availableSizes[0] || '');
    } else {
      setSelectedSize('');
      setChild1Size('');
      setChild2Size('');
    }
  }, [displaySizes, product]);

  // Dynamic Size Variant Matching
  const activeVariant = useMemo(() => {
    if (!product?.sizeVariants || !Array.isArray(product.sizeVariants) || product.sizeVariants.length === 0) {
      return null;
    }
    return findMatchedVariant(product.sizeVariants, selectedSize);
  }, [product?.sizeVariants, selectedSize]);

  // Current active price, MRP, and discount based on chosen size
  const currentPrice = useMemo(() => {
    if (activeVariant) {
      const p = Number(activeVariant.price);
      if (!isNaN(p) && p > 0) return p;
    }
    return Number(product?.price) || 0;
  }, [activeVariant, product?.price]);

  const currentMrp = useMemo(() => {
    if (activeVariant) {
      const m = Number(activeVariant.mrp);
      if (!isNaN(m) && m > 0) return m;
    }
    return Number(product?.mrp) || currentPrice;
  }, [activeVariant, product?.mrp, currentPrice]);

  const discountPercent = useMemo(() => {
    if (!currentMrp || currentMrp <= currentPrice) return 0;
    return Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
  }, [currentPrice, currentMrp]);

  const isCurrentSizeAvailable = useMemo(() => {
    if (!selectedSize) return false;
    return isProductSizeAvailable(product, selectedSize);
  }, [selectedSize, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-gray-800">Product Not Found</h2>
        <p className="text-sm text-gray-500">The product you are looking for is currently not available.</p>
        <Link to="/" className="inline-block bg-pink-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id || product._id);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        valid: true,
        message: 'Delivery available! Estimated delivery in 3 to 5 business days.'
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian pincode.'
      });
    }
  };

  const handleAddToCart = () => {
    if (!isCurrentSizeAvailable) return;
    addToCart(product, selectedSize, quantity, {
      price: currentPrice,
      mrp: currentMrp,
      child1Size: product.isSiblingSet ? child1Size : null,
      child2Size: product.isSiblingSet ? child2Size : null
    });
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isCurrentSizeAvailable) {
      showToast('Selected size is out of stock.');
      return;
    }
    await addToCart(product, selectedSize, quantity, {
      price: currentPrice,
      mrp: currentMrp,
      child1Size: product.isSiblingSet ? child1Size : null,
      child2Size: product.isSiblingSet ? child2Size : null,
    });
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && (p.id || p._id) !== (product.id || product._id))
    .slice(0, 4);

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-6 sm:space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <Link to="/" className="hover:text-pink-600 transition-colors shrink-0">Home</Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
        <Link to={`/${product.category.toLowerCase()}`} className="hover:text-pink-600 transition-colors shrink-0">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 shrink-0" />
        <span className="text-pink-600 font-bold truncate max-w-[160px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-2.5 sm:gap-4">
          {/* Thumbnail list */}
          <div className="flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0 py-0.5">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectImage(idx)}
                className={`w-13 h-16 sm:w-16 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImage === idx ? 'border-pink-600 ring-2 ring-pink-200 scale-102' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>

          {/* Large Main Image with Interactive Magnifier Lens & Touch Swipe Slider */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleMainImageClick}
            className="relative flex-1 aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-pink-50/50 border border-pink-100 shadow-xs cursor-zoom-in group select-none touch-pan-y"
          >
            {/* Image Slide Counter Badge (e.g. 1 / 4) */}
            {images.length > 1 && (
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-black/55 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full z-10 pointer-events-none select-none shadow-sm">
                {activeImage + 1} / {images.length}
              </div>
            )}

            <img
              key={activeImage}
              src={formatImageUrl(images[activeImage])}
              alt={`${product.name} view ${activeImage + 1}`}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: (zoomPos.isHovered && typeof window !== 'undefined' && window.innerWidth >= 768) ? 'scale(2.4)' : 'scale(1)'
              }}
              className="w-full h-full object-cover object-top transition-transform duration-150 ease-out pointer-events-none"
            />

            {/* Hover Instruction Pill (Desktop only) */}
            <div className="hidden sm:flex absolute bottom-3 right-3 bg-black/65 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full items-center gap-1.5 z-10 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity shadow-md">
              <Maximize2 className="w-3 h-3 text-pink-300" />
              <span>{zoomPos.isHovered ? 'Hovering & Zooming Fabric' : 'Click for Fullscreen Zoom'}</span>
            </div>

            {/* Mobile Swipe Pagination Dots Indicator */}
            {images.length > 1 && (
              <div className="no-zoom-trigger absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full sm:hidden pointer-events-auto">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectImage(idx);
                    }}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      activeImage === idx
                        ? 'w-2.5 h-2 bg-[#D81B60]'
                        : 'w-1.5 h-1.5 bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Go to photograph ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Left Image Navigation Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="no-zoom-trigger absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 border border-pink-100/80 active:scale-95"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Right Image Navigation Arrow Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="no-zoom-trigger absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-[#D81B60] shadow-md flex items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 border border-pink-100/80 active:scale-95"
                aria-label="Next Image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}

            {/* Wishlist Floating Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id || product._id);
              }}
              className="no-zoom-trigger absolute top-2.5 right-2.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 hover:text-pink-600 shadow-md hover:scale-105 transition-all z-20 cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'text-pink-600 fill-pink-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
              {product.category} • {product.subcategory}
            </span>

            <h1 className="font-heading font-extrabold text-lg sm:text-2xl md:text-3xl text-gray-900 mt-1.5 sm:mt-2 leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-xs">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-bold text-gray-700">{product.rating} / 5.0</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{product.reviewsCount} Customer Reviews</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-3 sm:p-4 bg-pink-50/50 rounded-xl sm:rounded-2xl border border-pink-100/80 flex flex-wrap items-baseline gap-2 sm:gap-3 transition-all">
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">₹{currentPrice.toLocaleString('en-IN')}</span>
            {currentMrp > currentPrice && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through font-mono">₹{currentMrp.toLocaleString('en-IN')}</span>
                <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  ({discountPercent}% OFF)
                </span>
              </>
            )}
            <span className="text-[10px] sm:text-[11px] text-gray-500 ml-auto block">Inclusive of all taxes</span>
          </div>

          {/* Size Selection */}
          {!product.isSiblingSet ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wide">Select Age / Size:</span>
                  {selectedSize && (
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#D81B60]">
                      ({selectedSize}{getSizeAgeLabel(selectedSize) ? ` • ${getSizeAgeLabel(selectedSize)}` : ''})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[11px] sm:text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Size Chart
                </button>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {displaySizes?.map((sz) => {
                  const inStock = isSizeInStock(sz);
                  const compactAge = getSizeCompactLabel(sz);
                  const isSelected = inStock && selectedSize === sz;

                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        if (inStock) setSelectedSize(sz);
                      }}
                      disabled={!inStock}
                      aria-disabled={!inStock}
                      className={`relative overflow-hidden min-w-[48px] sm:min-w-[56px] min-h-[40px] sm:min-h-[44px] px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center select-none ${
                        isSelected
                          ? 'bg-[#D81B60] text-white shadow-md ring-2 ring-pink-300 font-extrabold scale-105 cursor-pointer'
                          : inStock
                            ? 'bg-white text-gray-800 border border-gray-200 hover:border-pink-300 hover:bg-pink-50/40 hover:text-[#D81B60] cursor-pointer'
                            : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                      }`}
                      title={!inStock ? `${sz} (Not Available)` : `${sz}${getSizeAgeLabel(sz) ? ` (${getSizeAgeLabel(sz)})` : ''}`}
                    >
                      <span className={`leading-none ${!inStock ? 'line-through text-gray-400' : ''}`}>{sz}</span>
                      {compactAge && (
                        <span className={`text-[9px] font-semibold tracking-tight leading-none mt-0.5 whitespace-nowrap ${
                          isSelected ? 'text-pink-100' : !inStock ? 'line-through text-gray-400' : 'text-gray-500'
                        }`}>
                          {compactAge}
                        </span>
                      )}
                      {!inStock && (
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-0 w-full h-full text-rose-400/80"
                        >
                          <line
                            x1="0"
                            y1="100"
                            x2="100"
                            y2="0"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Sibling Dual Size Selector Flow */
            <div className="space-y-2.5 p-3 sm:p-4 bg-purple-50 rounded-xl sm:rounded-2xl border border-purple-100">
              <div className="flex justify-between items-center">
                <span className="text-[11px] sm:text-xs font-bold text-purple-900 uppercase">Dual Sibling Sizes Needed:</span>
                <button type="button" onClick={() => setIsSizeGuideOpen(true)} className="text-[11px] sm:text-xs font-bold text-purple-700 flex items-center gap-1">
                  <Ruler className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Size Guide
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">Child 1 Size:</label>
                  <select
                    value={child1Size}
                    onChange={(e) => setChild1Size(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 font-bold text-xs"
                  >
                    {displaySizes?.map((sz) => {
                      const inStock = isSizeInStock(sz);
                      return (
                        <option key={sz} value={sz} disabled={!inStock}>
                          {sz}{getSizeAgeLabel(sz) ? ` (${getSizeAgeLabel(sz)})` : ''}{!inStock ? ' — Not Available' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1 text-[11px]">Child 2 Size:</label>
                  <select
                    value={child2Size}
                    onChange={(e) => setChild2Size(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 font-bold text-xs"
                  >
                    {displaySizes?.map((sz) => {
                      const inStock = isSizeInStock(sz);
                      return (
                        <option key={sz} value={sz} disabled={!inStock}>
                          {sz}{getSizeAgeLabel(sz) ? ` (${getSizeAgeLabel(sz)})` : ''}{!inStock ? ' — Not Available' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-2.5 sm:space-y-3 pt-1">
            <div className="flex items-center gap-2.5 sm:gap-4">
              <div className="flex items-center bg-gray-100 border border-gray-300/80 rounded-xl p-0.5 sm:p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold text-gray-600 hover:text-gray-900 cursor-pointer active:scale-95"
                >
                  -
                </button>
                <span className="px-2 sm:px-3 text-xs font-mono font-extrabold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base font-bold text-gray-600 hover:text-gray-900 cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isCurrentSizeAvailable}
                className={`flex-1 font-extrabold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${isCurrentSizeAvailable
                    ? 'bg-pink-600 hover:bg-pink-700 text-white cursor-pointer hover:shadow-md active:scale-98'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isCurrentSizeAvailable ? 'Add to Bag' : 'Out of Stock'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isCurrentSizeAvailable}
              className={`w-full font-extrabold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-sm ${isCurrentSizeAvailable
                  ? 'bg-gray-900 hover:bg-black text-white cursor-pointer active:scale-98'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
            >
              {isCurrentSizeAvailable ? 'Buy Now' : 'Unavailable in this Size'}
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-gray-800">
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              <span>Check Delivery & Pincode:</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden font-mono"
              />
              <button type="submit" className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 cursor-pointer">
                Check
              </button>
            </form>

            {pincodeStatus && (
              <p className={`text-[11px] font-semibold ${pincodeStatus.valid ? 'text-emerald-600' : 'text-red-500'}`}>
                {pincodeStatus.message}
              </p>
            )}
          </div>

          {/* Trust Highlights Grid - Compact & Perfectly Aligned on Mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-pink-50/50 rounded-xl border border-pink-100/80">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600 shrink-0" />
              <span className="font-bold text-gray-700 leading-tight">Soft Cotton Lining</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
              <span className="font-bold text-gray-700 leading-tight">Skin Friendly</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/80">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <span className="font-bold text-gray-700 leading-tight">Free Ship &gt; ₹1499</span>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/80">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-gray-700 leading-tight">7 Days Exchange</span>
            </div>
          </div>

          {/* Share Button */}
          <div className="flex justify-end pt-1">
            <button onClick={handleShare} className="text-xs font-bold text-gray-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Link Copied!' : 'Share Outfit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Fabric & Care, Delivery */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-pink-100 shadow-2xs space-y-4 sm:space-y-6">
        <div className="flex border-b border-gray-200 gap-6 sm:gap-8 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2.5 sm:pb-3 transition-colors border-b-2 cursor-pointer ${activeTab === 'description' ? 'border-pink-600 text-pink-600 font-extrabold' : 'border-transparent text-gray-500'
              }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab('fabric')}
            className={`pb-2.5 sm:pb-3 transition-colors border-b-2 cursor-pointer ${activeTab === 'fabric' ? 'border-pink-600 text-pink-600 font-extrabold' : 'border-transparent text-gray-500'
              }`}
          >
            Fabric & Care
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
            <p>{product.shortDescription}</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Product Code / SKU: {String(product.id || product.sku || '').toUpperCase()}</li>
              <li>Occasion: {product.occasion} Wear / Festive Celebrations</li>
              <li>Package Contains: 1 Top, 1 Bottom, 1 Dupatta/Jacket (as per set style)</li>
              <li>Style Fit: Regular Kids Comfort Fit</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3 text-xs md:text-sm text-gray-700 leading-relaxed">
            <p><strong>Fabric Specification:</strong> {product.fabric}</p>
            <p><strong>Washing & Maintenance:</strong> {product.care}</p>
            <p className="text-gray-500 text-xs">Note: Handcrafted zari and metallic thread borders require gentle care to maintain shine.</p>
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-gray-900">You May Also Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product?.category || 'Alia Kurti with Afgani'}
        product={product}
      />

      {/* Fullscreen Lightbox Image Zoom Modal */}
      {isZoomModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsZoomModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-1.5 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-5xl h-[94vh] sm:h-[92vh] flex flex-col justify-between items-center bg-gray-950/90 rounded-2xl sm:rounded-3xl overflow-hidden p-2 sm:p-4 border border-gray-800 shadow-2xl">

            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-between z-20 px-2 sm:px-4 py-2 border-b border-gray-800/80 gap-2">
              {/* Left: Product title and image counter */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-white text-xs sm:text-sm font-extrabold truncate max-w-[130px] sm:max-w-xs md:max-w-md">
                  {product.name}
                </span>
                <span className="text-gray-400 text-[10px] sm:text-xs font-bold shrink-0 bg-gray-900 px-2 py-0.5 rounded-md border border-gray-800">
                  {activeImage + 1} / {images.length}
                </span>
              </div>

              {/* Right: Controls & Close Button */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom Out Button (hidden on small mobile to preserve space) */}
                <button
                  type="button"
                  onClick={() => setLightboxScale((prev) => Math.max(1, prev - 0.5))}
                  className="p-1.5 sm:p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all cursor-pointer hidden sm:flex items-center justify-center"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <span className="text-[11px] sm:text-xs font-bold text-gray-300 font-mono px-1 hidden sm:inline">
                  {Math.round(lightboxScale * 100)}%
                </span>

                {/* Zoom In Button (hidden on small mobile to preserve space) */}
                <button
                  type="button"
                  onClick={() => setLightboxScale((prev) => Math.min(3, prev + 0.5))}
                  className="p-1.5 sm:p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all cursor-pointer hidden sm:flex items-center justify-center"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Close Button - ALWAYS PROMINENT AND VISIBLE ON MOBILE */}
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(false)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white transition-all cursor-pointer flex items-center justify-center shadow-lg shrink-0"
                  aria-label="Close Fullscreen View"
                  title="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image View with Pan, Scale & Touch Swipe */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-2 cursor-grab active:cursor-grabbing touch-pan-y"
            >
              {/* Left Image Navigation Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 border border-gray-700 cursor-pointer active:scale-95"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              <div className="w-full h-full flex items-center justify-center overflow-auto no-scrollbar">
                <img
                  src={formatImageUrl(images[activeImage])}
                  alt={product.name}
                  style={{ transform: `scale(${lightboxScale})` }}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out select-none"
                />
              </div>

              {/* Right Image Navigation Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 border border-gray-700 cursor-pointer active:scale-95"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Bar */}
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-1.5 sm:py-2 px-2 sm:px-4 no-scrollbar border-t border-gray-800/80">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`w-10 h-13 sm:w-12 sm:h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeImage === idx ? 'border-pink-500 ring-2 ring-pink-400 scale-105' : 'border-gray-700 opacity-60 hover:opacity-100'
                    }`}
                >
                  <img src={formatImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
