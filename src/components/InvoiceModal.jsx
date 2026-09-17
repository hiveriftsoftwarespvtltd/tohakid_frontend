import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, order }) {
  const invoiceRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN');

  const subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * (item.qty || item.quantity || 1), 0) || 0;
  const discountAmount = order.discountAmount || 0;
  const shippingFee = order.shippingFee || 0;
  const totalAmount = order.total || order.cartTotal || (subtotal - discountAmount + shippingFee);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-pink-100 relative max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0">
        
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-lg text-gray-900">Tax Invoice & Order Receipt</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
              {order.paymentStatus || 'Paid'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="space-y-6 text-gray-800 text-xs font-medium p-2">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <span className="font-heading font-extrabold text-2xl text-[#D81B60]">tohay KIDS</span>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Tohay Kids Heritage Apparel Pvt. Ltd.</p>
              <p className="text-[10px] text-gray-400">GSTIN: 27AAAAA0000A1Z5 | PAN: ABCDE1234F</p>
              <p className="text-[10px] text-gray-400">Support: care@tohaykids.com | +91 98765 43210</p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-pink-50 text-[#D81B60] font-mono font-extrabold text-sm rounded-lg border border-pink-100">
                INVOICE #{order.id || order._id}
              </span>
              <p className="text-[11px] text-gray-500 font-mono">Date: {formattedDate}</p>
              <p className="text-[11px] text-gray-500">Payment: <strong>{order.paymentMethod || 'COD'}</strong></p>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
            <div>
              <p className="font-extrabold text-gray-900 uppercase tracking-wider text-[10px] text-pink-600 mb-1">Billed & Shipped To:</p>
              <p className="font-bold text-gray-900">{order.shippingAddress?.fullName || order.fullName || 'Customer'}</p>
              <p className="text-gray-600">{order.shippingAddress?.flat || order.flat}, {order.shippingAddress?.street || order.street}</p>
              <p className="text-gray-600">{order.shippingAddress?.city || order.city}, {order.shippingAddress?.state || order.state} - {order.shippingAddress?.pincode || order.pincode}</p>
              <p className="text-gray-600 font-mono">Phone: {order.shippingAddress?.phone || order.phone}</p>
            </div>

            <div className="text-right">
              <p className="font-extrabold text-gray-900 uppercase tracking-wider text-[10px] text-pink-600 mb-1">Order Status Info:</p>
              <p className="font-bold text-gray-800">Status: <span className="text-emerald-700">{order.orderStatus || 'Placed'}</span></p>
              {order.couponCode && <p className="text-gray-600 font-mono">Coupon Applied: <strong>{order.couponCode}</strong></p>}
              <p className="text-gray-500 text-[11px] mt-2">Dispatched via Tohay Express Logistics</p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-extrabold border-b border-gray-200">
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {order.items?.map((item, idx) => {
                  const name = item.product?.name || item.name || 'Ethnic Outfit';
                  const price = item.product?.price || item.price || 0;
                  const qty = item.qty || item.quantity || 1;
                  const size = item.size || 'Standard';

                  return (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-gray-900">{name}</td>
                      <td className="p-3 text-gray-600">{size}</td>
                      <td className="p-3 text-center font-mono">{qty}</td>
                      <td className="p-3 text-right font-mono">₹{price.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold">₹{(price * qty).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-gray-900 font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-mono text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono text-[#D81B60]">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms Footer */}
          <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-400 text-center space-y-1">
            <p>This is a computer-generated tax invoice. No signature required.</p>
            <p>© {new Date().getFullYear()} Tohay Kids. Handcrafted ethnic wear for little celebrations.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
