import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, MapPin, Sparkles, Tag, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const { 
    cart, 
    cartSubtotal, 
    discountAmount, 
    discountPercent, 
    shippingFee, 
    cartTotal, 
    user, 
    addresses, 
    createOrder,
    showToast,
    couponCode,
    discountType,
    discountValue,
    applyCoupon,
    removeCoupon
  } = useShop();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    flat: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Auto-fill user profile & default address details
  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone?.replace('+91', '').trim() || '',
      flat: defaultAddr?.flat || '',
      street: defaultAddr?.street || '',
      city: defaultAddr?.city || '',
      state: defaultAddr?.state || 'Maharashtra',
      pincode: defaultAddr?.pincode || ''
    });
  }, [user, addresses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData({
      ...formData,
      fullName: addr.name || formData.fullName,
      phone: addr.phone || formData.phone,
      flat: addr.flat || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || 'Maharashtra',
      pincode: addr.pincode || ''
    });
    showToast(`Loaded ${addr.type || 'Saved'} Address!`);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return showToast('Please enter your full name');
    if (!formData.phone || formData.phone.length < 10) return showToast('Please enter a valid 10-digit mobile number');
    if (!formData.flat.trim() || !formData.city.trim() || !formData.pincode.trim()) return showToast('Please complete delivery address details');

    setIsSubmitting(true);

    const orderPayload = {
      items: cart.map((item) => ({
        product: item.product,
        productId: item.product?.id || item.productId,
        size: item.size,
        child1Size: item.child1Size || null,
        child2Size: item.child2Size || null,
        qty: item.qty,
        price: item.product?.price || item.price,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      tax: Math.round(cartSubtotal * 0.05),
      totalAmount: cartTotal,
      paymentMethod,
      shippingAddress: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        flat: formData.flat,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    try {
      const res = await createOrder(orderPayload);
      if (res && res.success && res.order) {
        const orderId = res.order.id || res.order._id;
        setCreatedOrderId(orderId);
        setIsSuccessModalOpen(true);
      } else {
        showToast('Order placement failed. Please try again.');
      }
    } catch (err) {
      showToast('Error placing order. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    navigate(`/track-order?id=${createdOrderId}`);
  };

  if (cart.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-pink-100 space-y-4 shadow-sm">
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-lg text-gray-800">Your shopping bag is empty</h2>
        <p className="text-xs text-gray-500">Add outfits to your bag before proceeding to checkout.</p>
        <Link to="/new-arrivals" className="inline-block bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm">
          Browse Outfits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-8">
      {/* Top Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-pink-100 pb-4 gap-4">
        <Link to="/" className="text-xs font-bold text-gray-500 hover:text-pink-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Shopping
        </Link>
        <div className="text-center">
          <h1 className="font-heading font-black text-xl text-pink-600">Tohay Kids Express Checkout</h1>
          <p className="text-[11px] text-gray-500 font-medium">Safe & Fast Doorstep Delivery Across India</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Saved Address Selector */}
          {addresses && addresses.length > 0 && (
            <div className="bg-pink-50/60 p-4 rounded-2xl border border-pink-100 space-y-2">
              <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-600" /> Quick Auto-Fill Saved Address:
              </span>
              <div className="flex flex-wrap gap-2">
                {addresses.map((addr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="bg-white hover:bg-pink-600 hover:text-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{addr.type || 'Address'} ({addr.city})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address Inputs */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xs font-mono font-extrabold">1</span>
              Delivery Address Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Number (For Order SMS) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-mono font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Flat / House / Building No. *</label>
                <input
                  type="text"
                  name="flat"
                  required
                  placeholder="e.g. Flat 402, Lotus Residency"
                  value={formData.flat}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Street / Colony / Area</label>
                <input
                  type="text"
                  name="street"
                  placeholder="e.g. MG Road, Near City Mall"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  placeholder="e.g. 400001"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-pink-500 font-mono font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-xs font-mono font-extrabold">2</span>
              Choose Payment Method
            </h3>

            <div className="space-y-3 text-xs">
              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'UPI' ? 'bg-pink-50/80 border-pink-500 shadow-xs font-bold' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="text-pink-600 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">UPI / QR Code Instant Pay</p>
                    <p className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Prepaid Cashback
                </span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'CARD' ? 'bg-pink-50/80 border-pink-500 shadow-xs font-bold' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="text-pink-600 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Credit / Debit Card</p>
                    <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay, Maestro</p>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'bg-pink-50/80 border-pink-500 shadow-xs font-bold' : 'border-gray-200 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-pink-600 w-4 h-4"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Cash on Delivery (COD)</p>
                    <p className="text-[11px] text-gray-500">Pay cash/QR when delivery agent arrives</p>
                  </div>
                </div>
                <span className="text-gray-500 text-[11px] font-medium">Doorstep Cash</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Itemized Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-pink-100 shadow-xs h-fit space-y-6">
          <h3 className="font-heading font-extrabold text-base text-gray-900">Order Summary ({cart.length} items)</h3>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs p-2 bg-gray-50 rounded-xl border border-gray-100">
                <img 
                  src={item.product?.images?.[0] || item.product?.image} 
                  alt={item.product?.name} 
                  className="w-14 h-16 object-cover object-top rounded-lg bg-pink-50" 
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 line-clamp-1">{item.product?.name}</h4>
                    <p className="text-gray-500 text-[11px]">Size: <strong>{item.size}</strong> • Qty: <strong>{item.qty}</strong></p>
                  </div>
                  <span className="font-mono font-bold text-gray-900">₹{((item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0) * item.qty).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-2 border-t border-gray-100">
            {couponCode ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-mono font-extrabold text-emerald-800 uppercase tracking-wide">{couponCode}</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {discountType === 'FIXED' || discountType === 'Fixed Amount'
                        ? `₹${discountValue} OFF`
                        : `${discountPercent}% OFF`} Discount Applied
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCoupon()}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Apply Promo / Coupon Code"
                    id="checkout-coupon-input"
                    className="w-full pl-8 pr-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:border-pink-500 uppercase font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('checkout-coupon-input');
                    if (el && el.value.trim()) {
                      applyCoupon(el.value.trim());
                      el.value = '';
                    }
                  }}
                  className="bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs border-t border-gray-100 pt-4 text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-mono text-gray-900 font-bold">₹{cartSubtotal.toLocaleString()}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>
                  {discountType === 'FIXED' || discountType === 'Fixed Amount'
                    ? `Fixed Promo Discount`
                    : `Coupon Discount (${discountPercent}%)`}
                </span>
                <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono text-gray-900 font-bold">
                {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-3 border-t border-gray-100">
              <span>Total Payable Amount</span>
              <span className="font-mono text-pink-600 text-lg">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing Your Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order (₹{cartTotal})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Order Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl z-10 border border-pink-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">🎉 Order Successfully Confirmed!</span>
              <h3 className="font-heading font-black text-2xl text-gray-900 mt-1">Thank You For Your Order!</h3>
            </div>

            <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 text-xs space-y-1">
              <p className="text-gray-600">Your Order Reference ID:</p>
              <p className="text-xl font-black font-mono text-pink-600">{createdOrderId}</p>
              <p className="text-[11px] text-gray-500 pt-1">Order confirmation & tracking link sent to <strong>{formData.phone || '+91 9876543210'}</strong>.</p>
            </div>

            <button
              onClick={handleFinishOrder}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Track Order Status Now →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
