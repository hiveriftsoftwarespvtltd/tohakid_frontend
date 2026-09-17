import React, { useState, useRef } from 'react';
import {
  X, Plus, Image as ImageIcon, Sparkles, Check, Package, IndianRupee, Tag,
  Info, Globe, Warehouse, Upload, Layers, FolderPlus, Zap
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAdmin } from '../context/AdminContext';
import { compressImage, compressImageToFile } from '../../utils/imageCompressor';
import { uploadService } from '../../services/uploadService';

export default function AdminAddProductModal({ isOpen, onClose }) {
  const { addProduct, categoriesList } = useAdmin();
  const fileInputRef = useRef(null);


  const [formData, setFormData] = useState({
    name: '',
    sku: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    shortDescription: '',
    description: '',
    category: 'Girls',
    subcategory: 'Lehenga Choli',
    collectionName: 'Festive Collection',
    ageRange: '0-8',
    price: '',
    mrp: '',
    costPrice: '',
    stock: '25',
    lowStockThreshold: 5,
    fabric: 'Pure Silk Blend & Chiffon Dupatta',
    care: 'Dry Clean Only. Steam Iron on Low.',
    occasion: 'Festive',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    isNew: true,
    isTrending: false,
    isBestseller: false,
    isSale: true,
    isDealOfTheDay: false,
  });

  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([
    { name: 'Royal Pink', hex: '#EC4899' },
    { name: 'Festive Gold', hex: '#EAB308' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D81B60');

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableSizeOptions = [
    '0-1Y', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y',
    '8-9Y', '9-10Y', '10-11Y', '11-12Y', '12-13Y', '13-14Y', '14-15Y', '15-16Y',
    '0-2Y', '2-4Y', '4-6Y', '6-8Y', '8-10Y', '10-12Y', '12-14Y', '14-16Y',
    'Free Size', 'S', 'M', 'L', 'XL'
  ];

  const handleNameChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      metaTitle: val ? `${val} | Tohay Kids` : ''
    }));
  };

  const handleSizeToggle = (sizeOption) => {
    if (sizes.includes(sizeOption)) {
      setSizes(sizes.filter((s) => s !== sizeOption));
    } else {
      setSizes([...sizes, sizeOption]);
    }
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
    }
  };

  const handleRemoveColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleLocalFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const fileToUpload = await compressImageToFile(file, 1000, 1200, 0.8);

        let uploadedUrl = null;
        try {
          const res = await uploadService.uploadImage(fileToUpload);
          uploadedUrl = res?.data?.url || res?.url;
        } catch (err) {
          console.warn('Backend upload fallback:', err);
        }

        if (!uploadedUrl) {
          uploadedUrl = await compressImage(file, 600, 800, 0.6);
        }

        if (uploadedUrl) {
          setImages((prev) => [...prev, uploadedUrl]);
        }
      } catch (err) {}
    }

    if (e.target) e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setImages([...images, randomSample]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.mrp) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields Missing',
        text: 'Please enter Product Name, Selling Price, and MRP.',
        confirmButtonColor: '#D81B60',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku || `TH-${Math.floor(100 + Math.random() * 900)}`,
        category: formData.category,
        subcategory: formData.subcategory,
        collectionName: formData.collectionName,
        ageRange: formData.ageRange,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        costPrice: Number(formData.costPrice) || Math.round(Number(formData.price) * 0.5),
        stock: Number(formData.stock) || 15,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
        sizes: sizes.length > 0 ? sizes : [],
        colors: colors.length > 0 ? colors : [{ name: 'Multicolor', hex: '#FF0066' }],
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80'],
        fabric: formData.fabric,
        care: formData.care,
        occasion: formData.occasion,
        shortDescription: formData.shortDescription,
        description: formData.description,
        metaTitle: formData.metaTitle || `${formData.name} | Tohay Kids`,
        metaDescription: formData.metaDescription || formData.shortDescription,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        isNew: Boolean(formData.isNew),
        isTrending: Boolean(formData.isTrending),
        isBestseller: Boolean(formData.isBestseller),
        isSale: Boolean(formData.isSale),
      };

      await addProduct(payload);

      await Swal.fire({
        icon: 'success',
        title: 'Product Published!',
        text: `"${formData.name}" has been added to your live catalog.`,
        timer: 1800,
        showConfirmButton: false,
      });

      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Product',
        text: err.message || 'An error occurred while saving product.',
        confirmButtonColor: '#D81B60',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sellingPrice = Number(formData.price) || 0;
  const costPriceVal = Number(formData.costPrice) || 0;
  const estimatedProfit = Math.max(0, sellingPrice - costPriceVal);
  const profitMarginPercent = sellingPrice > 0 ? Math.round((estimatedProfit / sellingPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:py-6 overflow-y-auto">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-4xl w-full max-h-[92vh] overflow-y-auto z-10 p-5 sm:p-8 space-y-6 animate-fade-in my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 text-[#D81B60] rounded-2xl border border-pink-100">
              <Package className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-gray-900">
                Add New Outfit Product
              </h2>
              <p className="text-xs text-gray-500 font-semibold">
                Complete product specifications, pricing, sizes, gallery & SEO
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D81B60]" />
              <span>1. Basic Product Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Product Name / Title <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Floral Orange Lehenga Choli With Dupatta"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    SKU Code / Identifier
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, sku: `TH-${Math.floor(1000 + Math.random() * 9000)}` }))}
                    className="text-[10px] text-[#D81B60] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    ⚡ Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. TH-101"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono font-bold text-gray-800 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Occasion / Event
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                >
                  <option value="Festive">Festive</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party Wear</option>
                  <option value="Casual">Casual Ethnic</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Short Highlight Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Summary snippet for product cards and fast previews..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Strategy & Profit Margin */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#D81B60]" />
              <span>2. Pricing Strategy & Profit Margin</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Selling Price (₹) <span className="text-pink-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2352"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  MRP Price (₹) <span className="text-pink-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  placeholder="3299"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="1200"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Profit Margin Box */}
            <div className="bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100 flex items-center justify-between text-xs font-bold text-gray-800">
              <span>Estimated Profit Margin:</span>
              <span className="text-emerald-700 font-extrabold">
                ₹{estimatedProfit.toLocaleString('en-IN')} ({profitMarginPercent}% Profit Margin)
              </span>
            </div>
          </div>

          {/* Section 3: Organization & Categories */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D81B60]" />
              <span>3. Organization & Categories</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Main Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const catObj = (categoriesList || []).find((c) => c.name === newCat);
                    const subs = (catObj?.subcategories || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
                    setFormData({
                      ...formData,
                      category: newCat,
                      subcategory: subs[0] || ''
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                >
                  {(categoriesList || []).map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                >
                  {(() => {
                    const catObj = (categoriesList || []).find(
                      (c) =>
                        c.name === formData.category ||
                        (c.name || '').toLowerCase() === (formData.category || '').toLowerCase() ||
                        (c.name || '').toLowerCase().includes((formData.category || '').toLowerCase()) ||
                        (formData.category || '').toLowerCase().includes((c.name || '').toLowerCase())
                    );
                    const subs = (catObj?.subcategories || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);

                    if (subs.length === 0) {
                      return <option value="">No subcategories available</option>;
                    }

                    return subs.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Fabric & Size Attributes */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D81B60]" />
              <span>4. Fabric, Sizes & Colors</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizeOptions.map((s) => {
                    const isSel = sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSizeToggle(s)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${isSel
                            ? 'bg-[#D81B60] text-white border-[#D81B60] shadow-2xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {s} {isSel && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Fabric Material
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Pure Silk Blend & Chiffon Dupatta"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    placeholder="Dry Clean Only. Steam Iron on Low."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-800"
                  />
                </div>
              </div>

              {/* Color Variants */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Color Variants
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-800"
                    >
                      <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-gray-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="Color Name (e.g. Turquoise Blue)"
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded-xl border border-gray-200 cursor-pointer p-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-pink-50 text-[#D81B60] border border-pink-200 rounded-xl text-xs font-extrabold hover:bg-pink-100 transition-all cursor-pointer"
                  >
                    + Add Color
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Inventory & Warehouse Stock */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-[#D81B60]" />
              <span>5. Inventory & Warehouse Control</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Quantity Available (Stock Units) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Low Stock Threshold Warning
                </label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  placeholder="5"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Product Media Gallery */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D81B60]" />
              <span>6. Product Media Gallery</span>
            </h3>

            {/* Hidden File Input for Local System Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleLocalFileUpload}
            />

            {/* Upload Action Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FolderPlus className="w-4 h-4 stroke-[2.2]" />
                <span>Upload Photos from Local Computer</span>
              </button>

              <button
                type="button"
                onClick={handleAddSampleImage}
                className="px-4 py-2.5 bg-pink-50 text-[#D81B60] border border-pink-200 font-extrabold text-xs rounded-2xl hover:bg-pink-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Add Sample Photo</span>
              </button>
            </div>

            {/* Or Paste Image URL Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste online image URL link..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#D81B60] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-gray-100 text-gray-800 font-extrabold text-xs rounded-2xl hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer"
              >
                + Add URL Link
              </button>
            </div>

            {/* Thumbnail Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-pink-200 aspect-square bg-gray-100">
                  <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: SEO Metadata */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D81B60]" />
              <span>7. Search Engine Optimization (SEO)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Floral Orange Lehenga Choli | Tohay Kids"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="floral-orange-lehenga-choli"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 8: Badges & Visibility */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <h3 className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D81B60]" />
              <span>8. Badges & Promotion Visibility</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isSale}
                  onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                  className="w-4 h-4 text-[#D81B60] rounded focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-gray-800">Display On Sale Page</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4 h-4 text-[#D81B60] rounded focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-gray-800">Mark as New Arrival</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                  className="w-4 h-4 text-[#D81B60] rounded focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-gray-800">Trending Product</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                  className="w-4 h-4 text-[#D81B60] rounded focus:ring-pink-500"
                />
                <span className="text-xs font-bold text-gray-800">Bestseller Badge</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-pink-50 rounded-2xl border border-pink-200 cursor-pointer hover:bg-pink-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isDealOfTheDay || false}
                  onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
                  className="w-4 h-4 text-[#D81B60] rounded focus:ring-pink-500"
                />
                <span className="text-xs font-extrabold text-[#D81B60] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-[#D81B60]" /> Deal of the Day
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-2xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-pink-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{submitting ? 'Publishing Outfit...' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
