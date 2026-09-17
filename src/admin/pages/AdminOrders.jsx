import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, Filter, ShoppingBasket, CheckCircle2, Clock, Truck, XCircle, RefreshCw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminOrders() {
  const { filterType } = useParams(); // 'all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  const { ordersList, updateOrderStatus } = useAdmin();

  const [activeTab, setActiveTab] = useState(filterType || 'all');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return ordersList.filter((ord) => {
      const status = (ord.orderStatus || '').toLowerCase();
      if (activeTab !== 'all' && status !== activeTab.toLowerCase()) {
        return false;
      }
      if (paymentFilter !== 'All' && ord.paymentStatus !== paymentFilter) {
        return false;
      }
      return true;
    });
  }, [ordersList, activeTab, paymentFilter]);

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (row) => (
        <Link
          to={`/admin/orders/details/${row.id}`}
          className="font-extrabold text-[#D81B60] hover:underline"
        >
          #{row.id}
        </Link>
      )
    },
    {
      key: 'customerName',
      label: 'Customer Details',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.customerName}</p>
          <p className="text-[10px] text-gray-400 font-medium">{row.customerEmail}</p>
        </div>
      )
    },
    {
      key: 'itemsCount',
      label: 'Items',
      render: (row) => (
        <span className="font-extrabold text-gray-800">{row.itemsCount || row.items?.length || 1} items</span>
      )
    },
    {
      key: 'date',
      label: 'Placed Date',
      render: (row) => <span className="font-semibold text-gray-600 text-xs">{row.date}</span>
    },
    {
      key: 'totalAmount',
      label: 'Total Paid',
      render: (row) => (
        <span className="font-black text-gray-900 text-sm">₹{row.totalAmount?.toLocaleString('en-IN')}</span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (row) => (
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-gray-700">{row.paymentMethod}</p>
          <StatusBadge status={row.paymentStatus} />
        </div>
      )
    },
    {
      key: 'orderStatus',
      label: 'Fulfillment Status',
      render: (row) => <StatusBadge status={row.orderStatus} />
    },
    {
      key: 'actions',
      label: 'Quick Update',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/orders/details/${row.id}`}
            className="p-1.5 text-gray-500 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors"
            title="View Full Order Invoice & Timeline"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <select
            value={row.orderStatus}
            onChange={(e) => updateOrderStatus(row.id, e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 rounded-xl px-2.5 py-1 focus:ring-1 focus:ring-[#D81B60]"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
  ];

  const filterTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Orders Management</h1>
          <p className="text-xs text-gray-500 font-semibold">Track customer orders, status changes, and shipment dispatches</p>
        </div>

        {/* Payment Filter */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-pink-100 shadow-2xs text-xs font-bold">
          <span className="text-gray-400 pl-2">Payment:</span>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 text-xs font-bold text-gray-800 focus:ring-1 focus:ring-[#D81B60]"
          >
            <option value="All">All Payments</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending COD</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-gray-200">
        {filterTabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#D81B60] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Orders Table */}
      <DataTable
        columns={orderColumns}
        data={filteredOrders}
        searchKey={(row, q) =>
          row.id.toLowerCase().includes(q) ||
          row.customerName.toLowerCase().includes(q) ||
          row.customerEmail.toLowerCase().includes(q) ||
          row.paymentMethod.toLowerCase().includes(q)
        }
        searchPlaceholder="Search order ID, customer name, email..."
        emptyTitle="No Orders Found"
        emptySub="No customer orders match the current filter selection."
      />
    </div>
  );
}
