import React, { useState, useRef } from 'react';
import { Sparkles, Edit, Save, ArrowRight, FolderTree, Upload, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { usePageBanner } from '../../utils/usePageBanner';
import { uploadService } from '../../services/uploadService';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p6 from '../../assets/p6.png';
import p7 from '../../assets/p7.png';
import p8 from '../../assets/p8.png';
import five5 from '../../assets/five5.png';
import celebration from '../../assets/celebration.png';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminCollectionCards() {
  const { bannersList, addBanner, updateBanner, showToast } = useAdmin();

  // 1. The 8 Collection Cards Configuration
  const initialCollectionSlots = [
    { key: 'festive', placement: 'Collection Festive', defaultTitle: 'Festive Collection', defaultSubtitle: 'Celebrate traditions in style', defaultLink: '/girls?subcategory=Lehenga+Choli', defaultImg: p1 },
    { key: 'wedding', placement: 'Collection Wedding', defaultTitle: 'Wedding Collection', defaultSubtitle: 'Made for the big celebrations', defaultLink: '/boys?subcategory=Sherwani+Sets', defaultImg: p4 },
    { key: 'party', placement: 'Collection Party', defaultTitle: 'Party Collection', defaultSubtitle: 'Perfect for birthdays & parties', defaultLink: '/girls?subcategory=Party+Gowns', defaultImg: p2 },
    { key: 'sibling', placement: 'Collection Sibling', defaultTitle: 'Sibling Collection', defaultSubtitle: 'Matching styles, made for love', defaultLink: '/siblings', defaultImg: p8 },
    { key: 'indowestern', placement: 'Collection Indo Western', defaultTitle: 'Indo Western Collection', defaultSubtitle: 'Fusion styles for modern kids', defaultLink: '/boys?subcategory=Indo+Western', defaultImg: p7 },
    { key: 'sharara', placement: 'Collection Sharara', defaultTitle: 'Sharara Collection', defaultSubtitle: 'Graceful, flowy & stylish', defaultLink: '/girls?subcategory=Sharara+Sets', defaultImg: p6 },
    { key: 'kurtasets', placement: 'Collection Kurta Sets', defaultTitle: 'Kurta Sets Collection', defaultSubtitle: 'Comfortable & classic styles', defaultLink: '/boys?subcategory=Kurta+Sets', defaultImg: five5 },
    { key: 'anarkali', placement: 'Collection Anarkali', defaultTitle: 'Anarkali Collection', defaultSubtitle: 'Timeless elegance for every girl', defaultLink: '/girls?subcategory=Anarkali+Suits', defaultImg: p3 },
  ];

  // 2. Bottom Promo Banner Configuration
  const bottomBannerSlot = {
    placement: 'Collection Festive Edit Banner',
    defaultTitle: 'The Festive Edit',
    defaultSubtitle: 'New designs. New celebrations.',
    defaultLink: '/new-arrivals',
    defaultBtnText: 'EXPLORE NOW',
    defaultImg: celebration
  };

  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'bottom-banner'
  const [editingSlot, setEditingSlot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    title: '',
    subtitle: '',
    link: '',
    btnText: '',
    image: '',
    cardId: null
  });

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    const existing = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === slot.placement.toLowerCase());
    setFormState({
      title: existing?.title || slot.defaultTitle,
      subtitle: existing?.subtitle || slot.defaultSubtitle,
      link: existing?.link || slot.defaultLink,
      btnText: existing?.btnPrimaryText || slot.defaultBtnText || 'SHOP NOW',
      image: existing?.image || existing?.imageUrl || '',
      cardId: existing?.id || existing?._id || null
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res?.data?.url) {
        setFormState((prev) => ({ ...prev, image: res.data.url }));
        showToast('Image uploaded successfully!');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormState((prev) => ({ ...prev, image: reader.result }));
          showToast('Image selected!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, image: reader.result }));
        showToast('Image selected!');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    const bannerPayload = {
      title: formState.title,
      subtitle: formState.subtitle,
      link: formState.link,
      btnPrimaryText: formState.btnText || 'SHOP NOW',
      image: formState.image,
      placement: editingSlot.placement,
      status: 'Active'
    };

    if (formState.cardId && formState.cardId !== 'undefined') {
      updateBanner(formState.cardId, bannerPayload);
    } else {
      addBanner(bannerPayload);
    }

    setEditingSlot(null);
    showToast(`"${formState.title}" card saved!`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <FolderTree className="w-7 h-7 text-[#D81B60]" />
            Shop by Collection Manager
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage the 8 Curated Collection Cards & Bottom Promo Banner on /collections storefront page
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cards' ? 'bg-[#D81B60] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            8 Collection Cards
          </button>
          <button
            onClick={() => setActiveTab('bottom-banner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bottom-banner' ? 'bg-[#D81B60] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bottom Festive Banner
          </button>
        </div>
      </div>

      {/* Tab 1: 8 Collection Cards Grid */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {initialCollectionSlots.map((slot) => {
            const live = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === slot.placement.toLowerCase());
            const displayTitle = live?.title || slot.defaultTitle;
            const displaySubtitle = live?.subtitle || slot.defaultSubtitle;
            const displayLink = live?.link || slot.defaultLink;
            const rawImg = live?.image || live?.imageUrl;
            const displayImg = (rawImg && !rawImg.includes('unsplash')) ? formatImageUrl(rawImg) : slot.defaultImg;

            return (
              <div
                key={slot.key}
                className="bg-white rounded-3xl p-4 border border-pink-100 shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Thumbnail */}
                  <div className="w-full aspect-[3.5/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                    <img
                      src={displayImg}
                      alt={displayTitle}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#D81B60] font-extrabold text-[10px] rounded-full shadow-2xs uppercase">
                      {slot.key}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-heading font-extrabold text-base text-gray-900">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-1">
                      {displaySubtitle}
                    </p>
                    <p className="text-[10px] text-pink-600 font-mono truncate pt-0.5">
                      {displayLink}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(slot)}
                  className="w-full py-2.5 bg-pink-50 hover:bg-[#D81B60] text-[#D81B60] hover:text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Collection Card
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Bottom Festive Edit Banner */}
      {activeTab === 'bottom-banner' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xs space-y-6 max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Bottom Festive Edit Banner Manager
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Controls the large promotional banner at the bottom of /collections storefront page
              </p>
            </div>
            <button
              onClick={() => handleOpenEdit(bottomBannerSlot)}
              className="px-5 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl hover:bg-[#C2185B] flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Edit className="w-4 h-4" />
              Edit Bottom Banner
            </button>
          </div>

          {/* Live Preview */}
          {(() => {
            const live = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === bottomBannerSlot.placement.toLowerCase());
            const displayTitle = live?.title || bottomBannerSlot.defaultTitle;
            const displaySubtitle = live?.subtitle || bottomBannerSlot.defaultSubtitle;
            const displayLink = live?.link || bottomBannerSlot.defaultLink;
            const displayBtnText = live?.btnPrimaryText || bottomBannerSlot.defaultBtnText;
            const rawImg = live?.image || live?.imageUrl;
            const displayImg = (rawImg && !rawImg.includes('unsplash')) ? formatImageUrl(rawImg) : bottomBannerSlot.defaultImg;

            return (
              <div className="relative rounded-3xl overflow-hidden border border-pink-200 shadow-sm min-h-[260px] flex items-center bg-[#FFF0F5]">
                <img
                  src={displayImg}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F5] via-[#FFF0F5]/95 to-transparent w-full md:w-3/5" />

                <div className="relative z-10 p-6 sm:p-8 max-w-xl space-y-3">
                  <span className="bg-pink-100 text-[#D81B60] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Live Banner Preview
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D81B60]">
                    {displayTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {displaySubtitle}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block bg-[#D81B60] text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg shadow-2xs">
                      {displayBtnText}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setEditingSlot(null)} />
          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-extrabold text-lg text-gray-900">
                Edit {editingSlot.placement}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Card Title
                </label>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formState.subtitle}
                  onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Target Route Link
                </label>
                <input
                  type="text"
                  value={formState.link}
                  onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              {/* Custom Image File Upload */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex items-center justify-between">
                  <span>Card / Banner Image</span>
                  {isUploading && <span className="text-pink-600 font-bold animate-pulse text-[10px]">Uploading...</span>}
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
                  {formState.image ? (
                    <div className="relative group/img w-full flex items-center justify-center gap-3">
                      <img
                        src={formatImageUrl(formState.image)}
                        alt="Preview"
                        className="w-14 h-14 rounded-2xl object-cover border border-pink-300 shadow-2xs group-hover/img:scale-105 transition-transform"
                      />
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-[#D81B60]" />
                          Change Image File
                        </p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Click to choose a new photo file from computer</p>
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

                <div className="mt-2">
                  <label className="text-[10px] font-bold text-gray-400">Or Paste Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formState.image}
                    onChange={(e) => setFormState({ ...formState, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium mt-0.5 focus:bg-white focus:border-pink-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
