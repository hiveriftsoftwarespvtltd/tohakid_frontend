import React, { useState, useMemo } from 'react';
import { Download, FileText, BarChart3, TrendingUp, Package, Users, IndianRupee, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminReports() {
  const { productsList, ordersList, customersList, showToast } = useAdmin();
  const [activeReportTab, setActiveReportTab] = useState('sales'); // 'sales' | 'products' | 'customers' | 'inventory'
  const [dateRange, setDateRange] = useState('All Time');

  // Dynamic Sales Metrics
  const grossRevenue = useMemo(() => {
    return (ordersList || [])
      .filter((o) => (o.orderStatus || o.status || '').toLowerCase() !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
  }, [ordersList]);

  const gstCollected = useMemo(() => {
    return Math.round(grossRevenue * 0.05);
  }, [grossRevenue]);

  const shippingCollected = useMemo(() => {
    return (ordersList || []).filter((o) => Number(o.totalAmount || 0) < 1499).length * 99;
  }, [ordersList]);

  const totalDiscounts = useMemo(() => {
    return (ordersList || []).reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  }, [ordersList]);

  // Dynamic Customer Metrics
  const totalCustomersCount = useMemo(() => {
    if (customersList && customersList.length > 0) return customersList.length;
    return new Set((ordersList || []).map((o) => o.customerEmail || o.customerName || o.email || o.id)).size;
  }, [customersList, ordersList]);

  const repeatCustomersCount = useMemo(() => {
    const counts = {};
    (ordersList || []).forEach((o) => {
      const email = o.customerEmail || o.email || o.customerName;
      if (email) counts[email] = (counts[email] || 0) + 1;
    });
    return Object.values(counts).filter((c) => c > 1).length;
  }, [ordersList]);

  const newCustomersCount = Math.max(0, totalCustomersCount - repeatCustomersCount);

  // Dynamic Low Stock Inventory Items
  const lowStockItems = useMemo(() => {
    return (productsList || []).filter((p) => Number(p.stock ?? 0) <= 15);
  }, [productsList]);

  // Real CSV Export Handler
  const handleDownload = (format) => {
    let csvData = [];
    if (activeReportTab === 'sales') {
      csvData = (ordersList || []).map((o) => ({
        OrderID: o.id || o._id,
        Customer: o.customerName || o.shippingAddress?.name || 'Customer',
        Amount: o.totalAmount || o.price || 0,
        PaymentMethod: o.paymentMethod || 'Prepaid',
        Status: o.orderStatus || o.status || 'Pending',
        Date: o.createdAt || o.date || '',
      }));
    } else if (activeReportTab === 'products') {
      csvData = (productsList || []).map((p) => ({
        ID: p.id || p._id,
        Name: p.name,
        Category: p.category,
        Price: p.price,
        Stock: p.stock,
      }));
    } else if (activeReportTab === 'customers') {
      csvData = (customersList || []).map((c) => ({
        ID: c.id || c._id,
        Name: c.name,
        Email: c.email,
        Phone: c.phone || '',
      }));
    } else {
      csvData = lowStockItems.map((p) => ({
        ID: p.id || p._id,
        Name: p.name,
        CurrentStock: p.stock,
      }));
    }

    if (csvData.length === 0) {
      showToast('No live records available to export.');
      return;
    }

    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map((row) => Object.values(row).map((v) => `"${v}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReportTab}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${activeReportTab.toUpperCase()} report as CSV file!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Reports & Export Center</h1>
          <p className="text-xs text-gray-500 font-semibold">Generate audit statements, tax breakdowns, and live inventory sheets</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-800 shadow-2xs"
          >
            <option value="All Time">All Time (Live DB)</option>
            <option value="This Month">This Month</option>
            <option value="Today">Today</option>
          </select>

          <button
            type="button"
            onClick={() => handleDownload('CSV')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'sales', label: 'Sales Report', icon: IndianRupee },
          { id: 'products', label: 'Product Performance', icon: Package },
          { id: 'customers', label: 'Customer Retention', icon: Users },
          { id: 'inventory', label: 'Inventory Movement', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveReportTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D81B60] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Report Content */}
      {activeReportTab === 'sales' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-6">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Executive Sales Summary ({dateRange})</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
              <p className="text-xs text-gray-500 font-medium">Gross Revenue</p>
              <p className="text-2xl font-black text-[#D81B60]">₹{grossRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Discounts Allowed</p>
              <p className="text-2xl font-black text-emerald-600">₹{totalDiscounts.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">GST Tax Collected (5%)</p>
              <p className="text-2xl font-black text-gray-900">₹{gstCollected.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Shipping Collections</p>
              <p className="text-2xl font-black text-sky-600">₹{shippingCollected.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      {activeReportTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Top Catalog Products</h3>

          {productsList && productsList.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {productsList.slice(0, 6).map((p, i) => (
                <div key={p.id || p._id} className="py-3 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center font-extrabold">
                      #{i + 1}
                    </span>
                    <span className="text-gray-900">{p.name}</span>
                  </div>
                  <span className="text-[#D81B60]">₹{Number(p.price || 0).toLocaleString('en-IN')} (Stock: {p.stock ?? 0})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-gray-500 py-4">No products currently available in store catalog.</p>
          )}
        </div>
      )}

      {activeReportTab === 'customers' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Customer Lifetime Breakdown</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
              <p className="text-gray-500">Total Registered Customers</p>
              <p className="text-xl font-black mt-1">{totalCustomersCount} Shoppers</p>
            </div>
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 text-xs font-bold text-sky-900">
              <p className="text-gray-500">Repeat Orders Customers</p>
              <p className="text-xl font-black mt-1">{repeatCustomersCount} Buyers</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
              <p className="text-gray-500">First-Time Customers</p>
              <p className="text-xl font-black mt-1">{newCustomersCount} New Users</p>
            </div>
          </div>
        </div>
      )}

      {activeReportTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900">Stock Velocity & Reorder Alerts</h3>
          <p className="text-xs text-gray-600 font-bold">
            {lowStockItems.length} items currently require warehouse stock replenishment.
          </p>

          {lowStockItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {lowStockItems.map((item) => (
                <div key={item.id || item._id} className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[11px] font-bold text-amber-700 mt-0.5">Stock Remaining: {item.stock} units</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>All inventory stock levels are within safe operating limits.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
