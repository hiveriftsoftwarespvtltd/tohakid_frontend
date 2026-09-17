import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Layers, X, Filter, RotateCcw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { isSubcategoryMatch } from '../../utils/filterUtils';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

export default function AdminSubcategories() {
  const {
    categoriesList,
    productsList,
    updateCategory,
    openConfirmModal,
    showToast
  } = useAdmin();

  // Category Filter State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Subcategory Modal State
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subForm, setSubForm] = useState({
    id: '',
    name: '',
    parentCategory: 'Boys Collection',
    status: 'Active'
  });

  // 100% Dynamic Subcategories List derived from MongoDB Backend API (categoriesList)
  const subcategoriesList = useMemo(() => {
    const list = [];
    const set = new Set();

    if (Array.isArray(categoriesList)) {
      categoriesList.forEach((cat) => {
        const parentName = cat.name || 'General';
        if (Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((sub, idx) => {
            const subName = typeof sub === 'string' ? sub : sub?.name;
            if (subName) {
              const key = `${subName}-${parentName}`;
              if (!set.has(key)) {
                set.add(key);
                const count = (productsList || []).filter((p) =>
                  isSubcategoryMatch(subName, p.subcategory, p.name)
                ).length;

                list.push({
                  id: `sub-${cat.id || 'cat'}-${idx}-${subName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                  name: subName,
                  parentCategory: parentName,
                  parentCategoryId: cat.id,
                  productsCount: count,
                  status: cat.status || 'Active'
                });
              }
            }
          });
        }
      });
    }

    return list;
  }, [categoriesList, productsList]);

  // Filter Subcategories by Selected Main Category
  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryFilter || selectedCategoryFilter === 'All') {
      return subcategoriesList;
    }
    return subcategoriesList.filter((sub) => {
      const parent = (sub.parentCategory || '').toLowerCase();
      const selected = selectedCategoryFilter.toLowerCase();
      return parent === selected || parent.includes(selected) || selected.includes(parent);
    });
  }, [subcategoriesList, selectedCategoryFilter]);

  // Handlers
  const handleOpenAddSubModal = () => {
    setEditingSubcategory(null);
    setSubForm({
      id: '',
      name: '',
      parentCategory: categoriesList?.[0]?.name || 'Boys Collection',
      status: 'Active'
    });
    setShowSubcategoryModal(true);
  };

  const handleOpenEditSubModal = (subItem) => {
    setEditingSubcategory(subItem);
    setSubForm({
      id: subItem.id,
      name: subItem.name,
      parentCategory: subItem.parentCategory || 'Boys Collection',
      status: subItem.status || 'Active'
    });
    setShowSubcategoryModal(true);
  };

  // 100% Dynamic MongoDB Backend API submit for Create & Edit
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim()) {
      showToast('Please enter subcategory name.');
      return;
    }

    const trimmedName = subForm.name.trim();

    let parentCat = categoriesList.find(
      (c) => c.name === subForm.parentCategory || (c.name || '').toLowerCase().includes(subForm.parentCategory.toLowerCase())
    );

    if (!parentCat && categoriesList.length > 0) {
      parentCat = categoriesList[0];
    }

    if (parentCat) {
      let currentSubs = Array.isArray(parentCat.subcategories)
        ? parentCat.subcategories.map((s) => (typeof s === 'string' ? s : s?.name))
        : [];

      if (editingSubcategory) {
        // If parent category was changed during edit, clean up old parent
        if (editingSubcategory.parentCategoryId && editingSubcategory.parentCategoryId !== parentCat.id) {
          const oldParent = categoriesList.find((c) => c.id === editingSubcategory.parentCategoryId);
          if (oldParent) {
            const oldSubs = (oldParent.subcategories || []).filter(
              (s) => (typeof s === 'string' ? s : s?.name) !== editingSubcategory.name
            );
            await updateCategory(oldParent.id, { ...oldParent, subcategories: oldSubs });
          }
        }

        currentSubs = currentSubs.map((s) => (s === editingSubcategory.name ? trimmedName : s));
        if (!currentSubs.includes(trimmedName)) currentSubs.push(trimmedName);
      } else {
        // Add new subcategory
        if (!currentSubs.includes(trimmedName)) {
          currentSubs.push(trimmedName);
        }
      }

      await updateCategory(parentCat.id, { ...parentCat, subcategories: currentSubs });
      showToast(`Saved subcategory "${trimmedName}" to MongoDB database!`);
    }

    setShowSubcategoryModal(false);
  };

  // 100% Dynamic MongoDB Backend API Delete
  const handleDeleteSubcategory = async (subItem) => {
    const parentCat = categoriesList.find(
      (c) => c.id === subItem.parentCategoryId || c.name === subItem.parentCategory
    );

    if (parentCat) {
      const currentSubs = Array.isArray(parentCat.subcategories)
        ? parentCat.subcategories.map((s) => (typeof s === 'string' ? s : s?.name))
        : [];
      const updated = currentSubs.filter((s) => s !== subItem.name);
      await updateCategory(parentCat.id, { ...parentCat, subcategories: updated });
      showToast(`Deleted subcategory "${subItem.name}" from MongoDB database!`);
    }
  };

  // Columns for Subcategories Table
  const subcategoryColumns = [
    {
      key: 'name',
      label: 'Subcategory Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D81B60] shrink-0" />
          <span className="font-extrabold text-gray-900 text-xs">{row.name}</span>
        </div>
      )
    },
    {
      key: 'parentCategory',
      label: 'Parent Main Category',
      sortable: true,
      render: (row) => (
        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-extrabold border border-purple-100">
          {row.parentCategory}
        </span>
      )
    },
    {
      key: 'productsCount',
      label: 'Matching Outfits',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-gray-700 text-xs">{row.productsCount || 0} products</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || 'Active'} />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEditSubModal(row)}
            className="p-1.5 text-gray-400 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Subcategory"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              openConfirmModal({
                title: 'Delete Subcategory?',
                message: `Are you sure you want to delete subcategory "${row.name}" from ${row.parentCategory}?`,
                isDanger: true,
                confirmText: 'Delete Subcategory',
                onConfirm: () => handleDeleteSubcategory(row)
              });
            }}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Subcategory"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <Layers className="w-7 h-7 text-[#D81B60]" />
            Subcategories Management (Dynamic API)
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Create, edit, assign parent categories, and manage subcategories in MongoDB ({subcategoriesList.length})
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddSubModal}
          className="px-4 py-2 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Subcategory
        </button>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-pink-100/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D81B60]" />
          <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
            Filter by Main Category:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#D81B60] outline-none cursor-pointer"
          >
            <option value="All">All Main Categories ({subcategoriesList.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {selectedCategoryFilter !== 'All' && (
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Subcategories Table */}
      <DataTable
        columns={subcategoryColumns}
        data={filteredSubcategories}
        searchPlaceholder="Search subcategory name, parent category..."
        emptyTitle="No Subcategories Found"
        emptySub="Try changing the category filter or adding a new subcategory."
      />

      {/* Add / Edit Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowSubcategoryModal(false)} />
          <form
            onSubmit={handleSubcategorySubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D81B60]" />
                <span>{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSubcategoryModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Subcategory Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhoti Kurta Sets"
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Parent Main Category <span className="text-pink-600">*</span>
                </label>
                <select
                  value={subForm.parentCategory}
                  onChange={(e) => setSubForm({ ...subForm, parentCategory: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Status
                </label>
                <select
                  value={subForm.status}
                  onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 mt-1"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowSubcategoryModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#D81B60] text-white text-xs font-extrabold rounded-xl shadow-2xs hover:bg-[#C2185B] transition-colors cursor-pointer"
              >
                {editingSubcategory ? 'Save Changes' : 'Create Subcategory'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
