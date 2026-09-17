import React, { useState, useRef, useEffect } from 'react';
import { Camera, Edit, Save, Upload, Trash2, Plus, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p5 from '../../assets/p5.png';
import p6 from '../../assets/p6.png';
import p7 from '../../assets/p7.png';
import p8 from '../../assets/p8.png';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminInstagramSection() {
  const { bannersList, addBanner, updateBanner, showToast } = useAdmin();
  const fileInputRef = useRef(null);

  const placementKey = 'Homepage Instagram Gallery';
  const existingBanner = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === placementKey.toLowerCase());

  const defaultPhotos = [p1, p2, p3, p4, p5, p6, p7, p8];

  const [formState, setFormState] = useState({
    title: 'Little Moments.\nBig Memories.',
    subtitle: 'Follow us for styling inspiration, new launches & little celebrations.',
    link: 'https://instagram.com',
    btnText: 'FOLLOW US @TOHAYKIDS',
    photos: defaultPhotos,
    cardId: null
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (existingBanner) {
      const hasSavedPhotos = existingBanner.additionalImages && Array.isArray(existingBanner.additionalImages) && existingBanner.additionalImages.length > 0;
      setFormState((prev) => ({
        ...prev,
        title: existingBanner.title || prev.title,
        subtitle: existingBanner.subtitle || prev.subtitle,
        link: existingBanner.link || prev.link,
        btnText: existingBanner.btnPrimaryText || prev.btnText,
        photos: hasSavedPhotos ? existingBanner.additionalImages : prev.photos,
        cardId: existingBanner.id || existingBanner._id || null
      }));
    }
  }, [existingBanner?.id, existingBanner?.updatedAt, existingBanner?.additionalImages?.length]);

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      const newPhotoUrls = [];
      for (const file of files) {
        try {
          const res = await uploadService.uploadImage(file);
          if (res?.data?.url) {
            newPhotoUrls.push(res.data.url);
          } else {
            const dataUrl = await readFileAsDataURL(file);
            newPhotoUrls.push(dataUrl);
          }
        } catch (err) {
          const dataUrl = await readFileAsDataURL(file);
          newPhotoUrls.push(dataUrl);
        }
      }

      if (newPhotoUrls.length > 0) {
        setFormState((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotoUrls] }));
        showToast(`${newPhotoUrls.length} photo(s) added successfully!`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index) => {
    setFormState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    showToast('Photo removed from lookbook.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bannerPayload = {
      title: formState.title,
      subtitle: formState.subtitle,
      link: formState.link,
      btnPrimaryText: formState.btnText || 'FOLLOW US @TOHAYKIDS',
      image: formState.photos[0] || '',
      additionalImages: formState.photos,
      placement: placementKey,
      status: 'Active'
    };

    if (formState.cardId && formState.cardId !== 'undefined') {
      updateBanner(formState.cardId, bannerPayload);
    } else {
      addBanner(bannerPayload);
    }

    showToast('Instagram / Social Lookbook Section saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <Camera className="w-7 h-7 text-[#D81B60]" />
            Social & Lookbook Gallery Manager
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage "Little Moments. Big Memories." Instagram Lookbook section on the Homepage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Form & Gallery Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900">
              Content & Copywriting Settings
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Update Instagram title, description subtitle, and target social button link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                Section Headline Title
              </label>
              <textarea
                rows={2}
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                Subtitle Description
              </label>
              <input
                type="text"
                value={formState.subtitle}
                onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formState.btnText}
                  onChange={(e) => setFormState({ ...formState, btnText: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Instagram / Social Link
                </label>
                <input
                  type="text"
                  value={formState.link}
                  onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            {/* Gallery Upload Manager */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[11px] font-extrabold uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                  <span>Lookbook Photo Gallery ({formState.photos.length} Photos)</span>
                  {isUploading && <span className="text-pink-600 font-bold animate-pulse text-[10px]">Uploading...</span>}
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-pink-50 hover:bg-[#D81B60] text-[#D81B60] hover:text-white font-extrabold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Photo Files
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
              />

              {/* Photo Thumbnails Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {formState.photos.map((photo, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-pink-200 bg-gray-50 shadow-2xs"
                  >
                    <img
                      src={formatImageUrl(photo)}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer shadow-md"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] rounded-xl border-2 border-dashed border-pink-200 hover:border-[#D81B60] bg-pink-50/50 hover:bg-pink-50 flex flex-col items-center justify-center cursor-pointer transition-all text-center p-1"
                >
                  <Upload className="w-5 h-5 text-[#D81B60] mb-1" />
                  <span className="text-[10px] font-bold text-gray-700">Upload</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                Save Instagram Lookbook Section
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

            {/* Replica of Homepage Instagram Box */}
            <div className="bg-[#FFF0F5] rounded-3xl p-5 border border-pink-200/60 space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-normal text-gray-900 leading-tight whitespace-pre-line">
                  {formState.title || 'Little Moments.\nBig Memories.'}
                </h3>
                <p className="text-xs text-gray-600 font-normal leading-relaxed">
                  {formState.subtitle}
                </p>
                <div className="pt-1">
                  <span className="inline-block bg-[#D81B60] text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg shadow-2xs">
                    {formState.btnText || 'FOLLOW US @TOHAYKIDS'}
                  </span>
                </div>
              </div>

              {/* Photos Carousel Preview */}
              <div className="pt-2 border-t border-pink-200/50">
                <p className="text-[10px] font-extrabold uppercase text-pink-700 tracking-wider mb-2">
                  Carousel Photos ({formState.photos.length})
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {formState.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="w-16 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-pink-200 shadow-2xs bg-white"
                    >
                      <img
                        src={formatImageUrl(photo)}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-cover"
                      />
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
