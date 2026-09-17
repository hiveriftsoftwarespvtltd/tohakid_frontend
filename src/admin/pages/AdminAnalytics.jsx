import React, { useState } from 'react';
import { Download, BarChart2, TrendingUp, IndianRupee, ShoppingBag, Users, Calendar } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/StatCard';

export default function AdminAnalytics() {
  const { analyticsMetrics, showToast } = useAdmin();
  const [timeframe, setTimeframe] = useState('30 Days');

  const currentChartData = analyticsMetrics.salesTrend5[timeframe] || analyticsMetrics.salesTrend5['30 Days'];
  const maxChartValue = Math.max(...currentChartData.map((d) => d.value)) || 1;

  const handleExportReport = () => {
    showToast(`Exported Analytics Report (${timeframe}) to CSV!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Sales & Business Analytics</h1>
          <p className="text-xs text-gray-500 font-semibold">Deep insights into revenue, order frequency, and growth performance</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Presets */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200">
            {['Today', '7 Days', '30 Days', '3 Months', '1 Year'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#D81B60] text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Revenue Generated"
          value={`₹${analyticsMetrics.totalRevenue.toLocaleString('en-IN')}`}
          growth={analyticsMetrics.revenueGrowth}
          isPositive={true}
          icon={IndianRupee}
          iconBg="bg-emerald-50 text-emerald-600"
          subtitle={`Filtered by ${timeframe}`}
        />
        <StatCard
          title="Total Orders Processed"
          value={analyticsMetrics.totalOrders.toLocaleString('en-IN')}
          growth={analyticsMetrics.ordersGrowth}
          isPositive={true}
          icon={ShoppingBag}
          iconBg="bg-pink-50 text-[#D81B60]"
          subtitle="Avg order value ₹2,810"
        />
        <StatCard
          title="New Customer Registrations"
          value={analyticsMetrics.totalCustomers.toLocaleString('en-IN')}
          growth={analyticsMetrics.customersGrowth}
          isPositive={true}
          icon={Users}
          iconBg="bg-sky-50 text-sky-600"
          subtitle="78.4% Retention Rate"
        />
      </div>

      {/* Main Analytics Chart Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-gray-900">Revenue Performance Graph ({timeframe})</h3>
            <p className="text-xs text-gray-500 font-semibold">Comparative breakdown of gross earnings</p>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 border-b border-gray-100">
          {currentChartData.map((d, index) => {
            const heightPercent = Math.max(15, Math.round((d.value / maxChartValue) * 100));
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-bold text-[#D81B60] opacity-0 group-hover:opacity-100 transition-opacity bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 shrink-0">
                  ₹{d.value.toLocaleString('en-IN')}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-[#D81B60] via-pink-500 to-pink-300 rounded-t-xl group-hover:brightness-110 transition-all shadow-2xs"
                />
                <span className="text-[11px] font-bold text-gray-500 shrink-0">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Analytics Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Contribution */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-base text-gray-900">Category Revenue Contribution</h3>
          <div className="space-y-4">
            {analyticsMetrics.categorySales.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800">{cat.category}</span>
                  <span className="text-[#D81B60]">₹{cat.sales.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-[#D81B60] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Channels */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-base text-gray-900">Payment Gateway Distribution</h3>
          <div className="space-y-4">
            {analyticsMetrics.paymentMethodSplit.map((pay, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800">{pay.method}</span>
                  <span className="text-gray-900">₹{pay.amount.toLocaleString('en-IN')} ({pay.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pay.percentage}%` }}
                    className="h-full bg-slate-800 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
