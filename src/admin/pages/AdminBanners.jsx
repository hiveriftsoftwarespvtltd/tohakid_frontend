import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, Trash2, Edit, X, Upload } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminBanners() {
  const { bannersList, addBanner, updateBanner, deleteBanner, openConfirmModal, showToast } = useAdmin();
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const initialForm = {
    title: '',
    subtitle: '',
    description: '',
    btnPrimaryText: 'SHOP GIRLS',
    btnPrimaryLink: '/girls',
    btnSecondaryText: 'SHOP BOYS',
    btnSecondaryLink: '/boys',
    placement: 'Homepage Main Hero Carousel',
    link: '/collections',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
    startDate: '2026-08-15',
    endDate: '2026-10-31',
    status: 'Active'
  };

  const [bannerForm, setBannerForm] = useState(initialForm);

  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    setBannerForm(initialForm);
    setShowBannerModal(true);
  };

  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      btnPrimaryText: banner.btnPrimaryText || 'SHOP GIRLS',
      btnPrimaryLink: banner.btnPrimaryLink || banner.link || '/girls',
      btnSecondaryText: banner.btnSecondaryText || 'SHOP BOYS',
      btnSecondaryLink: banner.btnSecondaryLink || '/boys',
      placement: banner.placement || 'Homepage Main Hero Carousel',
      link: banner.link || '/collections',
      imageUrl: banner.imageUrl || banner.image || '',
      startDate: banner.startDate || '2026-08-15',
      endDate: banner.endDate || '2026-10-31',
      status: banner.status || 'Active'
    });
    setShowBannerModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setBannerForm((prev) => ({ ...prev, imageUrl: res.data.url }));
        showToast('Banner image uploaded successfully!');
      } else {
        const localUrl = URL.createObjectURL(file);
        setBannerForm((prev) => ({ ...prev, imageUrl: localUrl }));
        showToast('Banner image attached!');
      }
    } catch (err) {
      console.warn('Backend upload failed, using local preview:', err);
      const localUrl = URL.createObjectURL(file);
      setBannerForm((prev) => ({ ...prev, imageUrl: localUrl }));
      showToast('Banner image attached!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBannerSubmit = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      showToast('Please enter banner title.');
      return;
    }

    const payload = {
      ...bannerForm,
      image: bannerForm.imageUrl || bannerForm.image || '',
      imageUrl: bannerForm.imageUrl || bannerForm.image || ''
    };

    if (editingBanner) {
      const bannerId = editingBanner.id || editingBanner._id;
      updateBanner(bannerId, payload);
    } else {
      addBanner(payload);
    }

    setShowBannerModal(false);
    setEditingBanner(null);
  };

  const bannerColumns = [
    {
      key: 'imageUrl',
      label: 'Banner Preview',
      sortable: false,
      render: (row) => (
        <img
          src={formatImageUrl(row.imageUrl || row.image)}
          alt={row.title}
          className="w-24 h-12 rounded-xl object-cover border border-pink-100 shrink-0"
        />
      )
    },
    {
      key: 'title',
      label: 'Campaign Title & Link',
      render: (row) => (
        <div>
          <p className="font-extrabold text-gray-900">{row.title}</p>
          <p className="text-[10px] text-[#D81B60] font-mono font-bold">{row.link || row.btnPrimaryLink}</p>
        </div>
      )
    },
    {
      key: 'placement',
      label: 'Placement Section',
      render: (row) => (
        <span className="bg-pink-50 text-[#D81B60] font-bold text-xs px-2.5 py-1 rounded-lg">
          {row.placement}
        </span>
      )
    },
    {
      key: 'startDate',
      label: 'Duration',
      render: (row) => (
        <span className="text-xs text-gray-600 font-semibold">
          {row.startDate || '2026-08-15'} to {row.endDate || '2026-10-31'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status || 'Active'} />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleOpenEditModal(row)}
            className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Banner"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: 'Delete Banner?',
                message: `Remove promo banner "${row.title}"?`,
                isDanger: true,
                confirmText: 'Delete',
                onConfirm: () => deleteBanner(row.id || row._id)
              })
            }
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Banner"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Picker Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">Banners & Storefront Promotions</h1>
          <p className="text-xs text-gray-500 font-semibold">Manage homepage sliders, page hero sections, buttons, and promo graphics</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable
        columns={bannerColumns}
        data={bannersList}
        searchKey="title"
        searchPlaceholder="Search banner title..."
      />

      {/* Create / Edit Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowBannerModal(false)} />
          <form
            onSubmit={handleBannerSubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl border border-pink-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                {editingBanner ? 'Edit Hero Banner Content' : 'Create Hero Banner Content'}
              </h3>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Placement Page Slot
                </label>
                <select
                  value={bannerForm.placement}
                  onChange={(e) => setBannerForm({ ...bannerForm, placement: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1 focus:bg-white focus:border-pink-500 outline-none text-[#D81B60]"
                >
                  <option value="Homepage Main Hero Carousel">1. Homepage Main Hero Carousel</option>
                  <option value="Homepage Girls Card">2. Homepage Girls Card</option>
                  <option value="Homepage Boys Card">3. Homepage Boys Card</option>
                  <option value="Homepage Siblings Card">4. Homepage Siblings Card</option>
                  <option value="New Arrivals Hero Banner">5. New Arrivals Hero Banner</option>
                  <option value="Boys Category Top Banner">6. Boys Category Top Banner</option>
                  <option value="Girls Category Top Banner">7. Girls Category Top Banner</option>
                  <option value="Siblings Header Banner">8. Siblings Header Banner</option>
                  <option value="Shop By Age Hero Banner">9. Shop By Age Hero Banner</option>
                  <option value="Collections Hero Banner">10. Collections Hero Banner</option>
                  <option value="Sale & Offers Hero Banner">11. Sale & Offers Hero Banner</option>
                  <option value="About Us Hero Banner">12. About Us Hero Banner</option>
                  <option value="Contact Us Hero Banner">13. Contact Us Hero Banner</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Hero Title (Main Heading)
                </label>
                <input
                  type="text"
                  required
                  placeholder="New Arrivals / Festive Glam Kids Collection"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Subtitle (Line 1 Bold)
                  </label>
                  <input
                    type="text"
                    placeholder="Fresh Styles. Premium Craftsmanship."
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Description (Line 2 Text)
                  </label>
                  <input
                    type="text"
                    placeholder="Explore the latest festive additions..."
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              {/* Primary & Secondary Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="SHOP GIRLS"
                    value={bannerForm.btnPrimaryText}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnPrimaryText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-bold mt-1 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider">
                    Primary Button Link Path
                  </label>
                  <input
                    type="text"
                    placeholder="/girls"
                    value={bannerForm.btnPrimaryLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnPrimaryLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold mt-1 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="SHOP BOYS"
                    value={bannerForm.btnSecondaryText}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnSecondaryText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold mt-1 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">
                    Secondary Button Link Path
                  </label>
                  <input
                    type="text"
                    placeholder="/boys"
                    value={bannerForm.btnSecondaryLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnSecondaryLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold mt-1 outline-none"
                  />
                </div>
              </div>

              {/* Banner Image File Upload & Preview */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex justify-between items-center mb-1">
                  <span>Banner Image File</span>
                  <span className="text-[10px] text-pink-600 font-bold">Upload File or Enter URL</span>
                </label>

                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-pink-200 hover:border-pink-500 rounded-2xl bg-pink-50/40 hover:bg-pink-50/80 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className={`w-5 h-5 text-[#D81B60] ${isUploading ? 'animate-bounce' : ''}`} />
                    <span className="text-xs font-bold text-gray-800">
                      {isUploading ? 'Uploading Image to Server...' : 'Click to Upload Image File'}
                    </span>
                    <span className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</span>
                  </div>

                  {bannerForm.imageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-1">
                      <img
                        src={formatImageUrl(bannerForm.imageUrl)}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Or enter Image URL (e.g. https://...)"
                    value={bannerForm.imageUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bannerForm.startDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bannerForm.endDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Status
                </label>
                <select
                  value={bannerForm.status}
                  onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] cursor-pointer"
              >
                {editingBanner ? 'Save Changes' : 'Publish Banner'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
