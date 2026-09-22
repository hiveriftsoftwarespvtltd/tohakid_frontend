import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatImageUrl } from '../utils/imageUtils';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    discountType,
    discountValue,
    discountPercent,
    discountAmount,
    shippingFee,
    cartTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponAlert, setCouponAlert] = useState(null);
  const navigate = useNavigate();

  // 1. Strict background scroll lock: completely fixes background page and prevents any scrolling
  useEffect(() => {
    if (!isCartOpen) return;

    const scrollY = window.scrollY;
    const originalStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      document.body.style.overflow = originalStyles.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isCartOpen]);

  // 2. Hardware / Browser Back button navigation integration
  useEffect(() => {
    if (!isCartOpen) return;

    let isPushed = false;
    if (window.location.hash !== '#cart') {
      const currentUrl = window.location.pathname + window.location.search;
      window.history.pushState({ isCartOpen: true }, '', currentUrl + '#cart');
      isPushed = true;
    }

    const handlePopState = () => {
      setIsCartOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (isPushed && window.location.hash === '#cart') {
        window.history.back();
      }
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleProceedCheckout = () => {
    if (window.location.hash === '#cart') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = freeShippingThreshold - cartSubtotal;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponAlert(res);
    setInputCoupon('');
  };

  const isFixedDiscount = discountType === 'FIXED' || discountType === 'Fixed Amount';

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-[#FFFDFC] flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* 1. Full-Screen Page Header with Back Button */}
      <header className="shrink-0 bg-white border-b border-pink-100 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-gray-700 hover:text-[#D81B60] hover:bg-pink-50 transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer group"
            aria-label="Back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Shopping</span>
          </button>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D81B60]" />
            <h1 className="font-heading font-extrabold text-base sm:text-lg text-gray-900">
              Shopping Bag <span className="text-gray-400 font-semibold text-sm">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close Shopping Bag"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* 2. Free Shipping Bar */}
      <div className="shrink-0 bg-pink-50/70 px-4 py-2.5 text-xs text-center border-b border-pink-100">
        <div className="max-w-xl mx-auto">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-gray-700 font-medium">
              Add <strong className="text-[#D81B60] font-mono font-extrabold">₹{amountNeededForFreeShipping.toLocaleString()}</strong> more to unlock <strong className="text-[#D81B60]">FREE Express Shipping!</strong>
            </p>
          ) : (
            <p className="text-emerald-700 font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Congratulations! You have unlocked FREE Express Delivery!</span>
            </p>
          )}
          <div className="w-full bg-pink-200/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#D81B60] h-full transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Full-Screen Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {cart.length === 0 ? (
            <div className="text-center py-16 sm:py-24 space-y-5 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading font-extrabold text-gray-900 text-xl">Your bag is currently empty!</h2>
                <p className="text-xs text-gray-500">
                  Discover our exclusive festive ethnic collections crafted for little princes & princesses.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List (7 Cols on desktop) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Items in Bag
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    Handcrafted Luxury
                  </span>
                </div>

                <div className="space-y-3">
                  {cart.map((item, idx) => {
                    const itemImage = formatImageUrl(item.product?.images?.[0] || item.product?.image);
                    const itemUnitPrice = item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0;
                    const itemLineTotal = itemUnitPrice * item.qty;

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 bg-white rounded-2xl border border-pink-100/80 shadow-xs hover:shadow-md transition-all relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-0.5">
                          <img
                            src={itemImage}
                            alt={item.product?.name}
                            className="w-full h-full object-cover object-top rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-heading font-extrabold text-xs sm:text-sm text-gray-900 line-clamp-1">
                                {item.product?.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product?.id || item.productId, item.size)}
                                className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-gray-500 mt-1.5">
                              <span className="bg-pink-50 text-[#D81B60] font-bold px-2 py-0.5 rounded-md">
                                Size: {item.size}
                              </span>
                              {item.child1Size && (
                                <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-md">
                                  Child 1: {item.child1Size}
                                </span>
                              )}
                              {item.child2Size && (
                                <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded-md">
                                  Child 2: {item.child2Size}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.product?.id || item.productId, item.size, -1)}
                                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-extrabold text-gray-900 font-mono">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.product?.id || item.productId, item.size, 1)}
                                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="text-sm font-extrabold text-gray-900 font-mono">
                                ₹{itemLineTotal.toLocaleString('en-IN')}
                              </span>
                              {item.qty > 1 && (
                                <span className="text-[10px] text-gray-400 block">
                                  (₹{itemUnitPrice.toLocaleString()} each)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Order Summary & Coupon (5 Cols on desktop) */}
              <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-sm space-y-4">
                  <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100">
                    Order Summary
                  </h2>

                  {/* Coupon Box */}
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-mono font-extrabold text-emerald-800 uppercase tracking-wider block">
                            {couponCode}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            {isFixedDiscount ? `₹${discountValue} OFF` : `${discountPercent}% OFF`} Applied Successfully
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          removeCoupon();
                          setCouponAlert(null);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Enter Coupon Code"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-pink-500 uppercase font-mono font-bold"
                        />
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                      </div>
                      <button
                        type="submit"
                        className="bg-gray-900 hover:bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponAlert && !couponCode && (
                    <p className={`text-[11px] font-semibold ${couponAlert.success ? 'text-emerald-600' : 'text-red-500'}`}>
                      {couponAlert.message}
                    </p>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-xs text-gray-600 pt-1">
                    <div className="flex justify-between">
                      <span>Bag Subtotal</span>
                      <span className="font-mono font-bold text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>
                          {isFixedDiscount ? `Coupon Discount` : `Coupon Discount (${discountPercent}%)`}
                        </span>
                        <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span className="font-mono text-gray-900">
                        {shippingFee === 0 ? (
                          <strong className="text-emerald-600 font-extrabold">FREE</strong>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total Amount</span>
                      <span className="font-mono text-lg text-[#D81B60]">
                        ₹{cartTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA Button */}
                  <button
                    type="button"
                    onClick={handleProceedCheckout}
                    className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>100% Safe & Secure Payment Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
