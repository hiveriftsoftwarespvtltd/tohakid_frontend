import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, Inbox, Check } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Pagination from './Pagination';

export default function DataTable({
  columns = [],
  data = [],
  searchKey = 'name',
  searchPlaceholder = 'Search records...',
  bulkActions = [],
  isLoading = false,
  emptyTitle = 'No Records Found',
  emptySub = 'Try adjusting your search or filters.',
  onEmptyAction,
  emptyActionText = 'Add New Item',
  defaultRowsPerPage = 10,
  selectable = true
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [selectedIds, setSelectedIds] = useState([]);

  // Initialize page from URL query param (?page=...) or fallback to sessionStorage or 1
  const [currentPage, setCurrentPage] = useState(() => {
    const p = parseInt(searchParams.get('page'), 10);
    if (!isNaN(p) && p > 0) return p;
    const sessionP = parseInt(sessionStorage.getItem('tohay_admin_products_page'), 10);
    if (!isNaN(sessionP) && sessionP > 0) return sessionP;
    return 1;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const r = parseInt(searchParams.get('limit'), 10);
    return !isNaN(r) && r > 0 ? r : defaultRowsPerPage;
  });

  // Filter Data via Search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) => {
      if (typeof searchKey === 'function') return searchKey(item, q);
      const val = item[searchKey];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(q);
    });
  }, [data, searchQuery, searchKey]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      let comparison = 0;
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        comparison = String(valA).localeCompare(String(valB));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;

  // Handle page change and persist to URL (?page=...) and sessionStorage
  const handlePageChange = (newPage) => {
    const safePage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(safePage);
    const params = new URLSearchParams(window.location.search);
    if (safePage > 1) {
      params.set('page', String(safePage));
      sessionStorage.setItem('tohay_admin_products_page', String(safePage));
    } else {
      params.delete('page');
      sessionStorage.setItem('tohay_admin_products_page', '1');
    }
    setSearchParams(params, { replace: true });
  };

  // Keep state in sync if URL page changes externally (browser back/forward or filter reset)
  useEffect(() => {
    const p = parseInt(searchParams.get('page'), 10);
    const targetPage = !isNaN(p) && p > 0 ? p : 1;
    if (targetPage !== currentPage && (data.length === 0 || targetPage <= totalPages)) {
      setCurrentPage(targetPage);
    }
  }, [searchParams, totalPages, data.length]);

  // Safely clamp current page if filtered data has fewer pages, ONLY when data is actually loaded
  useEffect(() => {
    if (data.length > 0 && totalPages > 0 && currentPage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [totalPages, data.length]);

  const paginatedData = useMemo(() => {
    const safeCurrent = Math.min(currentPage, totalPages);
    const start = (safeCurrent - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, totalPages, rowsPerPage]);

  // Sort Handler
  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllPaginatedSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  return (
    <div className="bg-white rounded-3xl border border-pink-100/80 shadow-2xs overflow-hidden">
      {/* Top Bar: Search & Bulk Action Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all"
          />
        </div>

        {/* Selected Count & Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#D81B60]">
            <span>{selectedIds.length} selected</span>
            {bulkActions.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  action.onClick(selectedIds);
                  setSelectedIds([]);
                }}
                className="ml-2 px-2.5 py-1 bg-white hover:bg-pink-100 text-[#D81B60] border border-pink-300 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer shadow-2xs"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
              {selectable && (
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${col.className || ''}`}
                >
                  {col.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-[#D81B60] transition-colors font-extrabold cursor-pointer"
                    >
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </button>
                  ) : (
                    <span>{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {selectable && <td className="p-4"><div className="w-4 h-4 bg-gray-200 rounded" /></td>}
                  {columns.map((col, j) => (
                    <td key={j} className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isSelected = selectedIds.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-pink-50/40 transition-colors ${
                      isSelected ? 'bg-pink-50/60' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row.id)}
                          className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`py-3.5 px-4 ${col.cellClassName || ''}`}>
                        {col.render ? col.render(row) : row[col.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              // Empty State Row
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#D81B60] mx-auto">
                      <Inbox className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-gray-800">{emptyTitle}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{emptySub}</p>
                    </div>
                    {onEmptyAction && (
                      <button
                        type="button"
                        onClick={onEmptyAction}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        <span>{emptyActionText}</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/40">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalRecords={sortedData.length}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(newVal) => {
            setRowsPerPage(newVal);
            handlePageChange(1);
          }}
        />
      </div>
    </div>
  );
}
