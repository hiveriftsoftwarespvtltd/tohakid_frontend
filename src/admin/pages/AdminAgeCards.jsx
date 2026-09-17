import React, { useState, useRef } from 'react';
import { Edit, X, Upload, FolderTree } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import { formatImageUrl } from '../../utils/imageUtils';
import four4 from '../../assets/four4.png';
import five5 from '../../assets/five5.png';
import six6 from '../../assets/six6.png';

export default function AdminAgeCards() {
  const { bannersList, addBanner, updateBanner, showToast } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const defaultAgeSlots = [
    {
      slotKey: 'Shop By Age 0-8',
      name: '0–8 Years Card',
      badgeBg: 'bg-amber-100 text-amber-700',
      defaultTitle: '0–8 YEARS',
      defaultSubtitle: 'Cute & Comfortable',
      defaultBtn: 'SHOP 0–8 YEARS',
      defaultLink: '/shop-by-age?age=0-8',
      defaultImage: four4
    },
    {
      slotKey: 'Shop By Age 9-12',
      name: '9–12 Years Card',
      badgeBg: 'bg-pink-100 text-pink-700',
      defaultTitle: '9–12 YEARS',
      defaultSubtitle: 'Trendy & Festive',
      defaultBtn: 'SHOP 9–12 YEARS',
      defaultLink: '/shop-by-age?age=9-12',
      defaultImage: five5
    },
    {
      slotKey: 'Shop By Age 13-16',
      name: '13–16 Years Card',
      badgeBg: 'bg-purple-100 text-purple-700',
      defaultTitle: '13–16 YEARS',
      defaultSubtitle: 'Elegant & Graceful',
      defaultBtn: 'SHOP 13–16 YEARS',
      defaultLink: '/shop-by-age?age=13-16',
      defaultImage: six6
    }
  ];

  const initialForm = {
    title: '',
    subtitle: '',
    btnPrimaryText: '',
    btnPrimaryLink: '/shop-by-age',
    placement: 'Shop By Age 0-8',
    imageUrl: '',
    status: 'Active'
  };

  const [cardForm, setCardForm] = useState(initialForm);

  const getSavedBannerForSlot = (slotKey) => {
    return (bannersList || []).find(
      (b) => b.placement && b.placement.trim().toLowerCase() === slotKey.trim().toLowerCase()
    );
  };

  const handleOpenEditModal = (slot) => {
    const saved = getSavedBannerForSlot(slot.slotKey);
    setEditingCard({ slot, saved });
    setCardForm({
      title: saved?.title || slot.defaultTitle,
      subtitle: saved?.subtitle || slot.defaultSubtitle,
      btnPrimaryText: saved?.btnPrimaryText || slot.defaultBtn,
      btnPrimaryLink: saved?.btnPrimaryLink || saved?.link || slot.defaultLink,
      placement: slot.slotKey,
      imageUrl: (saved?.imageUrl && !saved.imageUrl.includes('unsplash')) ? saved.imageUrl : '',
      status: saved?.status || 'Active'
    });
    setShowModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setCardForm((prev) => ({ ...prev, imageUrl: res.data.url }));
        showToast('Age card image uploaded successfully!');
      } else {
        const localUrl = URL.createObjectURL(file);
        setCardForm((prev) => ({ ...prev, imageUrl: localUrl }));
        showToast('Age card image attached!');
      }
    } catch (err) {
      console.warn('Upload failed, using local preview:', err);
      const localUrl = URL.createObjectURL(file);
      setCardForm((prev) => ({ ...prev, imageUrl: localUrl }));
      showToast('Age card image attached!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardForm.title.trim()) {
      showToast('Please enter age card title.');
      return;
    }

    const payload = {
      ...cardForm,
      image: cardForm.imageUrl,
      imageUrl: cardForm.imageUrl,
      link: cardForm.btnPrimaryLink
    };

    const cardId = editingCard?.saved?.id || editingCard?.saved?._id;

    if (cardId && cardId !== 'undefined') {
      updateBanner(cardId, payload);
    } else {
      addBanner(payload);
    }

    setShowModal(false);
    setEditingCard(null);
  };

  const getEffectiveImage = (saved, slot) => {
    const raw = saved?.imageUrl || saved?.image;
    if (!raw || raw.includes('unsplash') || raw.includes('photo-1622290291468')) {
      return slot.defaultImage;
    }
    return formatImageUrl(raw) || slot.defaultImage;
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#D81B60]" />
            <span>Shop by Age Cards Manager</span>
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Manage the 3 Shop by Age promo cards (0-8Y, 9-12Y, 13-16Y) text, images, buttons and links
          </p>
        </div>
      </div>

      {/* 3 Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultAgeSlots.map((slot) => {
          const saved = getSavedBannerForSlot(slot.slotKey);

          const title = saved?.title || slot.defaultTitle;
          const subtitle = saved?.subtitle || slot.defaultSubtitle;
          const btn = saved?.btnPrimaryText || slot.defaultBtn;
          const link = saved?.btnPrimaryLink || saved?.link || slot.defaultLink;
          const image = getEffectiveImage(saved, slot);
          const isActive = (saved?.status || 'Active') === 'Active';

          return (
            <div
              key={slot.slotKey}
              className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${slot.badgeBg}`}>
                  {slot.name}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {isActive ? 'Active Live' : 'Inactive'}
                </span>
              </div>

              {/* Live Card Preview */}
              <div className="relative rounded-2xl overflow-hidden h-[300px] border border-gray-200 group">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 p-5 flex flex-col justify-start z-10 pointer-events-none">
                  <div className="w-[55%] space-y-1 pointer-events-auto">
                    <h3 className="font-heading text-2xl font-extrabold text-[#B8860B] drop-shadow-2xs">{title}</h3>
                    <p className="text-[11px] font-bold text-gray-900 leading-tight">{subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>Target Route:</span>
                  <span className="font-mono text-[#D81B60] font-bold">{link}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenEditModal(slot)}
                  className="w-full py-2.5 bg-gray-900 hover:bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Customize {slot.defaultTitle} Card</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showModal && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl border border-pink-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                Customize {editingCard.slot.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Age Card Title / Range
                </label>
                <input
                  type="text"
                  required
                  placeholder="0–8 YEARS / 9–12 YEARS"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Cute & Comfortable"
                  value={cardForm.subtitle}
                  onChange={(e) => setCardForm({ ...cardForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider">
                    Button Label Text
                  </label>
                  <input
                    type="text"
                    placeholder="SHOP 0–8 YEARS"
                    value={cardForm.btnPrimaryText}
                    onChange={(e) => setCardForm({ ...cardForm, btnPrimaryText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-bold mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider">
                    Target Route Path
                  </label>
                  <input
                    type="text"
                    placeholder="/shop-by-age?age=0-8"
                    value={cardForm.btnPrimaryLink}
                    onChange={(e) => setCardForm({ ...cardForm, btnPrimaryLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold mt-1 outline-none"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex justify-between items-center mb-1">
                  <span>Age Card Background Image</span>
                  <span className="text-[10px] text-pink-600 font-bold">Upload File or URL</span>
                </label>

                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 border-2 border-dashed border-pink-200 hover:border-pink-500 rounded-2xl bg-pink-50/40 hover:bg-pink-50/80 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className={`w-5 h-5 text-[#D81B60] ${isUploading ? 'animate-bounce' : ''}`} />
                    <span className="text-xs font-bold text-gray-800">
                      {isUploading ? 'Uploading Image to Server...' : 'Click to Upload Custom Image File'}
                    </span>
                    <span className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</span>
                  </div>

                  {/* Active Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-1">
                    <img
                      src={cardForm.imageUrl ? formatImageUrl(cardForm.imageUrl) : editingCard.slot.defaultImage}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {cardForm.imageUrl ? 'Custom Uploaded' : 'Storefront Default Fallback'}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Or enter Image URL (e.g. https://...)"
                    value={cardForm.imageUrl}
                    onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Status
                </label>
                <select
                  value={cardForm.status}
                  onChange={(e) => setCardForm({ ...cardForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                >
                  <option value="Active">Active Live</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] cursor-pointer"
              >
                Save Card Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
