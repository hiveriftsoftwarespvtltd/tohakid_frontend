import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminReturns() {
  const { returnsList, updateReturnStatus, openConfirmModal } = useAdmin();

  const returnColumns = [
    {
      key: 'id',
      label: 'Return ID',
      render: (row) => <span className="font-extrabold text-gray-900 font-mono">{row.id}</span>
    },
    {
      key: 'orderId',
      label: 'Order Reference',
      render: (row) => (
        <Link to={`/admin/orders/details/${row.orderId}`} className="font-extrabold text-[#D81B60] hover:underline">
          #{row.orderId}
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
      key: 'productName',
      label: 'Returned Outfit',
      render: (row) => <span className="font-semibold text-gray-800 line-clamp-1">{row.productName}</span>
    },
    {
      key: 'reason',
      label: 'Reason for Return',
      render: (row) => <span className="text-xs text-gray-600 font-medium">{row.reason}</span>
    },
    {
      key: 'refundAmount',
      label: 'Refund Value',
      render: (row) => (
        <span className="font-black text-[#D81B60] text-sm">₹{row.refundAmount?.toLocaleString('en-IN')}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      label: 'Approval Action',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status !== 'Refunded' && row.status !== 'Approved' && (
            <button
              type="button"
              onClick={() => updateReturnStatus(row.id, 'Approved')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-extrabold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Approve Return
            </button>
          )}

          {row.status === 'Approved' && (
            <button
              type="button"
              onClick={() => updateReturnStatus(row.id, 'Refunded')}
              className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-extrabold hover:bg-purple-100 transition-colors cursor-pointer"
            >
              Process Refund
            </button>
          )}

          {row.status !== 'Rejected' && row.status !== 'Refunded' && (
            <button
              type="button"
              onClick={() => updateReturnStatus(row.id, 'Rejected')}
              className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-extrabold hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Reject
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-gray-900">Returns & Refund Requests</h1>
        <p className="text-xs text-gray-500 font-semibold">Review customer exchange/refund claims and execute instant payment rollbacks</p>
      </div>

      {/* Main Table */}
      <DataTable
        columns={returnColumns}
        data={returnsList}
        searchKey={(r, q) =>
          r.id.toLowerCase().includes(q) ||
          r.orderId.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
        }
        searchPlaceholder="Search return ID, order ID, customer name..."
      />
    </div>
  );
}
