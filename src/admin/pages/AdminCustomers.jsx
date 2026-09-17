import React, { useState } from 'react';
import { Eye, Mail, Phone, MapPin, Award, ShoppingBag, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminCustomers() {
  const { customersList } = useAdmin();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customerColumns = [
    {
      key: 'name',
      label: 'Customer Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-300 text-[#D81B60] font-extrabold text-sm flex items-center justify-center shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-extrabold text-gray-900">{row.name}</p>
            <p className="text-[10px] text-gray-400 font-medium">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Mobile Number',
      render: (row) => <span className="font-mono text-xs text-gray-700">{row.phone}</span>
    },
    {
      key: 'ordersCount',
      label: 'Total Orders',
      render: (row) => <span className="font-extrabold text-gray-900">{row.ordersCount} orders</span>
    },
    {
      key: 'totalSpent',
      label: 'Total Spending',
      render: (row) => (
        <span className="font-black text-[#D81B60] text-sm">₹{row.totalSpent?.toLocaleString('en-IN')}</span>
      )
    },
    {
      key: 'tier',
      label: 'Membership Tier',
      render: (row) => (
        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
          {row.tier}
        </span>
      )
    },
    {
      key: 'registrationDate',
      label: 'Joined Date',
      render: (row) => <span className="text-gray-500 font-medium text-xs">{row.registrationDate}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedCustomer(row)}
          className="p-1.5 text-gray-500 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
          title="View Full Profile"
        >
          <Eye className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Registered Customers</h1>
        <p className="text-xs text-gray-500 font-semibold">View parent profiles, total spending, and reward points</p>
      </div>

      {/* Main Table */}
      <DataTable
        columns={customerColumns}
        data={customersList}
        searchKey={(r, q) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.includes(q)
        }
        searchPlaceholder="Search customer by name, email, phone..."
      />

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedCustomer(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl border border-pink-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">Customer Details</h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
              <div className="w-14 h-14 rounded-full bg-[#D81B60] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-base text-gray-900">{selectedCustomer.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{selectedCustomer.email}</p>
                <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1">
                  {selectedCustomer.tier} • {selectedCustomer.coins} Tohay Coins
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-400 font-medium">Total Spending</p>
                <p className="text-base font-black text-gray-900">₹{selectedCustomer.totalSpent?.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-400 font-medium">Total Orders</p>
                <p className="text-base font-black text-gray-900">{selectedCustomer.ordersCount} Orders</p>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{selectedCustomer.address}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
