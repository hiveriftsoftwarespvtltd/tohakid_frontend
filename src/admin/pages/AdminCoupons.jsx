import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit, Calendar, X, Check, ToggleLeft, ToggleRight, Sparkles, Percent, IndianRupee } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminCoupons() {
  const {
    couponsList,
    addCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
    openConfirmModal,
    showToast
  } = useAdmin();

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialFormState = {
    code: '',
    discountType: 'Percentage', // 'Percentage' | 'Fixed Amount' | 'Free Shipping'
    discountValue: 15,
    minOrderValue: 1499,
    maxDiscount: 500,
    usageLimit: 500,
    status: 'Active',
    expiryDate: '2026-12-31'
  };

  const [couponForm, setCouponForm] = useState(initialFormState);

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setCouponForm(initialFormState);
    setShowCouponModal(true);
  };

  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code || '',
      discountType: coupon.discountType || (coupon.type === 'FIXED' ? 'Fixed Amount' : 'Percentage'),
      discountValue: coupon.discountValue ?? coupon.value ?? 10,
      minOrderValue: coupon.minOrderValue ?? coupon.minimumOrderValue ?? 0,
      maxDiscount: coupon.maxDiscount ?? coupon.maximumDiscount ?? 500,
      usageLimit: coupon.usageLimit ?? 500,
      status: coupon.status || (coupon.isActive !== false ? 'Active' : 'Inactive'),
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '2026-12-31'
    });
    setShowCouponModal(true);
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) {
      showToast('Please enter a valid coupon code.');
      return;
    }

    const dType = couponForm.discountType;
    const typeEnum = dType === 'Fixed Amount' ? 'FIXED' : dType === 'Free Shipping' ? 'FREE_SHIPPING' : 'PERCENTAGE';
    const val = Number(couponForm.discountValue) || 0;
    const minVal = Number(couponForm.minOrderValue) || 0;

    const payload = {
      ...couponForm,
      code: couponForm.code.trim().toUpperCase(),
      discountType: dType,
      type: typeEnum,
      discountValue: val,
      value: val,
      minOrderValue: minVal,
      minimumOrderValue: minVal,
      usageLimit: Number(couponForm.usageLimit) || 100,
      isActive: couponForm.status === 'Active'
    };

    if (editingCoupon) {
      const couponId = editingCoupon.id || editingCoupon._id || editingCoupon.code;
      await updateCoupon(couponId, payload);
    } else {
      await addCoupon(payload);
    }

    setShowCouponModal(false);
    setEditingCoupon(null);
  };

  const couponColumns = [
    {
      key: 'code',
      label: 'Coupon Code',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#D81B60]" />
          <span className="font-mono font-black text-gray-900 bg-pink-50 border border-pink-200 px-3 py-1 rounded-xl shadow-2xs">
            {row.code}
          </span>
        </div>
      )
    },
    {
      key: 'discountType',
      label: 'Discount Type',
      render: (row) => (
        <span className="font-bold text-gray-700">
          {row.discountType || (row.type === 'FIXED' ? 'Fixed Amount' : 'Percentage')}
        </span>
      )
    },
    {
      key: 'discountValue',
      label: 'Value',
      render: (row) => {
        const val = row.discountValue ?? row.value ?? 0;
        const type = row.discountType || row.type;
        const isFixed = type === 'Fixed Amount' || type === 'FIXED';
        return (
          <span className="font-black text-[#D81B60] text-sm">
            {isFixed ? `₹${val} OFF` : `${val}% OFF`}
          </span>
        );
      }
    },
    {
      key: 'minOrderValue',
      label: 'Min Order',
      render: (row) => {
        const minVal = row.minOrderValue ?? row.minimumOrderValue ?? 0;
        return <span className="font-semibold text-gray-800">₹{minVal.toLocaleString('en-IN')}</span>;
      }
    },
    {
      key: 'usedCount',
      label: 'Usage Stats',
      render: (row) => (
        <span className="font-bold text-gray-900">
          {row.usedCount || 0} / {row.usageLimit || 500} used
        </span>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      render: (row) => {
        const dateStr = row.expiryDate
          ? typeof row.expiryDate === 'string'
            ? row.expiryDate.split('T')[0]
            : new Date(row.expiryDate).toISOString().split('T')[0]
          : '2026-12-31';
        return <span className="font-semibold text-gray-600 font-mono text-xs">{dateStr}</span>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const currentStatus = row.status || (row.isActive !== false ? 'Active' : 'Inactive');
        return (
          <button
            type="button"
            onClick={() => toggleCouponStatus(row)}
            title="Click to toggle status"
            className="cursor-pointer transition-transform active:scale-95"
          >
            <StatusBadge status={currentStatus} />
          </button>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Coupon"
            className="p-1.5 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: 'Delete Coupon?',
                message: `Are you sure you want to delete promo code "${row.code}"?`,
                isDanger: true,
                confirmText: 'Delete',
                onConfirm: () => deleteCoupon(row.id || row._id || row.code)
              })
            }
            title="Delete Coupon"
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#D81B60]" />
            <span>Coupons & Discount Codes</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Full CRUD management: Create, Edit, Toggle, and Delete promo codes for your store
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={couponColumns}
        data={couponsList}
        searchKey="code"
        searchPlaceholder="Search coupon code..."
      />

      {/* Create / Edit Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowCouponModal(false)} />
          <form
            onSubmit={handleCouponSubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D81B60]" />
                <span>{editingCoupon ? 'Edit Promo Code' : 'Create New Promo Code'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Coupon Code <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="FESTIVE25"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-black text-gray-900 mt-1 uppercase focus:ring-1 focus:ring-[#D81B60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Discount Type
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                    <option value="Free Shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Status
                  </label>
                  <select
                    value={couponForm.status}
                    onChange={(e) => setCouponForm({ ...couponForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={couponForm.expiryDate}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCouponModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
