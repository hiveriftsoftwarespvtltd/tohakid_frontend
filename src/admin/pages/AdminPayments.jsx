import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminPayments() {
  const { transactionsList, ordersList } = useAdmin();

  // Combine live orders and transactions data dynamically
  const tableData = useMemo(() => {
    if (transactionsList && transactionsList.length > 0) {
      return transactionsList;
    }
    // Generate real-time transaction records from live MongoDB ordersList if transactions API has no custom entries yet
    return (ordersList || []).map((o) => ({
      id: `TXN-${o.id || (o._id ? o._id.toString().slice(-6) : Math.floor(10000 + Math.random() * 90000))}`,
      orderId: o.id || o._id,
      customerName: o.customerName || o.shippingAddress?.name || o.email?.split('@')[0] || 'Customer',
      paymentMethod: o.paymentMethod || 'Online (Prepaid)',
      amount: Number(o.totalAmount || o.total || o.price || 0),
      date: o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : (o.date || 'Recent'),
      status: (o.orderStatus || o.status || '').toLowerCase() === 'cancelled' ? 'Refunded' : 'Successful',
    }));
  }, [transactionsList, ordersList]);

  // 1. Dynamic Online / UPI Settlement
  const onlineSettlementTotal = useMemo(() => {
    return tableData
      .filter((t) => (t.status || '').toLowerCase() === 'successful' && !(t.paymentMethod || '').toLowerCase().includes('cash'))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [tableData]);

  // 2. Dynamic Card Settlement
  const cardSettlementTotal = useMemo(() => {
    return tableData
      .filter((t) => (t.paymentMethod || '').toLowerCase().includes('card'))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [tableData]);

  // 3. Dynamic Cash on Delivery Total
  const codTotal = useMemo(() => {
    return tableData
      .filter((t) => (t.paymentMethod || '').toLowerCase().includes('cash') || (t.paymentMethod || '').toLowerCase().includes('cod'))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [tableData]);

  // 4. Dynamic Refunded Total
  const refundedTotal = useMemo(() => {
    return tableData
      .filter((t) => (t.status || '').toLowerCase() === 'refunded' || (t.status || '').toLowerCase() === 'cancelled')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [tableData]);

  const transactionColumns = [
    {
      key: 'id',
      label: 'Transaction Ref',
      render: (row) => <span className="font-mono font-extrabold text-gray-900">{row.id}</span>
    },
    {
      key: 'orderId',
      label: 'Order ID',
      render: (row) => (
        <Link to={`/admin/orders/details/${row.orderId}`} className="font-extrabold text-[#D81B60] hover:underline">
          #{row.orderId}
        </Link>
      )
    },
    {
      key: 'customerName',
      label: 'Payer Customer',
      render: (row) => <span className="font-bold text-gray-900">{row.customerName}</span>
    },
    {
      key: 'paymentMethod',
      label: 'Payment Channel',
      render: (row) => <span className="font-semibold text-gray-700">{row.paymentMethod}</span>
    },
    {
      key: 'amount',
      label: 'Transaction Value',
      render: (row) => (
        <span className="font-black text-gray-900 text-sm">₹{Number(row.amount || 0).toLocaleString('en-IN')}</span>
      )
    },
    {
      key: 'date',
      label: 'Timestamp',
      render: (row) => <span className="text-xs text-gray-500 font-semibold">{row.date}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Payments & Gateway Transactions</h1>
        <p className="text-xs text-gray-500 font-semibold">Real-time payment gateway logs, pre-authorizations, and refund trails</p>
      </div>

      {/* Payment Gateway Cards - 100% Dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
            <span>Online / UPI Settlement</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold">Live</span>
          </div>
          <p className="font-black text-2xl text-gray-900">₹{onlineSettlementTotal.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Prepaid & UPI Settlement</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
            <span>Cards Settlement</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold">Live</span>
          </div>
          <p className="font-black text-2xl text-gray-900">₹{cardSettlementTotal.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Credit & Debit Cards</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
            <span>Cash on Delivery (COD)</span>
            <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-extrabold">Live</span>
          </div>
          <p className="font-black text-2xl text-gray-900">₹{codTotal.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Collected on Doorstep</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-pink-100/80 shadow-2xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500">
            <span>Refunds Processed</span>
            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full font-extrabold">Live</span>
          </div>
          <p className="font-black text-2xl text-gray-900">₹{refundedTotal.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-gray-400 font-semibold">Returned to Original Source</p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={transactionColumns}
        data={tableData}
        searchKey={(r, q) =>
          (r.id || '').toLowerCase().includes(q) ||
          (r.orderId || '').toLowerCase().includes(q) ||
          (r.customerName || '').toLowerCase().includes(q)
        }
        searchPlaceholder="Search reference ID, order ID, customer..."
      />
    </div>
  );
}
