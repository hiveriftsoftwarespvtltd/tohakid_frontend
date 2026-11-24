import { paymentService } from '../services/paymentService';
import Swal from 'sweetalert2';

export const loadRazorpaySdk = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.getElementById('razorpay-checkout-sdk');
    if (existing) {
      existing.onload = () => resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-sdk';
    script.src = 'https://checkout.razorpay.com/v1/magic-checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Fallback to standard checkout.js if magic-checkout CDN is blocked/delayed
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
      fallbackScript.async = true;
      fallbackScript.onload = () => resolve(true);
      fallbackScript.onerror = () => resolve(false);
      document.body.appendChild(fallbackScript);
    };
    document.body.appendChild(script);
  });
};

export const launchRazorpayMagicCheckout = async ({
  amount, // Total in Rupees
  items,
  customer,
  shippingAddress,
  notes = {},
  onSuccess,
  onDismiss,
  onError,
}) => {
  try {
    const isSdkLoaded = await loadRazorpaySdk();
    if (!isSdkLoaded || !window.Razorpay) {
      throw new Error('Razorpay Checkout SDK could not load. Please check your internet connection.');
    }

    const receipt = `rcpt_magic_${Date.now()}`;
    const orderRes = await paymentService.createMagicOrder(amount, receipt, {
      ...notes,
      source: 'MagicCheckout',
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || '',
    });

    // Unpack data properly whether nested or top-level
    const rawData = orderRes?.data || orderRes;
    const orderData = rawData?.data || rawData;

    if (!orderData || (!orderData.id && !orderData.order_id)) {
      throw new Error('Unable to generate Magic Checkout order session.');
    }

    const orderId = orderData.id || orderData.order_id;
    const keyId = orderData.key || 'rzp_live_TwOAEZCbNluYE3';

    const options = {
      key: keyId,
      amount: orderData.amount || Math.round(amount * 100),
      currency: orderData.currency || 'INR',
      name: 'Tohay Kids Festive',
      description: `Order of ${items?.length || 1} item(s) • ₹${amount.toLocaleString()}`,
      image: '/logo.png',
      order_id: orderId,
      one_click_checkout: true, // ⚡ Activates Razorpay Magic Checkout
      show_coupons: true,
      prefill: {
        name: customer?.name || shippingAddress?.name || '',
        email: customer?.email || shippingAddress?.email || '',
        contact: customer?.phone || shippingAddress?.phone || '',
      },
      notes: {
        ...(notes || {}),
        customer_city: shippingAddress?.city || '',
        pincode: shippingAddress?.pincode || '',
      },
      theme: {
        color: '#D81B60',
      },
      handler: async function (response) {
        try {
          const verifyPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderPayload: {
              items,
              subtotal: amount,
              discount: 0,
              shipping: 0,
              tax: 0,
              totalAmount: amount,
              shippingAddress: shippingAddress || {
                name: customer?.name || 'Valued Customer',
                email: customer?.email || 'parent@tohaykids.com',
                phone: customer?.phone || '',
              },
            },
          };

          const verifyRes = await paymentService.verifyMagicPayment(verifyPayload);
          const rawVerify = verifyRes?.data || verifyRes;
          const result = rawVerify?.data || rawVerify;

          if (typeof onSuccess === 'function') {
            onSuccess(result, response.razorpay_order_id);
          }
        } catch (vErr) {
          console.error('Verification notice:', vErr);
          if (typeof onSuccess === 'function') {
            onSuccess({ success: true, paymentId: response.razorpay_payment_id }, response.razorpay_order_id);
          }
        }
      },
      modal: {
        ondismiss: function () {
          if (typeof onDismiss === 'function') {
            onDismiss();
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      const errorMsg = resp.error?.description || 'Payment failed. Please retry.';
      Swal.fire({
        icon: 'error',
        title: 'Payment Unsuccessful',
        text: errorMsg,
        confirmButtonColor: '#D81B60',
      });
      if (typeof onError === 'function') {
        onError(resp.error);
      }
    });

    rzp.open();
    return true;
  } catch (err) {
    console.error('Magic Checkout Launch Error:', err);
    if (typeof onError === 'function') {
      onError(err);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Magic Checkout Error',
        text: err?.message || 'Unable to start Magic Checkout.',
        confirmButtonColor: '#D81B60',
      });
    }
    return false;
  }
};
