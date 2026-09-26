import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus, Search, Filter, Edit, Trash2, Copy, Eye, Tag, AlertTriangle, Check, X, ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { isSubcategoryMatch, isAgeMatch, isCategoryMatch } from '../../utils/filterUtils';

export default function AdminProducts() {
  const navigate = useNavigate();
  const {
    productsList,
    categoriesList,
    deleteProduct,
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    openConfirmModal,
    showToast,
    addProduct
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  // Persist filter states in URL searchParams & sessionStorage across page refreshes
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return searchParams.get('category') || sessionStorage.getItem('tohay_admin_filter_category') || 'All Categories';
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    return searchParams.get('subcategory') || sessionStorage.getItem('tohay_admin_filter_subcategory') || 'All Subcategories';
  });
  const [selectedStockStatus, setSelectedStockStatus] = useState(() => {
    return searchParams.get('stock') || sessionStorage.getItem('tohay_admin_filter_stock') || 'All';
  });
  const [selectedSaleStatus, setSelectedSaleStatus] = useState(() => {
    return searchParams.get('pricing') || sessionStorage.getItem('tohay_admin_filter_pricing') || 'All';
  });

  // Keep URL parameters and sessionStorage in sync whenever filters change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (selectedCategory && selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
      params.set('category', selectedCategory);
      sessionStorage.setItem('tohay_admin_filter_category', selectedCategory);
    } else {
      params.delete('category');
      sessionStorage.removeItem('tohay_admin_filter_category');
    }

    if (selectedSubcategory && selectedSubcategory !== 'All Subcategories' && selectedSubcategory !== 'All') {
      params.set('subcategory', selectedSubcategory);
      sessionStorage.setItem('tohay_admin_filter_subcategory', selectedSubcategory);
    } else {
      params.delete('subcategory');
      sessionStorage.removeItem('tohay_admin_filter_subcategory');
    }

    if (selectedStockStatus && selectedStockStatus !== 'All') {
      params.set('stock', selectedStockStatus);
      sessionStorage.setItem('tohay_admin_filter_stock', selectedStockStatus);
    } else {
      params.delete('stock');
      sessionStorage.removeItem('tohay_admin_filter_stock');
    }

    if (selectedSaleStatus && selectedSaleStatus !== 'All') {
      params.set('pricing', selectedSaleStatus);
      sessionStorage.setItem('tohay_admin_filter_pricing', selectedSaleStatus);
    } else {
      params.delete('pricing');
      sessionStorage.removeItem('tohay_admin_filter_pricing');
    }

    const currentQuery = window.location.search.replace(/^\?/, '');
    const newQuery = params.toString();
    if (currentQuery !== newQuery) {
      setSearchParams(params, { replace: true });
    }
  }, [selectedCategory, selectedSubcategory, selectedStockStatus, selectedSaleStatus, setSearchParams]);

  // Keep search string and page stored in sessionStorage
  useEffect(() => {
    if (window.location.search) {
      sessionStorage.setItem('tohay_admin_products_search', window.location.search);
    }
    const pageNum = searchParams.get('page');
    if (pageNum) {
      sessionStorage.setItem('tohay_admin_products_page', pageNum);
    }
  }, [searchParams]);

  // Product View Modal State
  const [viewProduct, setViewProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 100% Dynamic Categories List strictly from Backend API (categoriesList)
  const mainCategoriesList = useMemo(() => {
    const list = ['All Categories'];

    if (Array.isArray(categoriesList)) {
      categoriesList.forEach((cat) => {
        const name = (typeof cat === 'object' ? cat.name : cat)?.trim();
        if (name && !list.includes(name)) {
          list.push(name);
        }
      });
    }

    return list;
  }, [categoriesList]);

  // Subcategories Options strictly from Backend API & Products of Selected Category
  const subcategoryOptions = useMemo(() => {
    const set = new Set();

    // If a specific category is selected, extract its subcategories from backend categoriesList
    if (selectedCategory !== 'All' && selectedCategory !== 'All Categories') {
      const matchedCat = (categoriesList || []).find((c) => {
        const cName = typeof c === 'object' ? c.name : c;
        return isCategoryMatch(selectedCategory, cName);
      });

      if (matchedCat && Array.isArray(matchedCat.subcategories)) {
        matchedCat.subcategories.forEach((sub) => {
          const sName = typeof sub === 'string' ? sub : sub?.name;
          if (sName?.trim()) set.add(sName.trim());
        });
      }

      // Also include subcategories present on actual products in this category
      (productsList || []).forEach((p) => {
        if (isCategoryMatch(selectedCategory, p.category)) {
          if (p.subcategory?.trim()) set.add(p.subcategory.trim());
        }
      });
    } else {
      // All Categories: combine all subcategories from backend categoriesList + productsList
      (categoriesList || []).forEach((c) => {
        if (Array.isArray(c.subcategories)) {
          c.subcategories.forEach((sub) => {
            const sName = typeof sub === 'string' ? sub : sub?.name;
            if (sName?.trim()) set.add(sName.trim());
          });
        }
      });
      (productsList || []).forEach((p) => {
        if (p.subcategory?.trim()) set.add(p.subcategory.trim());
      });
    }

    return ['All Subcategories', ...Array.from(set)];
  }, [categoriesList, productsList, selectedCategory]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // 1. MAIN CATEGORY FILTER (Strict backend match)
      if (selectedCategory !== 'All' && selectedCategory !== 'All Categories') {
        const isNewArrivalsCat = selectedCategory.toLowerCase().includes('new arrival');
        if (isNewArrivalsCat) {
          if (!isCategoryMatch(selectedCategory, item.category) && !item.isNew) return false;
        } else {
          if (!isCategoryMatch(selectedCategory, item.category)) return false;
        }
      }

      // 2. SUBCATEGORY FILTER
      if (selectedSubcategory !== 'All' && selectedSubcategory !== 'All Subcategories') {
        const isSubMatch = isSubcategoryMatch(selectedSubcategory, item.subcategory, item.name);
        if (!isSubMatch) return false;
      }

      // 3. STOCK STATUS FILTER
      if (selectedStockStatus === 'In Stock' && item.stock <= 0) return false;
      if (selectedStockStatus === 'Low Stock' && (item.stock <= 0 || item.stock > 15)) return false;
      if (selectedStockStatus === 'Out of Stock' && item.stock > 0) return false;

      // 4. SALE STATUS FILTER
      if (selectedSaleStatus === 'Sale' && !item.isSale) return false;
      if (selectedSaleStatus === 'Regular' && item.isSale) return false;

      return true;
    });
  }, [productsList, selectedCategory, selectedSubcategory, selectedStockStatus, selectedSaleStatus]);

  // Duplicate Product Handler
  const handleDuplicate = (prod) => {
    const copy = {
      ...prod,
      name: `${prod.name} (Copy)`,
      id: undefined
    };
    addProduct(copy);
  };

  // Table Columns Setup
  const productColumns = [
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
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => {
              setViewProduct(row);
              setSelectedImageIndex(0);
            }}
            className="font-extrabold text-gray-900 hover:text-[#D81B60] transition-colors text-left line-clamp-1 cursor-pointer"
          >
            {row.name}
          </button>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md uppercase font-mono">SKU: {row.id}</span>
            <span>•</span>
            <span>{row.subcategory || row.category}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <span className="font-bold text-gray-700">{row.category}</span>
    },
    {
      key: 'price',
      label: 'Price & MRP',
      render: (row) => (
        <div>
          <span className="font-black text-gray-900 text-sm">₹{row.price?.toLocaleString('en-IN')}</span>
          {row.mrp && row.mrp > row.price && (
            <span className="text-[11px] text-gray-400 font-semibold line-through ml-1.5">
              ₹{row.mrp?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Stock Level',
      render: (row) => {
        const qty = row.stock ?? 10;
        let badgeType = 'In Stock';
        if (qty <= 0) badgeType = 'Out of Stock';
        else if (qty <= 15) badgeType = 'Low Stock';

        return (
          <div className="space-y-1">
            <StatusBadge status={badgeType} />
            <p className="text-[10px] text-gray-500 font-extrabold pl-1">{qty} units</p>
          </div>
        );
      }
    },
    {
      key: 'isSale',
      label: 'Status',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
            row.isSale
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {row.isSale ? 'On Sale' : 'Active Regular'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setViewProduct(row);
              setSelectedImageIndex(0);
            }}
            className="p-1.5 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="View Product Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <Link
            to={`/admin/catalog/edit-product/${row.id}${window.location.search}`}
            state={{ returnUrl: `/admin/catalog/products${window.location.search}` }}
            className="p-1.5 text-gray-500 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => handleDuplicate(row)}
            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            title="Duplicate Product"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: 'Delete Product?',
                message: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`,
                isDanger: true,
                confirmText: 'Delete Now',
                onConfirm: () => deleteProduct(row.id)
              })
            }
            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Bulk Actions
  const bulkActionsList = [
    {
      label: 'Delete Selected',
      onClick: (selectedIds) => {
        openConfirmModal({
          title: `Delete ${selectedIds.length} Products?`,
          message: `Are you sure you want to delete these ${selectedIds.length} selected products?`,
          isDanger: true,
          confirmText: 'Delete Selected',
          onConfirm: () => bulkDeleteProducts(selectedIds)
        });
      }
    },
    {
      label: 'Set as On Sale',
      onClick: (selectedIds) => bulkUpdateProductStatus(selectedIds, 'Sale')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500 font-semibold">Manage your inventory, prices, images, and category listings</p>
        </div>

        <Link
          to="/admin/catalog/add-product"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-pink-100/80 shadow-2xs flex flex-wrap items-center gap-3 text-xs font-bold text-gray-700">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Filter className="w-4 h-4 text-[#D81B60]" />
          <span>Filters:</span>
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory('All Subcategories');
              const params = new URLSearchParams(window.location.search);
              params.delete('page');
              setSearchParams(params, { replace: true });
            }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:ring-1 focus:ring-[#D81B60]"
          >
            {mainCategoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Subcategory:</span>
          <select
            value={selectedSubcategory}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value);
              const params = new URLSearchParams(window.location.search);
              params.delete('page');
              setSearchParams(params, { replace: true });
            }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:ring-1 focus:ring-[#D81B60]"
          >
            {subcategoryOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub === 'All' ? 'All Subcategories' : sub}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Stock:</span>
          <select
            value={selectedStockStatus}
            onChange={(e) => {
              setSelectedStockStatus(e.target.value);
              const params = new URLSearchParams(window.location.search);
              params.delete('page');
              setSearchParams(params, { replace: true });
            }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:ring-1 focus:ring-[#D81B60]"
          >
            <option value="All">All Stock Levels</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock (≤15)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>
        </div>

        {/* Sale Status */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Pricing:</span>
          <select
            value={selectedSaleStatus}
            onChange={(e) => {
              setSelectedSaleStatus(e.target.value);
              const params = new URLSearchParams(window.location.search);
              params.delete('page');
              setSearchParams(params, { replace: true });
            }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:ring-1 focus:ring-[#D81B60]"
          >
            <option value="All">All Pricing Types</option>
            <option value="Sale">On Sale</option>
            <option value="Regular">Regular Price</option>
          </select>
        </div>

        {((selectedCategory !== 'All' && selectedCategory !== 'All Categories') ||
          (selectedSubcategory !== 'All' && selectedSubcategory !== 'All Subcategories') ||
          selectedStockStatus !== 'All' ||
          selectedSaleStatus !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Categories');
              setSelectedSubcategory('All Subcategories');
              setSelectedStockStatus('All');
              setSelectedSaleStatus('All');
              sessionStorage.removeItem('tohay_admin_filter_category');
              sessionStorage.removeItem('tohay_admin_filter_subcategory');
              sessionStorage.removeItem('tohay_admin_filter_stock');
              sessionStorage.removeItem('tohay_admin_filter_pricing');
              const params = new URLSearchParams();
              setSearchParams(params, { replace: true });
            }}
            className="text-[11px] font-extrabold text-[#D81B60] hover:underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={productColumns}
        data={filteredProducts}
        searchKey={(item, query) =>
          item.name.toLowerCase().includes(query) ||
          (item.id && item.id.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query)
        }
        searchPlaceholder="Search product by name, SKU, category..."
        bulkActions={bulkActionsList}
        emptyTitle="No Products Found"
        emptySub="Try relaxing your filters or add a new outfit to your store."
        onEmptyAction={() => navigate('/admin/catalog/add-product')}
      />

      {/* Product Detail Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setViewProduct(null)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-pink-50/50 via-white to-gray-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D81B60]/10 text-[#D81B60] flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-lg text-gray-900 line-clamp-1">
                    Product Specification & Details
                  </h2>
                  <p className="text-[11px] text-gray-500 font-semibold">
                    SKU / ID: <span className="font-mono text-gray-700 font-bold uppercase">{viewProduct.id || viewProduct._id}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewProduct(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Images */}
                <div className="md:col-span-5 space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner group">
                    <img
                      src={
                        (viewProduct.images && viewProduct.images[selectedImageIndex]) ||
                        viewProduct.images?.[0] ||
                        'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={viewProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {viewProduct.images && viewProduct.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {viewProduct.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                            selectedImageIndex === idx
                              ? 'border-[#D81B60] ring-2 ring-pink-100 scale-105'
                              : 'border-gray-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Product Specs & Details */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#D81B60] font-extrabold uppercase tracking-wider mb-1">
                      <span>{viewProduct.category}</span>
                      {viewProduct.subcategory && (
                        <>
                          <span>•</span>
                          <span>{viewProduct.subcategory}</span>
                        </>
                      )}
                      {viewProduct.collection && (
                        <>
                          <span>•</span>
                          <span className="text-gray-500">{viewProduct.collection}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-heading font-black text-gray-900 leading-snug">
                      {viewProduct.name}
                    </h3>
                  </div>

                  {/* Price & Stock Stats Card */}
                  <div className="bg-gradient-to-r from-pink-50/60 to-gray-50/60 p-4 rounded-2xl border border-pink-100/70 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Selling Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">
                          ₹{viewProduct.price?.toLocaleString('en-IN')}
                        </span>
                        {viewProduct.mrp && viewProduct.mrp > viewProduct.price && (
                          <>
                            <span className="text-xs text-gray-400 font-semibold line-through">
                              ₹{viewProduct.mrp?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {Math.round(((viewProduct.mrp - viewProduct.price) / viewProduct.mrp) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Stock Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge
                          status={
                            (viewProduct.stock ?? 10) <= 0
                              ? 'Out of Stock'
                              : (viewProduct.stock ?? 10) <= 15
                              ? 'Low Stock'
                              : 'In Stock'
                          }
                        />
                        <span className="text-xs font-black text-gray-700">
                          ({viewProduct.stock ?? 10} Units)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {viewProduct.fabric && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Fabric / Material</span>
                        <span className="font-extrabold text-gray-800">{viewProduct.fabric}</span>
                      </div>
                    )}
                    {viewProduct.occasion && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Occasion</span>
                        <span className="font-extrabold text-gray-800">{viewProduct.occasion}</span>
                      </div>
                    )}
                    {(viewProduct.ageRange || viewProduct.ageGroup) && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Age Group</span>
                        <span className="font-extrabold text-gray-800">{viewProduct.ageRange || viewProduct.ageGroup} Years</span>
                      </div>
                    )}
                    {viewProduct.rating !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Rating</span>
                        <span className="font-extrabold text-amber-600 flex items-center gap-1">
                          ★ {viewProduct.rating} ({viewProduct.reviewsCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Available Sizes */}
                  {viewProduct.sizes && viewProduct.sizes.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Available Sizes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {viewProduct.sizes.map((sz, idx) => {
                          const v = (viewProduct.sizeVariants || []).find((item) => item.size === sz);
                          return (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-white border border-gray-200 text-gray-800 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5"
                            >
                              <span>{sz}</span>
                              {v?.price ? <span className="text-[#D81B60] font-black font-mono">₹{v.price}</span> : null}
                              {v && (v.isAvailable === false || Number(v.stock) <= 0) && (
                                <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold">OOS</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Available Colors */}
                  {viewProduct.colors && viewProduct.colors.length > 0 && (
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Available Colors
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {viewProduct.colors.map((c, idx) => {
                          const cName = typeof c === 'string' ? c : c.name;
                          const cHex = typeof c === 'object' && c.hex ? c.hex : '#D81B60';
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl"
                            >
                              <span
                                className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: cHex }}
                              />
                              {cName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {(viewProduct.shortDescription || viewProduct.description) && (
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        Product Description
                      </span>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        {viewProduct.shortDescription || viewProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Care Instructions */}
                  {(viewProduct.care || viewProduct.careInstructions) && (
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                        Garment Care Instructions
                      </span>
                      <p className="text-xs text-gray-600 font-medium italic bg-pink-50/40 p-2.5 rounded-xl border border-pink-100/60">
                        {viewProduct.care || viewProduct.careInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <Link
                to={`/product/${viewProduct.id || viewProduct._id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#D81B60] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Storefront Preview</span>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewProduct(null)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to={`/admin/catalog/edit-product/${viewProduct.id || viewProduct._id}${window.location.search}`}
                  state={{ returnUrl: `/admin/catalog/products${window.location.search}` }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
