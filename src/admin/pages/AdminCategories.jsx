import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, FolderTree, Image as ImageIcon, X, Upload } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p5 from '../../assets/p5.png';
import p6 from '../../assets/p6.png';
import p7 from '../../assets/p7.png';
import p8 from '../../assets/p8.png';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminCategories() {
  const {
    categoriesList,
    productsList,
    addCategory,
    updateCategory,
    deleteCategory,
    openConfirmModal,
    showToast
  } = useAdmin();

  // Main Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'Active'
  });

  const resolveCategoryImage = (cat) => {
    const raw = typeof cat === 'object' ? (cat?.image || cat?.imageUrl) : cat;
    if (
      raw &&
      typeof raw === 'string' &&
      raw.trim() !== '' &&
      !raw.includes('unsplash') &&
      !raw.includes('photo-')
    ) {
      return formatImageUrl(raw);
    }
    if (raw && typeof raw !== 'string') {
      return raw;
    }
    const name = (typeof cat === 'object' ? (cat?.name || '') : String(cat || '')).toLowerCase();
    if (name.includes('lehenga')) return p1;
    if (name.includes('kurta')) return p4;
    if (name.includes('sharara')) return p6;
    if (name.includes('anarkali')) return p5;
    if (name.includes('gown')) return p3;
    if (name.includes('jacket')) return p7;
    if (name.includes('sibling')) return p8;
    if (name.includes('dress')) return p2;
    if (name.includes('boy')) return p4;
    return p1;
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      status: 'Active'
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name || '',
      slug: cat.slug || (cat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: cat.description || '',
      image: cat.image || '',
      status: cat.status || 'Active'
    });
    setShowCategoryModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setCatForm((prev) => ({ ...prev, image: res.data.url }));
        showToast('Image uploaded successfully!');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCatForm((prev) => ({ ...prev, image: reader.result }));
          showToast('Image selected!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCatForm((prev) => ({ ...prev, image: reader.result }));
        showToast('Image selected!');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showToast('Please enter category name.');
      return;
    }

    const payload = {
      ...catForm,
      slug: catForm.slug || catForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
    } else {
      addCategory(payload);
    }
    setShowCategoryModal(false);
  };

  // Pure Columns for Main Categories Table
  const categoryColumns = [
    {
      key: 'image',
      label: 'Thumbnail',
      sortable: false,
      render: (row) => (
        <img
          src={resolveCategoryImage(row)}
          alt={row.name}
          className="w-12 h-12 rounded-xl object-cover border border-pink-100 shrink-0"
        />
      )
    },
    {
      key: 'name',
      label: 'Category Name & Slug',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-extrabold text-gray-900 text-xs">{row.name}</p>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            /{row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
          </p>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (row) => (
        <p className="text-xs text-gray-500 font-medium max-w-xs line-clamp-1">
          {row.description || 'Main store category listing'}
        </p>
      )
    },
    {
      key: 'productsCount',
      label: 'Total Products',
      sortable: true,
      render: (row) => {
        const count = (productsList || []).filter((p) =>
          p.category === row.name || (p.category && row.name.toLowerCase().includes(p.category.toLowerCase()))
        ).length || row.productsCount || 0;
        return <span className="font-extrabold text-gray-800 text-xs">{count} items</span>;
      }
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
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-gray-400 hover:text-[#D81B60] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              openConfirmModal({
                title: 'Delete Category',
                message: `Are you sure you want to delete main category "${row.name}"? This action cannot be undone.`,
                isDanger: true,
                confirmText: 'Delete Category',
                onConfirm: () => deleteCategory(row.id)
              });
            }}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-[#D81B60]" />
            Main Categories Management
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Create, edit, and manage primary store categories ({categoriesList.length})
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Main Categories Table */}
      <DataTable
        columns={categoryColumns}
        data={categoriesList}
        searchPlaceholder="Search main category name, slug..."
        emptyTitle="No Main Categories Found"
        emptySub="Get started by creating a main category for your store."
      />

      {/* Add / Edit Main Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowCategoryModal(false)} />
          <form
            onSubmit={handleCategorySubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                {editingCategory ? 'Edit Main Category' : 'Add New Main Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Category Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Boys Collection"
                  value={catForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCatForm({
                      ...catForm,
                      name,
                      slug: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. boys-collection"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description for category cards and banner headers..."
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex items-center justify-between">
                  <span>Category Banner Image</span>
                  {isUploading && <span className="text-[#D81B60] font-bold animate-pulse text-[10px]">Uploading...</span>}
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-pink-200 hover:border-[#D81B60] bg-pink-50/40 hover:bg-pink-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  {catForm.image ? (
                    <div className="relative group/img w-full flex items-center justify-center gap-3">
                      <img
                        src={catForm.image}
                        alt="Preview"
                        className="w-14 h-14 rounded-2xl object-cover border border-pink-300 shadow-2xs group-hover/img:scale-105 transition-transform"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-[#D81B60]" />
                          Change Image File
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Click to choose photo file from computer</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">Click to Upload Custom Image File</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">PNG, JPG, WEBP from computer</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Status
                </label>
                <select
                  value={catForm.status}
                  onChange={(e) => setCatForm({ ...catForm, status: e.target.value })}
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
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#D81B60] text-white text-xs font-extrabold rounded-xl shadow-2xs hover:bg-[#C2185B] transition-colors cursor-pointer"
              >
                {editingCategory ? 'Save Changes' : 'Create Main Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
