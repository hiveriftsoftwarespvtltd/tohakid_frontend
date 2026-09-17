import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Edit, Save, Upload, CheckCircle, Package } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import celebration from '../../assets/celebration.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p5 from '../../assets/p5.png';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminCelebrationEdit() {
  const { bannersList, productsList, addBanner, updateBanner, showToast } = useAdmin();
  const fileInputRef = useRef(null);

  const placementKey = 'Homepage Celebration Edit';
  const existingBanner = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === placementKey.toLowerCase());

  const [formState, setFormState] = useState({
    title: 'The Celebration Edit',
    subtitle: 'Handpicked ethnic styles designed for weddings, festivals and special moments.',
    link: '/collections',
    btnText: 'SHOP THE COLLECTION',
    image: '',
    cardId: null
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (existingBanner) {
      setFormState({
        title: existingBanner.title || 'The Celebration Edit',
        subtitle: existingBanner.subtitle || 'Handpicked ethnic styles designed for weddings, festivals and special moments.',
        link: existingBanner.link || '/collections',
        btnText: existingBanner.btnPrimaryText || 'SHOP THE COLLECTION',
        image: existingBanner.image || existingBanner.imageUrl || '',
        cardId: existingBanner.id || existingBanner._id || null
      });
    }
  }, [bannersList]);

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

    const bannerPayload = {
      title: formState.title,
      subtitle: formState.subtitle,
      link: formState.link,
      btnPrimaryText: formState.btnText || 'SHOP THE COLLECTION',
      image: formState.image,
      placement: placementKey,
      status: 'Active'
    };

    if (formState.cardId && formState.cardId !== 'undefined') {
      updateBanner(formState.cardId, bannerPayload);
    } else {
      addBanner(bannerPayload);
    }

    showToast('Celebration Edit Banner updated successfully!');
  };

  const sampleProducts = (productsList && productsList.length >= 3)
    ? productsList.slice(0, 3)
    : [
        { id: 'p1', name: 'Lavender Lehenga', price: 2599, image: p3 },
        { id: 'p2', name: 'Royal Kurta Pyjama', price: 2299, image: p4 },
        { id: 'p3', name: 'Mint Green Anarkali', price: 2399, image: p5 }
      ];

  const displayBannerImg = (formState.image && !formState.image.includes('unsplash'))
    ? formatImageUrl(formState.image)
    : celebration;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#D81B60]" />
            Celebration Edit Manager
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage "The Celebration Edit" promo section on the Homepage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900">
              Banner Content & Media Settings
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Update headline text, subtitle, action button, and custom left image file
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                Section Headline Title
              </label>
              <input
                type="text"
                placeholder="e.g. The Celebration Edit"
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                Subtitle Description
              </label>
              <textarea
                rows={3}
                placeholder="Handpicked ethnic styles designed for weddings..."
                value={formState.subtitle}
                onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Button Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. SHOP THE COLLECTION"
                  value={formState.btnText}
                  onChange={(e) => setFormState({ ...formState, btnText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Button Target Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. /collections"
                  value={formState.link}
                  onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            {/* Custom Image File Upload */}
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex items-center justify-between">
                <span>Left Side Banner Image</span>
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
                className="mt-1 border-2 border-dashed border-pink-200 hover:border-[#D81B60] bg-pink-50/40 hover:bg-pink-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                {formState.image ? (
                  <div className="relative group/img w-full flex items-center justify-center gap-4">
                    <img
                      src={formatImageUrl(formState.image)}
                      alt="Preview"
                      className="w-20 h-20 rounded-2xl object-cover border border-pink-300 shadow-2xs group-hover/img:scale-105 transition-transform"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-[#D81B60]" />
                        Change Banner Image File
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Click to select a new image file from computer</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">Click to Upload Custom Image File</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
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

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                Save Celebration Edit Changes
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Live Storefront Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="bg-pink-100 text-[#D81B60] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Live Storefront Card Preview
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>

            {/* Exact Replica of Storefront Box */}
            <div className="bg-[#FFF0F4] rounded-3xl border border-pink-200/60 p-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Left Side Image */}
                <div className="w-28 h-32 rounded-2xl overflow-hidden shadow-xs border border-pink-100 shrink-0 bg-white">
                  <img
                    src={displayBannerImg}
                    alt={formState.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Center Content */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-normal text-gray-900 leading-tight">
                    {formState.title || 'The Celebration Edit'}
                  </h3>
                  <p className="text-[11px] text-gray-600 font-normal line-clamp-2 leading-relaxed">
                    {formState.subtitle}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block bg-[#D81B60] text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow-2xs">
                      {formState.btnText || 'SHOP THE COLLECTION'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side 3 Showcase Mini Products */}
              <div className="pt-2 border-t border-pink-200/40">
                <p className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider mb-2">
                  Showcase Featured Products (3 Cards)
                </p>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {sampleProducts.map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="w-20 bg-white/90 rounded-xl border border-pink-100 p-1.5 text-center shadow-2xs shrink-0"
                    >
                      <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1 bg-pink-50">
                        <img
                          src={formatImageUrl((p.images && p.images[0]) || p.image || p3)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-heading font-extrabold text-[10px] text-gray-900">
                        ₹ {p.price?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
