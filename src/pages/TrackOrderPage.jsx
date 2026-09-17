import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, PackageCheck, Truck, Clock, CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryId || 'TK10482');
  const [trackedOrder, setTrackedOrder] = useState(null);

  const simulateTrackOrder = (idToTrack) => {
    setTrackedOrder({
      id: idToTrack || 'TK10482',
      date: 'Aug 10, 2026',
      estimatedDelivery: 'Aug 13, 2026',
      itemsCount: 2,
      status: 'In Transit',
      steps: [
        { label: 'Order Placed', time: '10:30 AM, Aug 10', completed: true },
        { label: 'Quality Checked & Packed', time: '02:15 PM, Aug 10', completed: true },
        { label: 'Dispatched via BlueDart Express', time: '06:00 PM, Aug 10', completed: true },
        { label: 'Out for Delivery', time: 'Expected Aug 13', completed: false },
        { label: 'Delivered', time: 'Expected Aug 13', completed: false }
      ]
    });
  };

  useEffect(() => {
    if (queryId) {
      simulateTrackOrder(queryId);
    } else {
      simulateTrackOrder('TK10482');
    }
  }, [queryId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      simulateTrackOrder(orderIdInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="bg-pink-100 text-pink-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Real-time Order Tracker
        </span>
        <h1 className="font-heading font-black text-3xl text-gray-900">Track Your Tohay Kids Order</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">Enter your Order ID (e.g. TK10482) or mobile number below to see instant dispatch updates.</p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto bg-white p-2 rounded-2xl border border-pink-200 shadow-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Order ID (e.g. TK10482)..."
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-50 rounded-xl focus:outline-hidden font-mono font-bold"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
        <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors">
          Track Status
        </button>
      </form>

      {/* Track Results */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Order Reference ID:</span>
              <span className="font-mono font-black text-lg text-pink-600">{trackedOrder.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Estimated Delivery:</span>
              <span className="font-bold text-gray-900">{trackedOrder.estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Current Status:</span>
              <span className="bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full">
                {trackedOrder.status}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200 pl-2">
            {trackedOrder.steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                  step.completed ? 'bg-pink-600 text-white shadow-xs' : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}>
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

          <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 text-xs text-pink-900 flex justify-between items-center">
            <span>Need assistance with your package delivery?</span>
            <Link to="/contact-us" className="font-extrabold text-pink-700 underline">
              Contact Support →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
