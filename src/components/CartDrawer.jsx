import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Tag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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

  if (!isCartOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-pink-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-600" />
              <h2 className="font-heading font-extrabold text-base text-gray-900">Your Shopping Bag ({cart.length})</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          <div className="bg-pink-50 px-4 py-2 text-xs text-center border-b border-pink-100">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-gray-700">
                Add <strong className="text-pink-600 font-mono">₹{amountNeededForFreeShipping}</strong> more for <strong className="text-pink-600">FREE Shipping!</strong>
              </p>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You unlocked FREE Shipping!</span>
              </p>
            )}
            <div className="w-full bg-pink-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-[#D81B60] h-full transition-all duration-300 rounded-full" 
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <ShoppingBag className="w-16 h-16 text-pink-200 mx-auto" />
                <div>
                  <p className="font-bold text-gray-800 text-lg">Your bag is empty!</p>
                  <p className="text-xs text-gray-500 mt-1">Explore our latest festive ethnic wear collection.</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/new-arrivals');
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 relative group">
                  <img 
                    src={item.product?.images?.[0] || item.product?.image} 
                    alt={item.product?.name} 
                    className="w-20 h-24 object-cover object-top rounded-lg bg-pink-50 border border-gray-200" 
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{item.product?.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product?.id || item.productId, item.size)}
                          className="text-gray-400 hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        <span>Size: <strong>{item.size}</strong></span>
                        {item.child1Size && <span>Child 1: <strong>{item.child1Size}</strong></span>}
                        {item.child2Size && <span>Child 2: <strong>{item.child2Size}</strong></span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-white border border-gray-200 rounded-md">
                        <button 
                          onClick={() => updateCartQuantity(item.product?.id || item.productId, item.size, -1)}
                          className="p-1 text-gray-500 hover:text-gray-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{item.qty}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product?.id || item.productId, item.size, 1)}
                          className="p-1 text-gray-500 hover:text-gray-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-gray-900 font-mono">
                          ₹{((item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0) * item.qty).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white space-y-3">
              {/* Coupon Box */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-extrabold text-emerald-800 uppercase tracking-wide">{couponCode}</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        {isFixedDiscount ? `₹${discountValue} OFF` : `${discountPercent}% OFF`} Discount Applied
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
                      placeholder="Coupon Code (e.g. PREPAIDS)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-pink-500 uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button 
                    type="submit"
                    className="bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
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

              {/* Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>
                      {isFixedDiscount ? `Fixed Promo Discount` : `Prepaid Discount (${discountPercent}%)`}
                    </span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-gray-900">
                    {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="font-mono text-pink-600">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
