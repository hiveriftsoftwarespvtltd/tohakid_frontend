import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Calendar,
  Loader2
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatImageUrl } from '../utils/imageUtils';

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryId || '');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchOrderTracking = async (idToTrack) => {
    const cleanId = (idToTrack || '').trim().toUpperCase();
    if (!cleanId) {
      setErrorMessage('Please enter an Order ID to track.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setTrackedOrder(null);
    setSearched(true);

    try {
      // 1. Fetch real tracking data from backend API
      const response = await orderService.trackOrder(cleanId);
      const data = response?.data || response;

      if (data && (data.orderNumber || data.id || data.status)) {
        formatAndSetOrder(data, cleanId);
        return;
      }
      throw new Error('Order not found');
    } catch (err) {
      // 2. Fallback: Check local orders in localStorage (placed in current browser session)
      try {
        const localOrders = JSON.parse(localStorage.getItem('tohay_orders') || '[]');
        const localMatch = localOrders.find(
          (o) => String(o.id).toUpperCase() === cleanId || String(o.orderNumber).toUpperCase() === cleanId
        );
        if (localMatch) {
          formatAndSetOrder(localMatch, cleanId);
          return;
        }
      } catch (localErr) {}

      setErrorMessage(
        `No order found with Reference ID "${cleanId}". Please check the ID provided in your confirmation message or order history.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatAndSetOrder = (data, cleanId) => {
    // Map status into standard stages
    const currentStatus = data.status || data.orderStatus || 'Processing';
    const statusLower = currentStatus.toLowerCase();

    const isDelivered = statusLower.includes('delivered');
    const isOutForDelivery = isDelivered || statusLower.includes('out for delivery');
    const isShipped = isOutForDelivery || statusLower.includes('shipped') || statusLower.includes('dispatched');
    const isPacked = isShipped || statusLower.includes('processing') || statusLower.includes('packed') || statusLower.includes('confirmed');

    const steps = [
      {
        label: 'Order Placed & Verified',
        time: data.createdAt ? new Date(data.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Confirmed',
        completed: true
      },
      {
        label: 'Quality Checked & Packed',
        time: isPacked ? 'Completed at warehouse' : 'In process',
        completed: isPacked
      },
      {
        label: `Dispatched via ${data.courier || 'Express Courier'}`,
        time: isShipped ? 'In Transit' : 'Pending dispatch',
        completed: isShipped
      },
      {
        label: 'Out for Delivery',
        time: isOutForDelivery ? 'Today' : 'Expected soon',
        completed: isOutForDelivery
      },
      {
        label: 'Delivered',
        time: isDelivered ? 'Successfully delivered' : 'Final destination',
        completed: isDelivered
      }
    ];

    setTrackedOrder({
      id: data.orderNumber || data.id || cleanId,
      customerName: data.customerName || 'Valued Customer',
      status: currentStatus,
      total: data.total || data.totalAmount || 0,
      courier: data.courier || 'BlueDart Express',
      estimatedDelivery: data.estimatedDelivery || (isDelivered ? 'Delivered' : '2-4 Business Days'),
      address: data.address || '',
      items: data.items || [],
      steps
    });
  };

  useEffect(() => {
    // Only fetch if a valid order ID was passed via query parameter (e.g. /track-order?id=TK12345)
    if (queryId) {
      fetchOrderTracking(queryId);
    }
  }, [queryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrderTracking(orderIdInput);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2.5 max-w-xl mx-auto">
        <span className="bg-pink-100/80 text-[#D81B60] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Real-time Order Tracker
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
          Track Your Tohay Kids Order
        </h1>
        <p className="text-xs text-gray-500">
          Enter your Order ID from your confirmation email, SMS, or profile to see live dispatch updates.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto bg-white p-2 sm:p-2.5 rounded-2xl border border-pink-100 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. TK10482)..."
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-pink-300 font-mono font-bold uppercase transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-[#D81B60] hover:bg-[#C2185B] disabled:bg-gray-400 text-white font-extrabold text-xs px-7 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Track Status</span>
          )}
        </button>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D81B60] mx-auto" />
          <p className="text-xs font-bold text-gray-600">Retrieving real-time tracking updates...</p>
        </div>
      )}

      {/* Error / Not Found Alert */}
      {errorMessage && !isLoading && (
        <div className="max-w-lg mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Order Not Found</p>
            <p className="text-[11px] text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Initial Empty State (Before searching) */}
      {!searched && !trackedOrder && !isLoading && (
        <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-3xl border border-pink-100/70 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-sm text-gray-900">
              No Order Searched Yet
            </h3>
            <p className="text-xs text-gray-500">
              Type your order reference number in the search box above to inspect courier dispatch and estimated delivery.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-gray-400 font-medium">
            💡 Tip: Order IDs usually start with <span className="font-mono font-bold text-gray-600">TK</span> followed by 5 digits (e.g. TK23841)
          </div>
        </div>
      )}

      {/* Track Results Card */}
      {trackedOrder && !isLoading && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 shadow-sm space-y-6 max-w-3xl mx-auto animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Order Reference ID:</span>
              <span className="font-mono font-black text-lg text-[#D81B60]">{trackedOrder.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Estimated Delivery:</span>
              <span className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#D81B60]" />
                <span>{trackedOrder.estimatedDelivery}</span>
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Current Status:</span>
              <span className="inline-block mt-0.5 bg-pink-50 text-[#D81B60] border border-pink-200 font-extrabold px-3 py-0.5 rounded-full text-xs uppercase tracking-wider">
                {trackedOrder.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-pink-100 pl-2 py-2">
            {trackedOrder.steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all ${
                    step.completed
                      ? 'bg-[#D81B60] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">{step.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ordered Items Preview (if any) */}
          {trackedOrder.items && trackedOrder.items.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider block">
                Items in this Package
              </span>
              <div className="space-y-2">
                {trackedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50/70 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={formatImageUrl(item.image || item.product?.images?.[0] || item.product?.image)}
                        alt={item.name || item.product?.name}
                        className="w-10 h-12 object-cover rounded-lg border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.name || item.product?.name}</p>
                        <p className="text-[11px] text-gray-500">Size: {item.size || 'Standard'} • Qty: {item.qty || 1}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-gray-900">
                      ₹{((item.price || item.product?.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-pink-50/70 rounded-2xl border border-pink-100 text-xs text-[#D81B60] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>Need assistance with your package delivery?</span>
            <Link to="/contact-us" className="font-extrabold text-[#D81B60] hover:text-[#C2185B] flex items-center gap-1 group">
              <span>Contact Customer Support</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
