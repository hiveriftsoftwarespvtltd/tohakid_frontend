import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Clock, Truck, ShieldCheck, MapPin,
  User, Mail, Phone, Printer, RefreshCw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatusBadge from '../components/StatusBadge';
import InvoiceModal from '../../components/InvoiceModal';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { ordersList, updateOrderStatus, showToast } = useAdmin();
  const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);

  const order = ordersList.find((o) => o.id === id) || ordersList[0];

  const handlePrintInvoice = () => {
    setIsInvoiceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders/all"
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl text-gray-900">Order #{order.id}</h1>
              <StatusBadge status={order.orderStatus} />
            </div>
            <p className="text-xs text-gray-500 font-semibold">Placed on {order.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrintInvoice}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Invoice</span>
          </button>

          {/* Quick Status Update */}
          <select
            value={order.orderStatus}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            className="bg-[#D81B60] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border-none focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="Pending" className="bg-white text-gray-900">Mark as Pending</option>
            <option value="Processing" className="bg-white text-gray-900">Mark as Processing</option>
            <option value="Shipped" className="bg-white text-gray-900">Mark as Shipped</option>
            <option value="Delivered" className="bg-white text-gray-900">Mark as Delivered</option>
            <option value="Cancelled" className="bg-white text-gray-900">Mark as Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order Fulfillment Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
        <h3 className="font-heading font-extrabold text-base text-gray-900">Order Fulfillment Timeline</h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {(order.timeline || []).map((step, idx) => (
            <div key={idx} className="flex flex-col items-start gap-2 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                step.completed ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}>
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <div>
                <p className={`text-xs font-extrabold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.status}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">{step.date}</p>
                {step.note && <p className="text-[10px] text-gray-500 font-medium mt-0.5">{step.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Details Cards (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Items Table & Pricing (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Purchased Items */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Purchased Items</h3>

            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-pink-100 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-extrabold text-gray-900">{item.name}</p>
                      <p className="text-[11px] text-gray-500 font-semibold">Size: {item.size || 'Default'}</p>
                      <p className="text-[10px] text-gray-400 font-mono">Unit Price: ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-extrabold text-gray-900">Qty: {item.qty}</p>
                    <p className="text-sm font-black text-[#D81B60]">
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-3">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Payment Breakdown</h3>

            <div className="space-y-2 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-gray-900 font-bold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied:</span>
                <span className="font-bold">-₹{order.discount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="text-gray-900 font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%):</span>
                <span className="text-gray-900 font-bold">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                <span>Grand Total:</span>
                <span className="text-[#D81B60] font-black text-lg">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customer & Shipping Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D81B60]" />
              <span>Customer Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <p className="font-extrabold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-gray-600 flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customerEmail}</span>
              </p>
              <p className="text-gray-600 flex items-center gap-2 font-medium">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customerPhone}</span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D81B60]" />
              <span>Shipping Address</span>
            </h3>

            <div className="text-xs text-gray-600 space-y-1 font-medium bg-pink-50/40 p-4 rounded-2xl border border-pink-100">
              <p className="font-extrabold text-gray-900">{order.customerName}</p>
              <p>{order.shippingAddress?.flat}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
      />
    </div>
  );
}
