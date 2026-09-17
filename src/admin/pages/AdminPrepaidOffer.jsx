import React, { useState, useRef, useEffect } from 'react';
import { Tag, Edit, Save, Upload, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { uploadService } from '../../services/uploadService';
import p8 from '../../assets/p8.png';
import { formatImageUrl } from '../../utils/imageUtils';

export default function AdminPrepaidOffer() {
  const { bannersList, addBanner, updateBanner, showToast } = useAdmin();
  const fileInputRef = useRef(null);

  const placementKey = 'Homepage Prepaid Offer';
  const existingBanner = (bannersList || []).find((b) => (b.placement || '').toLowerCase() === placementKey.toLowerCase());

  const [formState, setFormState] = useState({
    title: 'A Little Extra for Their Big Day',
    subtitle: 'Get 5% OFF on prepaid orders',
    couponCode: 'PREPAIDS',
    link: '/sale',
    hours: '05',
    mins: '12',
    secs: '34',
    image: '',
    cardId: null
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (existingBanner) {
      setFormState({
        title: existingBanner.title || 'A Little Extra for Their Big Day',
        subtitle: existingBanner.subtitle || 'Get 5% OFF on prepaid orders',
        couponCode: existingBanner.btnSecondaryText || 'PREPAIDS',
        link: existingBanner.link || '/sale',
        hours: existingBanner.description?.split(':')[0] || '05',
        mins: existingBanner.description?.split(':')[1] || '12',
        secs: existingBanner.description?.split(':')[2] || '34',
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
      btnSecondaryText: formState.couponCode,
      description: `${formState.hours || '05'}:${formState.mins || '12'}:${formState.secs || '34'}`,
      link: formState.link,
      btnPrimaryText: 'SHOP NOW',
      image: formState.image,
      placement: placementKey,
      status: 'Active'
    };

    if (formState.cardId && formState.cardId !== 'undefined') {
      updateBanner(formState.cardId, bannerPayload);
    } else {
      addBanner(bannerPayload);
    }

    showToast('Prepaid Offer & Timer section updated!');
  };

  const displayImg = (formState.image && !formState.image.includes('unsplash'))
    ? formatImageUrl(formState.image)
    : p8;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
            <Tag className="w-7 h-7 text-[#D81B60]" />
            Prepaid Offer & Timer Manager
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage "A Little Extra for Their Big Day" Prepaid Offer Banner & Countdown Timer on the Homepage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900">
              Offer Content & Timer Configuration
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Update offer title, discount subtitle, coupon code, target link, timer, and photo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                Offer Title
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
                Discount Subtitle
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
                  Coupon Code
                </label>
                <input
                  type="text"
                  placeholder="PREPAIDS"
                  value={formState.couponCode}
                  onChange={(e) => setFormState({ ...formState, couponCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-extrabold text-[#D81B60] mt-1 focus:bg-white focus:border-pink-500 outline-none uppercase"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Target Route Link
                </label>
                <input
                  type="text"
                  placeholder="/sale"
                  value={formState.link}
                  onChange={(e) => setFormState({ ...formState, link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-pink-500 outline-none"
                />
              </div>
            </div>

            {/* Countdown Timer Duration Controls */}
            <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
              <label className="text-[11px] font-extrabold uppercase text-[#D81B60] tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Countdown Timer Clock Settings
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500">HOURS</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formState.hours}
                    onChange={(e) => setFormState({ ...formState, hours: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold text-center mt-0.5 outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500">MINUTES</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formState.mins}
                    onChange={(e) => setFormState({ ...formState, mins: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold text-center mt-0.5 outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500">SECONDS</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formState.secs}
                    onChange={(e) => setFormState({ ...formState, secs: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-xs font-mono font-bold text-center mt-0.5 outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom Image File Upload */}
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider flex items-center justify-between">
                <span>Left Side Kids Photo File</span>
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
                  <div className="relative group/img w-full flex items-center justify-center gap-4">
                    <img
                      src={formatImageUrl(formState.image)}
                      alt="Preview"
                      className="w-16 h-16 rounded-2xl object-cover border border-pink-300 shadow-2xs group-hover/img:scale-105 transition-transform"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-[#D81B60]" />
                        Change Photo File
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Click to choose a new photo file from computer</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-gray-800">Click to Upload Custom Photo File</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#D81B60] text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-[#C2185B] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                Save Prepaid Offer & Timer
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

            {/* Exact Replica of Storefront Box 2 + Box 3 */}
            <div className="grid grid-cols-1 gap-4">
              {/* Kids Photo Preview */}
              <div className="rounded-2xl overflow-hidden shadow-2xs border border-pink-100 bg-pink-50 h-36">
                <img
                  src={displayImg}
                  alt="Kids Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Offer & Timer Box Preview */}
              <div className="bg-[#FFF0F4] p-5 rounded-3xl border border-pink-200/70 shadow-2xs space-y-3">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-normal text-gray-900 leading-tight">
                    {formState.title || 'A Little Extra for Their Big Day'}
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    {formState.subtitle}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block bg-white border border-pink-200 text-gray-800 font-bold text-xs px-3 py-1 rounded-md">
                      Use Code: <span className="text-[#D81B60] font-extrabold">{formState.couponCode || 'PREPAIDS'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-pink-200/60">
                  <div className="flex items-center gap-1.5 text-center">
                    <div className="bg-white/90 border border-pink-200 rounded-lg px-2 py-0.5 min-w-[32px]">
                      <span className="font-mono font-bold text-xs text-gray-900 block">{formState.hours || '05'}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-semibold">HOURS</span>
                    </div>
                    <span className="font-bold text-pink-400 text-xs">:</span>
                    <div className="bg-white/90 border border-pink-200 rounded-lg px-2 py-0.5 min-w-[32px]">
                      <span className="font-mono font-bold text-xs text-gray-900 block">{formState.mins || '12'}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-semibold">MINS</span>
                    </div>
                    <span className="font-bold text-pink-400 text-xs">:</span>
                    <div className="bg-white/90 border border-pink-200 rounded-lg px-2 py-0.5 min-w-[32px]">
                      <span className="font-mono font-bold text-xs text-gray-900 block">{formState.secs || '34'}</span>
                      <span className="text-[7px] text-gray-400 uppercase font-semibold">SECS</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-xs text-[#D81B60]">
                    SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
