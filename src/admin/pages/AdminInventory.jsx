import React, { useState, useMemo } from 'react';
import { Warehouse, AlertTriangle, Package, IndianRupee, Plus, Minus, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import DataTable from '../components/DataTable';

export default function AdminInventory() {
  const { productsList, adjustStock, showToast } = useAdmin();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentQty, setAdjustmentQty] = useState(5);
  const [adjustmentType, setAdjustmentType] = useState('add'); // 'add' | 'subtract'
  const [reason, setReason] = useState('New Shipment Arrival');

  // Metrics
  const totalStockCount = useMemo(() => {
    return productsList.reduce((sum, p) => sum + (p.stock || 0), 0);
  }, [productsList]);

  const totalInventoryValue = useMemo(() => {
    return productsList.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
  }, [productsList]);

  const lowStockCount = productsList.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 15).length;
  const outOfStockCount = productsList.filter((p) => (p.stock || 0) <= 0).length;

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const qty = adjustmentType === 'add' ? Number(adjustmentQty) : -Number(adjustmentQty);
    adjustStock(selectedProduct.id, qty, reason);
    setSelectedProduct(null);
  };

  const inventoryColumns = [
    {
      key: 'images',
      label: 'Image',
      sortable: false,
      render: (row) => (
        <img
          src={row.images?.[0] || 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=200&q=80'}
          alt={row.name}
          className="w-12 h-12 rounded-xl object-cover border border-pink-100 shrink-0"
        />
      )
    },
    {
      key: 'name',
      label: 'Product Details',
      render: (row) => (
        <div>
          <p className="font-extrabold text-gray-900">{row.name}</p>
          <p className="text-[10px] text-gray-400 font-mono">SKU: {row.id}</p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <span className="font-bold text-gray-700">{row.category}</span>
    },
    {
      key: 'stock',
      label: 'Available Stock',
      render: (row) => (
        <span className="font-black text-gray-900 text-sm">{row.stock ?? 15} units</span>
      )
    },
    {
      key: 'price',
      label: 'Unit Value',
      render: (row) => <span className="font-bold text-gray-900">₹{row.price?.toLocaleString('en-IN')}</span>
    },
    {
      key: 'status',
      label: 'Stock Status',
      render: (row) => {
        const qty = row.stock ?? 15;
        let badgeType = 'In Stock';
        if (qty <= 0) badgeType = 'Out of Stock';
        else if (qty <= 15) badgeType = 'Low Stock';
        return <StatusBadge status={badgeType} />;
      }
    },
    {
      key: 'actions',
      label: 'Adjust Stock',
      sortable: false,
      render: (row) => (
        <button
          type="button"
          onClick={() => {
            setSelectedProduct(row);
            setAdjustmentQty(5);
            setAdjustmentType('add');
          }}
          className="px-3 py-1.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          Adjust Quantity
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Inventory & Stock Dashboard</h1>
        <p className="text-xs text-gray-500 font-semibold">Monitor product quantities, set reorder points, and adjust stock levels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Units in Warehouse"
          value={`${totalStockCount.toLocaleString('en-IN')} units`}
          icon={Warehouse}
          iconBg="bg-pink-50 text-[#D81B60]"
        />
        <StatCard
          title="Estimated Inventory Value"
          value={`₹${totalInventoryValue.toLocaleString('en-IN')}`}
          icon={IndianRupee}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Low Stock Items"
          value={`${lowStockCount} items`}
          subtitle="Reorder suggested"
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Out of Stock Items"
          value={`${outOfStockCount} items`}
          subtitle="Unavailable for customers"
          icon={Package}
          iconBg="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Main Table */}
      <DataTable
        columns={inventoryColumns}
        data={productsList}
        searchKey={(r, q) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
        }
        searchPlaceholder="Search product by name, SKU..."
      />

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          <form
            onSubmit={handleAdjustSubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">Adjust Stock Quantity</h3>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
              <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-extrabold text-gray-900">{selectedProduct.name}</p>
                <p className="text-[11px] font-bold text-[#D81B60]">Current Stock: {selectedProduct.stock || 0} units</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('add')}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      adjustmentType === 'add'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    + Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('subtract')}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      adjustmentType === 'subtract'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    - Reduce Stock
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Quantity ({adjustmentType === 'add' ? '+' : '-'})
                </label>
                <input
                  type="number"
                  min={1}
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-900 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1"
                >
                  <option value="New Shipment Arrival">New Shipment Arrival</option>
                  <option value="Damaged Stock Return">Damaged Stock Return</option>
                  <option value="Physical Audit Discrepancy">Physical Audit Discrepancy</option>
                  <option value="Customer Return Stocked">Customer Return Stocked</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs"
              >
                Apply Stock Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
