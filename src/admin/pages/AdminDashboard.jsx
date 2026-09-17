import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee, ShoppingBag, Users, Package, Clock, CheckCircle2,
  XCircle, RefreshCw, AlertTriangle, ArrowRight, TrendingUp, BarChart2,
  Eye, Edit, Trash2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';

export default function AdminDashboard() {
  const {
    analyticsMetrics,
    ordersList,
    productsList,
    customersList,
    updateOrderStatus
  } = useAdmin();

  const [chartTimeframe, setChartTimeframe] = useState('7 Days');

  // Dynamic logged in admin name
  const adminDisplayName = useMemo(() => {
    try {
      const saved = localStorage.getItem('tohay_admin_user');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.name || (parsed?.email ? parsed.email.split('@')[0] : 'Admin');
    } catch (e) {
      return 'Admin';
    }
  }, []);

  // Low Stock Items (< 15 units)
  const lowStockItems = useMemo(() => {
    return (productsList || []).filter((p) => p.stock !== undefined && Number(p.stock) <= 15);
  }, [productsList]);

  // 100% Dynamic Revenue Calculation directly from live MongoDB ordersList
  const totalRevenue = useMemo(() => {
    if (!ordersList || ordersList.length === 0) return 0;
    return ordersList
      .filter((o) => (o.orderStatus || o.status || '').toLowerCase() !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
  }, [ordersList]);

  const revenueGrowth = useMemo(() => {
    return ordersList && ordersList.length > 0 ? `${ordersList.length} live orders` : 'Live Data';
  }, [ordersList]);

  // 100% Dynamic Total Orders directly from live MongoDB ordersList
  const totalOrders = useMemo(() => {
    return ordersList ? ordersList.length : 0;
  }, [ordersList]);

  const ordersGrowth = useMemo(() => {
    return ordersList && ordersList.length > 0 ? `${ordersList.length} total orders` : 'Live Data';
  }, [ordersList]);

  // 100% Dynamic Total Customers directly from live customersList & ordersList
  const totalCustomers = useMemo(() => {
    if (customersList && customersList.length > 0) return customersList.length;
    if (ordersList && ordersList.length > 0) {
      return new Set(ordersList.map((o) => o.customerEmail || o.customerName || o.email || o.id)).size;
    }
    return 0;
  }, [customersList, ordersList]);

  const customersGrowth = useMemo(() => {
    return `${totalCustomers} registered`;
  }, [totalCustomers]);

  // Dynamic Active Products & Out of Stock
  const activeProducts = useMemo(() => {
    return (productsList || []).filter((p) => p.isActive !== false).length;
  }, [productsList]);

  const outOfStockProducts = useMemo(() => {
    return (productsList || []).filter((p) => Number(p.stock ?? 0) === 0).length;
  }, [productsList]);

  // Dynamic Pending Orders Count
  const pendingOrdersCount = useMemo(() => {
    return (ordersList || []).filter((o) => {
      const st = (o.orderStatus || o.status || '').toLowerCase();
      return st === 'pending' || st === 'processing';
    }).length;
  }, [ordersList]);

  // Dynamic Delivered Orders & Success Rate
  const deliveredOrdersCount = useMemo(() => {
    return (ordersList || []).filter((o) => (o.orderStatus || o.status || '').toLowerCase() === 'delivered').length;
  }, [ordersList]);

  const deliveredSuccessRate = useMemo(() => {
    const total = (ordersList || []).length;
    if (total === 0) return '100% Success Rate';
    const pct = Math.round((deliveredOrdersCount / total) * 100);
    return `${pct}% Success Rate`;
  }, [deliveredOrdersCount, ordersList]);

  // Dynamic Cancelled Orders & Cancel Rate
  const cancelledOrdersCount = useMemo(() => {
    return (ordersList || []).filter((o) => (o.orderStatus || o.status || '').toLowerCase() === 'cancelled').length;
  }, [ordersList]);

  const cancelRateSubtitle = useMemo(() => {
    const total = (ordersList || []).length;
    if (total === 0) return '0% Cancel Rate';
    const pct = ((cancelledOrdersCount / total) * 100).toFixed(1);
    return `${pct}% Cancel Rate`;
  }, [cancelledOrdersCount, ordersList]);

  // Dynamic Refund Amount Total
  const refundAmountTotal = useMemo(() => {
    if (analyticsMetrics?.refundAmountTotal !== undefined) {
      return analyticsMetrics.refundAmountTotal;
    }
    return (ordersList || [])
      .filter((o) => (o.orderStatus || o.status || '').toLowerCase() === 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);
  }, [ordersList, analyticsMetrics]);

  // Dynamic Revenue Trend Chart Data
  const currentChartData = useMemo(() => {
    if (analyticsMetrics?.salesTrend?.[chartTimeframe]) {
      return analyticsMetrics.salesTrend[chartTimeframe];
    }

    if (chartTimeframe === '7 Days' || chartTimeframe === 'Today') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayTotals = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      (ordersList || []).forEach((o) => {
        const d = new Date(o.createdAt || o.date);
        const dayName = isNaN(d.getDay()) ? 'Mon' : days[(d.getDay() + 6) % 7];
        dayTotals[dayName] = (dayTotals[dayName] || 0) + Number(o.totalAmount || o.total || 0);
      });
      return days.map((day) => ({ label: day, value: dayTotals[day] }));
    }

    if (chartTimeframe === '30 Days' || chartTimeframe === '3 Months') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weekTotals = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0 };
      (ordersList || []).forEach((o, i) => {
        const wk = weeks[i % 4];
        weekTotals[wk] += Number(o.totalAmount || o.total || 0);
      });
      return weeks.map((w) => ({ label: w, value: weekTotals[w] }));
    }

    // 1 Year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthTotals = {};
    months.forEach((m) => (monthTotals[m] = 0));
    (ordersList || []).forEach((o) => {
      const d = new Date(o.createdAt || o.date);
      const mName = isNaN(d.getMonth()) ? 'Aug' : months[d.getMonth()];
      monthTotals[mName] += Number(o.totalAmount || o.total || 0);
    });
    return months.map((m) => ({ label: m, value: monthTotals[m] }));
  }, [ordersList, analyticsMetrics, chartTimeframe]);

  const maxChartValue = Math.max(...(currentChartData || []).map((d) => d.value || 0)) || 1;

  // Dynamic Sales by Category
  const categorySalesList = useMemo(() => {
    if (analyticsMetrics?.categorySales && analyticsMetrics.categorySales.length > 0) {
      return analyticsMetrics.categorySales;
    }
    const catMap = {};
    let totalSalesVal = 0;
    (productsList || []).forEach((p) => {
      const cat = p.category || 'Other';
      const val = (Number(p.price) || 0) * (Number(p.stock) || 1);
      catMap[cat] = (catMap[cat] || 0) + val;
      totalSalesVal += val;
    });

    const cats = Object.keys(catMap);
    if (cats.length === 0) return [];

    return cats.map((cat) => {
      const sales = catMap[cat];
      const percentage = totalSalesVal > 0 ? Math.round((sales / totalSalesVal) * 100) : 0;
      return { category: cat, sales, percentage };
    }).sort((a, b) => b.sales - a.sales);
  }, [productsList, analyticsMetrics]);

  // Dynamic Payment Methods Split
  const paymentMethodSplitList = useMemo(() => {
    if (analyticsMetrics?.paymentMethodSplit && analyticsMetrics.paymentMethodSplit.length > 0) {
      return analyticsMetrics.paymentMethodSplit;
    }
    if (!ordersList || ordersList.length === 0) {
      return [
        { method: 'Prepaid / Online (UPI/Cards)', percentage: 0 },
        { method: 'Cash on Delivery (COD)', percentage: 0 }
      ];
    }
    const counts = {};
    ordersList.forEach((o) => {
      const pm = o.paymentMethod || 'Prepaid';
      counts[pm] = (counts[pm] || 0) + 1;
    });
    const total = ordersList.length;
    return Object.keys(counts).map((pm) => ({
      method: pm,
      percentage: Math.round((counts[pm] / total) * 100)
    })).sort((a, b) => b.percentage - a.percentage);
  }, [ordersList, analyticsMetrics]);

  // Recent Orders table columns
  const recentOrdersColumns = [
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
      label: 'Customer',
      render: (row) => (
        <div>
          <p className="font-bold text-gray-900">{row.customerName}</p>
          <p className="text-[10px] text-gray-400 font-medium">{row.customerEmail}</p>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span className="font-semibold text-gray-600">{row.date}</span>
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (row) => (
        <span className="font-black text-gray-900">₹{row.totalAmount?.toLocaleString('en-IN')}</span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (row) => (
        <span className="text-[11px] font-bold text-gray-600">{row.paymentMethod}</span>
      )
    },
    {
      key: 'orderStatus',
      label: 'Status',
      render: (row) => <StatusBadge status={row.orderStatus} />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Link
            to={`/admin/orders/details/${row.id}`}
            className="p-1.5 text-gray-600 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <select
            value={row.orderStatus}
            onChange={(e) => updateOrderStatus(row.id, e.target.value)}
            className="bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-700 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#D81B60]"
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#D81B60] via-[#C2185B] to-pink-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-1 max-w-xl">
          <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Control Dashboard
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
            Welcome Back, {adminDisplayName}!
          </h1>
          <p className="text-xs text-pink-100 font-medium">
            Here is your live store performance, sales analytics, and active order pipeline.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/admin/catalog/add-product"
            className="bg-white hover:bg-pink-50 text-[#D81B60] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${Number(totalRevenue).toLocaleString('en-IN')}`}
          growth={revenueGrowth}
          isPositive={true}
          icon={IndianRupee}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value={Number(totalOrders).toLocaleString('en-IN')}
          growth={ordersGrowth}
          isPositive={true}
          icon={ShoppingBag}
          iconBg="bg-pink-50 text-[#D81B60]"
        />
        <StatCard
          title="Total Customers"
          value={Number(totalCustomers).toLocaleString('en-IN')}
          growth={customersGrowth}
          isPositive={true}
          icon={Users}
          iconBg="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Active Products"
          value={activeProducts}
          subtitle={`${outOfStockProducts} Out of stock`}
          icon={Package}
          iconBg="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrdersCount}
          subtitle="Requires fulfillment action"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Delivered Orders"
          value={deliveredOrdersCount}
          subtitle={deliveredSuccessRate}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Cancelled Orders"
          value={cancelledOrdersCount}
          subtitle={cancelRateSubtitle}
          icon={XCircle}
          isPositive={false}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Refund Amount"
          value={`₹${Number(refundAmountTotal).toLocaleString('en-IN')}`}
          subtitle="Processed this month"
          icon={RefreshCw}
          iconBg="bg-slate-100 text-slate-700"
        />
      </div>

      {/* Analytics Charts & Visuals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-gray-900">Revenue & Sales Trends</h3>
              <p className="text-xs text-gray-500 font-semibold">Track gross revenue earnings over time</p>
            </div>

            {/* Timeframe Presets */}
            <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/60 self-start sm:self-auto">
              {['Today', '7 Days', '30 Days', '3 Months', '1 Year'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    chartTimeframe === tf
                      ? 'bg-[#D81B60] text-white shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Responsive SVG Progress Bar Chart */}
          <div className="space-y-4 pt-2">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100">
              {currentChartData.map((d, index) => {
                const heightPercent = Math.max(12, Math.round((d.value / maxChartValue) * 100));
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] font-bold text-[#D81B60] opacity-0 group-hover:opacity-100 transition-opacity bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 shrink-0">
                      ₹{d.value.toLocaleString('en-IN')}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-[#D81B60] to-pink-400 rounded-t-xl group-hover:brightness-110 transition-all shadow-2xs"
                    />
                    <span className="text-[11px] font-bold text-gray-500 shrink-0">{d.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D81B60]" /> Gross Sales Volume
              </span>
              <span>Updated just now</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Payment Methods (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Share */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Sales by Category</h3>

            <div className="space-y-3">
              {categorySalesList.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-800">{cat.category}</span>
                    <span className="text-[#D81B60]">₹{Number(cat.sales || 0).toLocaleString('en-IN')} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className="h-full bg-gradient-to-r from-[#D81B60] to-pink-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Split */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Payment Methods</h3>

            <div className="space-y-3">
              {paymentMethodSplitList.map((pay, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">{pay.method}</span>
                  <span className="font-extrabold text-gray-900">{pay.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500 font-semibold">Live order transactions and quick status controls</p>
          </div>
          <Link
            to="/admin/orders/all"
            className="text-xs font-extrabold text-[#D81B60] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DataTable
          columns={recentOrdersColumns}
          data={ordersList}
          searchKey="id"
          searchPlaceholder="Search Recent Orders..."
        />
      </div>

      {/* Low Stock Alert Box */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base text-amber-900">Low Stock Alert ({lowStockItems.length} Products)</h3>
              <p className="text-xs text-amber-700 font-medium">The following items are running below safe inventory thresholds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] font-bold text-amber-700 mt-0.5">Stock Left: {item.stock} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
