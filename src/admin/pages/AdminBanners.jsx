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
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);

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
    imageUrl: '',
    mobileImageUrl: '',
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
      mobileImageUrl: banner.mobileImageUrl || banner.mobileImage || '',
      startDate: banner.startDate || '2026-08-15',
      endDate: banner.endDate || '2026-10-31',
      status: banner.status || 'Active'
    });
    setShowBannerModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. INSTANT Preview (0ms): immediately display the chosen file to the user!
    const localUrl = URL.createObjectURL(file);
    setBannerForm((prev) => ({ ...prev, imageUrl: localUrl }));
    setIsUploading(true);

    // 2. Upload in background
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setBannerForm((prev) => ({ ...prev, imageUrl: res.data.url }));
        showToast('Desktop banner uploaded successfully!');
      } else {
        showToast('Desktop banner attached!');
      }
    } catch (err) {
      console.warn('Backend upload failed, kept preview:', err);
      showToast('Image attached locally!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMobileFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. INSTANT Preview (0ms): immediately display chosen mobile image!
    const localUrl = URL.createObjectURL(file);
    setBannerForm((prev) => ({ ...prev, mobileImageUrl: localUrl }));
    setIsUploadingMobile(true);

    // 2. Upload in background
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setBannerForm((prev) => ({ ...prev, mobileImageUrl: res.data.url }));
        showToast('Mobile banner uploaded successfully!');
      } else {
        showToast('Mobile banner attached!');
      }
    } catch (err) {
      console.warn('Backend upload failed, kept preview:', err);
      showToast('Mobile image attached locally!');
    } finally {
      setIsUploadingMobile(false);
    }
  };

  const handleRemoveDesktopImage = (e) => {
    e?.stopPropagation?.();
    setBannerForm((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveMobileImage = (e) => {
    e?.stopPropagation?.();
    setBannerForm((prev) => ({ ...prev, mobileImageUrl: '' }));
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
  };

  const handleBannerSubmit = (e) => {
    e.preventDefault();

    // 1. Guard check: Is upload still in progress?
    if (isUploading || isUploadingMobile) {
      showToast('Please wait! Image is currently uploading...');
      return;
    }

    if (!bannerForm.title.trim()) {
      showToast('Please enter banner title.');
      return;
    }

    const payload = {
      ...bannerForm,
      image: bannerForm.imageUrl || bannerForm.image || '',
      imageUrl: bannerForm.imageUrl || bannerForm.image || '',
      mobileImage: bannerForm.mobileImageUrl || '',
      mobileImageUrl: bannerForm.mobileImageUrl || ''
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
      label: 'Banners (Desktop / Mobile)',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="text-center shrink-0">
            <img
              src={formatImageUrl(row.imageUrl || row.image)}
              alt="Desktop Banner"
              className="w-20 h-10 rounded-lg object-cover border border-pink-100"
            />
            <span className="text-[9px] text-gray-500 font-bold block mt-0.5">Desktop</span>
          </div>
          {row.mobileImageUrl || row.mobileImage ? (
            <div className="text-center shrink-0">
              <img
                src={formatImageUrl(row.mobileImageUrl || row.mobileImage)}
                alt="Mobile Banner"
                className="w-10 h-10 rounded-lg object-cover border border-pink-300"
              />
              <span className="text-[9px] text-[#D81B60] font-bold block mt-0.5">Mobile</span>
            </div>
          ) : (
            <span className="text-[10px] text-gray-400 italic">No mobile img</span>
          )}
        </div>
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
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full z-10 shadow-2xl border border-pink-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900">
                  {editingBanner ? 'Edit Hero Banner' : 'Create Hero Banner'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Configure banner visuals, desktop & mobile assets, buttons and schedule
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Placement & Title Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Placement Page Slot
                  </label>
                  <select
                    value={bannerForm.placement}
                    onChange={(e) => setBannerForm({ ...bannerForm, placement: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold mt-1 focus:bg-white focus:border-pink-500 outline-none text-[#D81B60]"
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
                    placeholder="New Arrivals / Festive Glam Collection"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              {/* Subtitle & Description */}
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
              <div className="bg-pink-50/40 p-3.5 rounded-2xl border border-pink-100 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider block">
                  Call to Action Buttons (Fixed on Banner)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Primary Button Label</label>
                    <input
                      type="text"
                      placeholder="SHOP GIRLS"
                      value={bannerForm.btnPrimaryText}
                      onChange={(e) => setBannerForm({ ...bannerForm, btnPrimaryText: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-bold mt-0.5 outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Primary Button Link</label>
                    <input
                      type="text"
                      placeholder="/girls"
                      value={bannerForm.btnPrimaryLink}
                      onChange={(e) => setBannerForm({ ...bannerForm, btnPrimaryLink: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold mt-0.5 outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Secondary Button Label</label>
                    <input
                      type="text"
                      placeholder="SHOP BOYS"
                      value={bannerForm.btnSecondaryText}
                      onChange={(e) => setBannerForm({ ...bannerForm, btnSecondaryText: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold mt-0.5 outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600">Secondary Button Link</label>
                    <input
                      type="text"
                      placeholder="/boys"
                      value={bannerForm.btnSecondaryLink}
                      onChange={(e) => setBannerForm({ ...bannerForm, btnSecondaryLink: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold mt-0.5 outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hidden File Inputs for Desktop and Mobile */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={mobileFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMobileFileChange}
                className="hidden"
              />

              {/* Desktop & Mobile Banner Uploaders Side-by-Side (2-Column Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Desktop Banner Image Card */}
                <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200/70">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">🖥️</span>
                        <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
                          Desktop Banner
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        1920 × 600 px
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Laptops, desktops & large screens banner image.
                    </p>
                  </div>

                  {bannerForm.imageUrl ? (
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs">
                        <img
                          src={formatImageUrl(bannerForm.imageUrl)}
                          alt="Desktop Banner Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          {isUploading ? (
                            <span className="bg-black/75 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="bg-black/75 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
                              Uploaded ✓
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-1.5 px-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-gray-600" />
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveDesktopImage}
                          className="py-1.5 px-3 bg-white hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 border-2 border-dashed border-gray-300 hover:border-pink-500 rounded-xl bg-white hover:bg-pink-50/30 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 min-h-[120px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce text-[#D81B60]' : ''}`} />
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {isUploading ? 'Uploading Desktop Image...' : 'Click to Upload Desktop Banner'}
                      </span>
                      <span className="text-[9px] text-gray-400">JPG, PNG, WEBP (Max 5MB)</span>
                    </div>
                  )}
                </div>

                {/* 2. Mobile Banner Image Card */}
                <div className="bg-pink-50/40 p-3.5 rounded-2xl border border-pink-200/80 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-pink-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">📱</span>
                        <span className="text-xs font-extrabold text-[#D81B60] uppercase tracking-wide">
                          Mobile Banner
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#D81B60] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                        800 × 800 px
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Optimized for phones. Falls back to desktop if empty.
                    </p>
                  </div>

                  {bannerForm.mobileImageUrl ? (
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-pink-200 bg-white shadow-xs">
                        <img
                          src={formatImageUrl(bannerForm.mobileImageUrl)}
                          alt="Mobile Banner Preview"
                          className="w-full h-32 object-contain bg-gray-50 rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          {isUploadingMobile ? (
                            <span className="bg-black/75 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="bg-black/75 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs">
                              Uploaded ✓
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => mobileFileInputRef.current?.click()}
                          className="flex-1 py-1.5 px-3 bg-white hover:bg-pink-50 border border-pink-200 rounded-lg text-xs font-bold text-[#D81B60] transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#D81B60]" />
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveMobileImage}
                          className="py-1.5 px-3 bg-white hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-600 transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => mobileFileInputRef.current?.click()}
                      className="p-4 border-2 border-dashed border-pink-300 hover:border-pink-600 rounded-xl bg-white hover:bg-pink-50/50 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 min-h-[120px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-[#D81B60]">
                        <Upload className={`w-4 h-4 ${isUploadingMobile ? 'animate-bounce' : ''}`} />
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {isUploadingMobile ? 'Uploading Mobile Image...' : 'Click to Upload Mobile Banner'}
                      </span>
                      <span className="text-[9px] text-gray-400">JPG, PNG, WEBP (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Date, End Date & Status in 3 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bannerForm.startDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 outline-none focus:bg-white focus:border-pink-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 outline-none focus:bg-white focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Status
                  </label>
                  <select
                    value={bannerForm.status}
                    onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowBannerModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || isUploadingMobile}
                className={`flex-1 py-2.5 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 ${
                  isUploading || isUploadingMobile
                    ? 'bg-gray-400 text-white cursor-not-allowed opacity-80'
                    : 'bg-[#D81B60] text-white hover:bg-[#C2185B] cursor-pointer'
                }`}
              >
                {isUploading || isUploadingMobile ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading image... Please wait</span>
                  </>
                ) : (
                  editingBanner ? 'Save Changes' : 'Publish Banner'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
