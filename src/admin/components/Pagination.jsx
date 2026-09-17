import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  rowsPerPage,
  onRowsPerPageChange
}) {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 px-1 text-xs font-semibold text-gray-600">
      {/* Left: Total Records Info & Rows Selector */}
      <div className="flex items-center gap-4">
        <span>
          Showing <strong className="text-gray-900 font-extrabold">{startRecord}-{endRecord}</strong> of <strong className="text-gray-900 font-extrabold">{totalRecords}</strong> entries
        </span>

        {onRowsPerPageChange && (
          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <span className="text-gray-500">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D81B60]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-pink-50 disabled:opacity-40 disabled:hover:bg-white text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#D81B60] text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-pink-50 disabled:opacity-40 disabled:hover:bg-white text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
