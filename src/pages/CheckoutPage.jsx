import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft,
  MapPin, Tag, X, Lock, Phone, Mail, Home, Building2, Check, Sparkles,
  AlertCircle, ChevronDown, ChevronUp, ShoppingBag
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useShop } from '../context/ShopContext';
import { lookupPincode } from '../utils/pincodeService';
import { formatImageUrl } from '../utils/imageUtils';
import { paymentService } from '../services/paymentService';

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    cartTotal,
    isLoggedIn,
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

  // Authentication Guard: Ensure user is logged in to checkout
  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to proceed with checkout.');
      navigate('/login?redirect=/checkout', { state: { from: '/checkout' }, replace: true });
    }
  }, [isLoggedIn, navigate, showToast]);

  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
    state: '',
    colony: '',
    fullName: '',
    phone: '',
    email: '',
    flat: '',
    street: '',
  });

  const [pinStatus, setPinStatus] = useState(null); // { loading, success, message }
  const [availableLocalities, setAvailableLocalities] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Auto-fill user profile & default address details
  useEffect(() => {
    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    const initialPin = defaultAddr?.pincode || '';
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone?.replace('+91', '').trim() || '',
      flat: defaultAddr?.flat || '',
      street: defaultAddr?.street || '',
      colony: defaultAddr?.colony || defaultAddr?.locality || '',
      city: defaultAddr?.city || '',
      state: defaultAddr?.state || 'Maharashtra',
      pincode: initialPin,
    });

    if (initialPin && initialPin.length === 6) {
      lookupPincode(initialPin).then((res) => {
        if (res.success) {
          setAvailableLocalities(res.localities || []);
          setPinStatus({ loading: false, success: true, message: `${res.city}, ${res.state}` });
        }
      });
    }
  }, [user, addresses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Instant Pincode Lookup Handler - Auto Populates City & Locality
  const handlePincodeChange = async (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 6);

    // Reset old city & locality if PIN is incomplete or changed
    setFormData((prev) => ({
      ...prev,
      pincode: rawVal,
      ...(rawVal.length < 6 ? { city: '', colony: '' } : {}),
    }));

    if (rawVal.length === 6) {
      setPinStatus({ loading: true, message: 'Detecting city & area...' });
      const res = await lookupPincode(rawVal);
      if (res.success) {
        const newLocality = res.localities && res.localities.length > 0 ? res.localities[0] : '';
        setFormData((prev) => ({
          ...prev,
          pincode: rawVal,
          city: res.city,
          state: res.state,
          colony: newLocality,
        }));
        setAvailableLocalities(res.localities || []);
        setPinStatus({
          loading: false,
          success: true,
          message: `${res.city}, ${res.state}`,
        });
      } else {
        setPinStatus({
          loading: false,
          success: false,
          message: res.message || 'Invalid PIN code. Please verify.',
        });
        setAvailableLocalities([]);
        setFormData((prev) => ({ ...prev, city: '', colony: '' }));
      }
    } else {
      setPinStatus(null);
      setAvailableLocalities([]);
    }
  };

  const handleSelectSavedAddress = async (addr) => {
    const rawPin = addr.pincode || '';
    setFormData({
      ...formData,
      fullName: addr.name || formData.fullName,
      phone: addr.phone || formData.phone,
      flat: addr.flat || '',
      street: addr.street || '',
      colony: addr.colony || addr.locality || '',
      city: addr.city || '',
      state: addr.state || 'Maharashtra',
      pincode: rawPin,
    });
    showToast(`Loaded ${addr.type || 'Saved'} Address`);

    if (rawPin.length === 6) {
      const res = await lookupPincode(rawPin);
      if (res.success) {
        setAvailableLocalities(res.localities || []);
        setPinStatus({ loading: false, success: true, message: `${res.city}, ${res.state}` });
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Please sign in to proceed with payment.');
      navigate('/login?redirect=/checkout', { state: { from: '/checkout' } });
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) return showToast('Please enter a valid 6-digit delivery PIN code');
    if (!formData.fullName.trim()) return showToast('Please enter your full name');
    if (!formData.phone || formData.phone.length < 10) return showToast('Please enter a valid 10-digit mobile number');
    if (!formData.flat.trim()) return showToast('Please enter house / building / flat number');
    if (!formData.city.trim()) return showToast('City is required');

    setIsSubmitting(true);

    const orderPayload = {
      items: cart.map((item) => {
        const resolvedPrice =
          item.price ||
          item.product?.sizeVariants?.find((v) => v.size === item.size)?.price ||
          item.product?.price ||
          0;
        return {
          product: item.product,
          productId: item.product?.id || item.productId,
          size: item.size,
          child1Size: item.child1Size || null,
          child2Size: item.child2Size || null,
          qty: item.qty,
          price: resolvedPrice,
        };
      }),
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
        street: [formData.street, formData.colony].filter(Boolean).join(', '),
        colony: formData.colony,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    // Razorpay Official Online Checkout Flow
    try {
      const receipt = `rcpt_${Date.now()}`;
      const orderRes = await paymentService.createRazorpayOrder(cartTotal, receipt);
      const rzpData = orderRes?.data || orderRes;

      if (!rzpData || !rzpData.id) {
        throw new Error('Unable to create Razorpay payment order.');
      }

      if (typeof window.Razorpay === 'undefined') {
        showToast('Payment gateway is loading. Please try again in a few moments.');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: rzpData.key || 'rzp_test_TlPG0c5eDqzfom',
        amount: rzpData.amount,
        currency: rzpData.currency || 'INR',
        name: 'Tohay Kids Festive',
        description: `Order of ${cart.length} item(s) • ₹${cartTotal.toLocaleString()}`,
        image: '/logo.png',
        order_id: rzpData.id,
        one_click_checkout: true,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone}`,
        },
        notes: {
          customer_city: formData.city,
          pincode: formData.pincode,
        },
        theme: {
          color: '#D81B60',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI / Dynamic QR',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
              cards: {
                name: 'Cards & Other Options',
                instruments: [
                  {
                    method: 'card',
                  },
                  {
                    method: 'netbanking',
                  },
                  {
                    method: 'wallet',
                  },
                ],
              },
            },
            sequence: ['block.upi', 'block.cards'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response) {
          // Verify HMAC SHA-256 signature
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (vErr) {
            console.warn('Razorpay signature verification notice:', vErr);
          }

          // Save finalized order to database
          try {
            const res = await createOrder({
              ...orderPayload,
              paymentMethod: 'Razorpay Online',
              paymentStatus: 'Paid',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });
            if (res && res.success && res.order) {
              const orderId = res.order.id || res.order._id;
              setCreatedOrderId(orderId);
              setIsSuccessModalOpen(true);
            } else {
              showToast('Order confirmed! Redirecting to tracker...');
              navigate('/track-order');
            }
          } catch (saveErr) {
            showToast('Payment successful! Processing order records...');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            showToast('Payment window closed. You can retry whenever ready.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setIsSubmitting(false);
        const errorMsg = resp.error?.description || 'Payment transaction failed. Please try again.';
        Swal.fire({
          icon: 'error',
          title: 'Payment Failed',
          text: errorMsg,
          confirmButtonColor: '#D81B60',
        });
      });
      rzp.open();
    } catch (err) {
      setIsSubmitting(false);
      showToast(err.message || 'Razorpay initialization failed.');
    }
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    navigate(`/track-order?id=${createdOrderId}`);
  };

  if (cart.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-sm w-full text-center bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#D81B60] mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-lg text-gray-900">Your shopping bag is empty</h2>
            <p className="text-xs text-gray-500 mt-1">Explore our latest festive ethnic outfits for kids.</p>
          </div>
          <Link
            to="/new-arrivals"
            className="inline-flex items-center justify-center gap-2 bg-[#D81B60] hover:bg-[#C2185B] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-3 sm:py-8 pb-10 sm:pb-14 text-gray-800">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6">

        {/* Sleek, Clean Top Header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200/70">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#D81B60] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        {/* Mobile Accordion: Order Summary Bar (Modern & Compact) */}
        <div className="lg:hidden bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
            className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D81B60]" />
              <span>Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
              {isMobileSummaryOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
            <span className="font-mono text-sm font-extrabold text-[#D81B60]">
              ₹{cartTotal.toLocaleString()}
            </span>
          </button>

          {isMobileSummaryOpen && (
            <div className="p-4 space-y-4 border-t border-gray-100 bg-white">
              {/* Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs items-center">
                    <img
                      src={formatImageUrl(item.product?.images?.[0] || item.product?.image)}
                      alt={item.product?.name}
                      className="w-12 h-14 object-cover object-top rounded-lg bg-pink-50 shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.product?.name}</h4>
                      <p className="text-[11px] text-gray-500">Size: {item.size} • Qty: {item.qty}</p>
                    </div>
                    <span className="font-mono font-bold text-gray-900 text-xs shrink-0">
                      ₹{((item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-gray-900 font-bold">₹{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main 2-Column Form */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

          {/* Left Column (7 Cols on desktop): Form Fields */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            {/* Quick Saved Address Auto-Fill */}
            {addresses && addresses.length > 0 && (
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D81B60]" />
                  <span>Deliver to Saved Address:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {addresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-[#D81B60] border border-gray-200 hover:border-pink-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      {addr.type || 'Home'} ({addr.pincode})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 1: Delivery Address */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">Step 1 of 2</span>
              </div>

              {/* PIN CODE FIRST - Clean, Minimal Hero Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D81B60]" />
                    <span>PIN Code</span>
                    <span className="text-[#D81B60]">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Auto-detects City & State</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 110001)"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-gray-50/70 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-mono font-bold text-sm tracking-wider text-gray-900 transition-all placeholder:text-gray-400 placeholder:text-xs placeholder:font-normal placeholder:tracking-normal"
                  />
                  {pinStatus?.loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[#D81B60] font-bold">
                      <div className="w-3.5 h-3.5 border-2 border-[#D81B60] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px]">Checking...</span>
                    </div>
                  )}
                  {pinStatus?.success && !pinStatus?.loading && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Instant Verification Feedback (Clean & Compact) */}
                {pinStatus && !pinStatus.loading && (
                  <div className={`flex items-center gap-1.5 text-xs pt-0.5 ${pinStatus.success ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-medium'
                    }`}>
                    {pinStatus.success ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Delivering to <strong>{pinStatus.message}</strong></span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{pinStatus.message}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Identified Localities Pills (Clean Horizontal Scroll) */}
                {availableLocalities.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Select Area / Locality:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar py-0.5">
                      {availableLocalities.slice(0, 10).map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, colony: loc }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${formData.colony === loc
                            ? 'bg-[#D81B60] text-white shadow-2xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-transparent'
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* REMAINING CUSTOMER FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 text-xs pt-1">

                {/* 1. Full Name */}
                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">
                    Full Name <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter customer name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Mobile Number <span className="text-[#D81B60]">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-600 font-bold text-xs select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={10}
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData((prev) => ({ ...prev, phone: val }));
                      }}
                      className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-r-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-mono font-medium text-gray-900 transition-all text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* 3. Email Address */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Email Address <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                </div>

                {/* 4. House / Building */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Flat / House / Building <span className="text-[#D81B60]">*</span>
                  </label>
                  <input
                    type="text"
                    name="flat"
                    required
                    placeholder="e.g. Flat 301, Tower B"
                    value={formData.flat}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                </div>

                {/* 5. Street */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Street / Road name
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="e.g. MG Road, Near Market"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                </div>

                {/* 6. Colony / Locality */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Colony / Locality / Landmark
                  </label>
                  <input
                    type="text"
                    name="colony"
                    list="locality-suggestions-mobile"
                    placeholder="e.g. Sector 62, Civil Lines"
                    value={formData.colony}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                  {availableLocalities.length > 0 && (
                    <datalist id="locality-suggestions-mobile">
                      {availableLocalities.map((loc, idx) => (
                        <option key={idx} value={loc} />
                      ))}
                    </datalist>
                  )}
                </div>

                {/* 7. City (Auto-populated) */}
                <div>
                  <label className="font-semibold text-gray-700 block mb-1 flex items-center justify-between">
                    <span>City (Auto-Identified) <span className="text-[#D81B60]">*</span></span>
                    {formData.city && <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>}
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Auto-filled from PIN"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] focus:ring-1 focus:ring-pink-500/20 font-medium text-gray-900 transition-all text-xs sm:text-sm"
                  />
                </div>

              </div>
            </div>

            {/* Section 2: Payment Method */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Secure Checkout</span>
                </div>
              </div>

              {/* Payment Option: Razorpay Online Checkout */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setPaymentMethod('RAZORPAY')}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setPaymentMethod('RAZORPAY')}
                className="relative rounded-2xl border-2 border-[#D81B60] bg-gradient-to-b from-pink-50/25 via-white to-white shadow-xs p-4 sm:p-5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 w-5 h-5 rounded-full border-2 border-[#D81B60] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D81B60]" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start sm:items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
                            Online Payment (Razorpay)
                          </h3>
                          <span className="bg-[#D81B60]/10 text-[#D81B60] text-[10px] font-black px-2 py-0.5 rounded-full">
                            Instant & Secure
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pay inline via UPI, Dynamic QR, Credit/Debit Cards, Net Banking & Wallets
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#0C2340] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-2xs shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#3395FF]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.43 0L7.6 13.91H15.8L9.57 28L24.4 14.09H16.2L22.43 0Z" />
                        </svg>
                        <span>Secured by <strong>Razorpay</strong></span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs">
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                          <path d="M14 3L6 14.5H12L10 21L18 9.5H12L14 3Z" fill="#097939" />
                          <path d="M11 7L6 14.5H12L10 21L12.5 17" fill="#ED752E" />
                        </svg>
                        <span className="text-[11px] font-black text-gray-800 tracking-tight">UPI</span>
                        <span className="text-[10px] text-gray-500 font-medium hidden sm:inline">• GPay, PhonePe, Paytm, QR</span>
                      </div>

                      <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs">
                        <span className="text-[11px] font-black italic text-[#1A1F71] tracking-tight">VISA</span>
                        <div className="flex items-center -space-x-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90" />
                          <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                        </div>
                        <span className="text-[10px] font-black text-[#097939] tracking-tight">RuPay</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-[11px] font-bold text-gray-700">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Net Banking</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-[11px] font-bold text-gray-700">
                        <CreditCard className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Wallets</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>256-bit Encrypted Checkout • RBI Regulated Gateway</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Instant Refund Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View CTA Button (Visible inside form on mobile) */}
            <div className="lg:hidden pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-98 text-sm"
              >
                {isSubmitting ? (
                  <span>Opening Secure Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{cartTotal.toLocaleString()} with Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column (5 Cols on desktop): Sticky Order Summary */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">

              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900">
                  Order Summary
                </h3>
                <span className="text-xs font-semibold text-gray-500">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 text-xs p-2 bg-gray-50/60 rounded-xl border border-gray-100">
                    <img
                      src={formatImageUrl(item.product?.images?.[0] || item.product?.image)}
                      alt={item.product?.name}
                      className="w-12 h-14 object-cover object-top rounded-lg bg-pink-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</h4>
                        <p className="text-gray-500 text-[10px] mt-0.5">
                          Size: {item.size} • Qty: {item.qty}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-gray-900 text-xs">
                        ₹{((item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0) * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-2 border-t border-gray-100">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-mono font-bold text-emerald-800 uppercase tracking-wide text-xs">{couponCode}</span>
                        <span className="text-[10px] text-emerald-600 font-medium block">
                          {discountType === 'FIXED' || discountType === 'Fixed Amount'
                            ? `₹${discountValue} OFF`
                            : `${discountPercent}% OFF`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon / Promo code"
                        id="checkout-coupon-input-desktop"
                        className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#D81B60] uppercase font-mono font-bold"
                      />
                      <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('checkout-coupon-input-desktop');
                        if (el && el.value.trim()) {
                          applyCoupon(el.value.trim());
                          el.value = '';
                        }
                      }}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 text-xs border-t border-gray-100 pt-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-gray-900 font-bold">₹{cartSubtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span className="font-mono font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-gray-900 font-bold">
                    {shippingFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-extrabold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total Payable</span>
                  <span className="font-mono text-[#D81B60] text-lg font-black">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Desktop Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="hidden lg:flex w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold py-3.5 px-4 rounded-xl items-center justify-center gap-2 shadow-md shadow-pink-500/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 active:scale-98 text-sm"
              >
                {isSubmitting ? (
                  <span>Opening Secure Gateway...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{cartTotal.toLocaleString()} with Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10px] text-gray-500 text-center">
                <span className="flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Easy Exchange
                </span>
                <span className="flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> 100% Genuine
                </span>
              </div>

            </div>
          </div>

        </form>

        {/* Minimal Distraction-Free Security Note */}
        <div className="pt-4 pb-2 text-center text-gray-400 text-[11px] font-medium">
          <p>© {new Date().getFullYear()} Tohay Kids. All Rights Reserved. • 100% Encrypted & Secure Checkout</p>
        </div>

        {/* Order Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl z-10 border border-gray-100">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D81B60]">
                  🎉 Order Confirmed!
                </span>
                <h3 className="font-heading font-black text-xl text-gray-900 mt-1">
                  Thank You For Your Order!
                </h3>
              </div>

              <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 text-xs space-y-1">
                <p className="text-gray-500 text-[11px]">Your Order ID:</p>
                <p className="text-lg font-black font-mono text-[#D81B60]">{createdOrderId}</p>
                <p className="text-[10px] text-gray-500 pt-1">
                  Order updates sent to <strong>{formData.phone || '+91 9261874142'}</strong>
                </p>
              </div>

              <button
                onClick={handleFinishOrder}
                className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Track Order Status →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
