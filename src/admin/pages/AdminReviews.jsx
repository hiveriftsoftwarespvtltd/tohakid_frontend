import React, { useState, useMemo } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminReviews() {
  const { reviewsList, updateReviewStatus, deleteReview, openConfirmModal } = useAdmin();
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredReviews = useMemo(() => {
    return reviewsList.filter((r) => {
      if (ratingFilter !== 'All' && r.rating !== Number(ratingFilter)) {
        return false;
      }
      if (statusFilter !== 'All' && r.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [reviewsList, ratingFilter, statusFilter]);

  const reviewColumns = [
    {
      key: 'customerName',
      label: 'Customer',
      render: (row) => (
        <div>
          <p className="font-extrabold text-gray-900">{row.customerName}</p>
          <p className="text-[10px] text-gray-400 font-medium">{row.customerEmail}</p>
        </div>
      )
    },
    {
      key: 'productName',
      label: 'Product',
      render: (row) => <span className="font-bold text-gray-800 line-clamp-1">{row.productName}</span>
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < row.rating ? 'fill-amber-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs font-extrabold text-gray-900 ml-1">({row.rating})</span>
        </div>
      )
    },
    {
      key: 'comment',
      label: 'Review Text',
      render: (row) => <p className="text-xs text-gray-600 font-medium line-clamp-2">{row.comment}</p>
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => <span className="text-xs text-gray-500 font-semibold">{row.date}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => updateReviewStatus(row.id, 'Approved')}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Approve Review"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {row.status !== 'Rejected' && (
            <button
              type="button"
              onClick={() => updateReviewStatus(row.id, 'Rejected')}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Reject Review"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: 'Delete Review?',
                message: `Delete feedback from "${row.customerName}"?`,
                isDanger: true,
                confirmText: 'Delete',
                onConfirm: () => deleteReview(row.id)
              })
            }
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Review"
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
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Product Reviews & Ratings</h1>
          <p className="text-xs text-gray-500 font-semibold">Moderate parent testimonials and product star feedback</p>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-pink-100 shadow-2xs text-xs font-bold">
          <span className="text-gray-400 pl-2">Rating:</span>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800"
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
          </select>

          <span className="text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={reviewColumns}
        data={filteredReviews}
        searchKey={(r, q) =>
          r.customerName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
        }
        searchPlaceholder="Search product reviews..."
      />
    </div>
  );
}
