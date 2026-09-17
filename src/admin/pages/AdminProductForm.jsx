import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Upload, X, Check, Save, Sparkles, Image as ImageIcon,
  Tag, Info, IndianRupee, Warehouse, Globe, FolderPlus, Trash2, Plus
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { compressImage, compressImageToFile } from '../../utils/imageCompressor';
import { uploadService } from '../../services/uploadService';
import { saveProductVariants, getProductVariants, enrichProductWithVariants } from '../../utils/variantStorage';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productsList, addProduct, updateProduct, categoriesList, showToast } = useAdmin();
  const fileInputRef = useRef(null);

  const handleLocalFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    showToast('Compressing & uploading image to Cloudinary...');

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
          setFormData((prev) => ({ ...prev, images: [...prev.images, uploadedUrl] }));
        }
      } catch (err) {}
    }

    if (e.target) e.target.value = '';
    showToast('Image uploaded to Cloudinary successfully!');
  };


  const isEditMode = Boolean(id);
  const existingProd = isEditMode ? productsList.find((p) => String(p.id) === String(id) || String(p._id) === String(id)) : null;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    shortDescription: '',
    description: '',
    category: 'Girls',
    subcategory: 'Lehenga Choli',
    price: 2499,
    mrp: 3499,
    costPrice: 1200,
    stock: 25,
    lowStockThreshold: 5,
    isSale: true,
    isNew: true,
    isTrending: false,
    isDealOfTheDay: false,
    sizes: [],
    sizeVariants: [],
    colors: [
      { name: 'Pink', hex: '#EC4899' },
      { name: 'Gold', hex: '#EAB308' }
    ],
    fabric: 'Pure Silk Blend & Chiffon Dupatta',
    care: 'Dry Clean Only. Steam Iron on Low.',
    occasion: 'Festive',
    metaTitle: '',
    metaDescription: '',
    slug: '',
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ]
  });

  const [customSizeInput, setCustomSizeInput] = useState('');

  useEffect(() => {
    if (isEditMode && existingProd) {
      const enriched = enrichProductWithVariants(existingProd);
      const initialVariants = (Array.isArray(enriched?.sizeVariants) && enriched.sizeVariants.length > 0)
        ? enriched.sizeVariants
        : (Array.isArray(existingProd.sizes)
            ? existingProd.sizes.map((sz) => ({
                size: sz,
                price: Number(existingProd.price) || 0,
                mrp: Number(existingProd.mrp) || 0,
                stock: 10,
                isAvailable: true,
              }))
            : []);
      const initialSizes = Array.isArray(existingProd.sizes) && existingProd.sizes.length > 0
        ? existingProd.sizes
        : initialVariants.map((v) => v.size);

      setFormData({
        name: existingProd.name || '',
        sku: existingProd.id || '',
        shortDescription: existingProd.shortDescription || '',
        description: existingProd.description || '',
        category: existingProd.category || 'Girls',
        subcategory: existingProd.subcategory || 'Lehenga Choli',
        price: existingProd.price || 0,
        mrp: existingProd.mrp || 0,
        costPrice: Math.round((existingProd.price || 0) * 0.5),
        stock: existingProd.stock ?? 15,
        lowStockThreshold: 5,
        isSale: Boolean(existingProd.isSale),
        isNew: Boolean(existingProd.isNew),
        isTrending: Boolean(existingProd.isTrending),
        isDealOfTheDay: Boolean(existingProd.isDealOfTheDay || existingProd.isFlashDeal),
        sizes: initialSizes,
        sizeVariants: initialVariants,
        colors: existingProd.colors || [{ name: 'Pink', hex: '#EC4899' }],
        fabric: existingProd.fabric || 'Pure Cotton Blend',
        care: existingProd.care || 'Dry Clean Only',
        occasion: existingProd.occasion || 'Festive',
        metaTitle: `${existingProd.name} | Tohay Kids`,
        metaDescription: existingProd.shortDescription || '',
        slug: (existingProd.name || '').toLowerCase().replace(/\s+/g, '-'),
        images: existingProd.images || []
      });
    }
  }, [isEditMode, existingProd]);

  // Dynamic sync category & subcategory from MongoDB categoriesList
  useEffect(() => {
    if (Array.isArray(categoriesList) && categoriesList.length > 0 && !isEditMode) {
      setFormData((prev) => {
        let matchedCat = categoriesList.find(
          (c) =>
            c.name === prev.category ||
            (c.name || '').toLowerCase() === (prev.category || '').toLowerCase() ||
            (c.name || '').toLowerCase().includes((prev.category || '').toLowerCase()) ||
            (prev.category || '').toLowerCase().includes((c.name || '').toLowerCase())
        );

        if (!matchedCat) {
          matchedCat = categoriesList[0];
        }

        const subs = (matchedCat.subcategories || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
        const validSub = subs.includes(prev.subcategory) ? prev.subcategory : (subs[0] || '');

        if (prev.category !== matchedCat.name || prev.subcategory !== validSub) {
          return {
            ...prev,
            category: matchedCat.name,
            subcategory: validSub
          };
        }
        return prev;
      });
    }
  }, [categoriesList, isEditMode]);


  // Handle Name change and auto-generate slug & meta title
  const handleNameChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      metaTitle: val ? `${val} | Tohay Kids` : ''
    }));
  };

  // Add dummy image simulation
  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setFormData((prev) => ({ ...prev, images: [...prev.images, randomSample] }));
    showToast('Image uploaded successfully!');
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  // Toggle Size Chip and sync with sizeVariants
  const toggleSize = (sizeTag) => {
    setFormData((prev) => {
      const exists = (prev.sizes || []).includes(sizeTag);
      const newSizes = exists
        ? prev.sizes.filter((s) => s !== sizeTag)
        : [...(prev.sizes || []), sizeTag];

      const currentVariants = prev.sizeVariants || [];
      const newVariants = exists
        ? currentVariants.filter((v) => v.size !== sizeTag)
        : [
            ...currentVariants,
            {
              size: sizeTag,
              price: prev.price || 0,
              mrp: prev.mrp || 0,
              stock: 10,
              isAvailable: true,
            },
          ];

      return {
        ...prev,
        sizes: newSizes,
        sizeVariants: newVariants,
      };
    });
  };

  // Add custom size (e.g. 0-6 m, 6-12m)
  const handleAddCustomSize = (e) => {
    e?.preventDefault();
    const clean = (customSizeInput || '').trim();
    if (!clean) return;

    if ((formData.sizes || []).includes(clean)) {
      showToast(`Size "${clean}" is already added.`);
      setCustomSizeInput('');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      sizes: [...(prev.sizes || []), clean],
      sizeVariants: [
        ...(prev.sizeVariants || []),
        {
          size: clean,
          price: prev.price || 0,
          mrp: prev.mrp || 0,
          stock: 10,
          isAvailable: true,
        },
      ],
    }));
    setCustomSizeInput('');
    showToast(`Added size "${clean}"`);
  };

  // Update a specific variant field
  const handleVariantChange = (sizeName, field, value) => {
    setFormData((prev) => {
      const updatedVariants = (prev.sizeVariants || []).map((v) => {
        if (v.size === sizeName) {
          return { ...v, [field]: value };
        }
        return v;
      });
      return { ...prev, sizeVariants: updatedVariants };
    });
  };

  // Remove variant row
  const handleRemoveVariant = (sizeName) => {
    setFormData((prev) => ({
      ...prev,
      sizes: (prev.sizes || []).filter((s) => s !== sizeName),
      sizeVariants: (prev.sizeVariants || []).filter((v) => v.size !== sizeName),
    }));
  };

  // Quick fill base price & MRP across all size variants
  const handleApplyBasePriceToAllVariants = () => {
    setFormData((prev) => {
      const updatedVariants = (prev.sizeVariants || []).map((v) => ({
        ...v,
        price: prev.price || v.price || 0,
        mrp: prev.mrp || v.mrp || 0,
      }));
      return { ...prev, sizeVariants: updatedVariants };
    });
    showToast(`Applied base price (₹${formData.price}) & MRP to all sizes!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter a valid product name.');
      return;
    }

    const payload = { ...formData };
    if (Array.isArray(payload.sizeVariants) && payload.sizeVariants.length > 0) {
      payload.sizes = payload.sizeVariants.map((v) => v.size);
      const prices = payload.sizeVariants.map((v) => Number(v.price)).filter((p) => !isNaN(p) && p > 0);
      if (prices.length > 0 && (!payload.price || payload.price === 0)) {
        payload.price = Math.min(...prices);
      }
    }

    try {
      const targetId = id || payload.id || payload.sku;
      if (Array.isArray(payload.sizeVariants) && payload.sizeVariants.length > 0) {
        saveProductVariants(targetId, payload.sizeVariants);
        if (payload.sku) saveProductVariants(String(payload.sku), payload.sizeVariants);
        if (payload.id) saveProductVariants(String(payload.id), payload.sizeVariants);
        if (payload._id) saveProductVariants(String(payload._id), payload.sizeVariants);
      }

      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload);
      }
      navigate('/admin/catalog/products');
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Page Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/catalog/products"
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-gray-900">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs text-gray-500 font-semibold">
              {isEditMode ? `Updating SKU #${id}` : 'Fill in details to publish a new kids outfit'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/catalog/products"
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Details, Pricing, Attributes, SEO */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D81B60]" />
              <span>Basic Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Product Name <span className="text-pink-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Floral Orange Lehenga Choli With Dupatta"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1 focus:ring-1 focus:ring-[#D81B60] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                      SKU Code / ID
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
                    placeholder="TH-101"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold font-mono text-gray-800 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                  >
                    <option value="Festive">Festive</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Party">Party Wear</option>
                    <option value="Casual">Casual Ethnic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Short Highlight Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary snippet for product cards and fast previews..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Profit Margin */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#D81B60]" />
              <span>Pricing Strategy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Selling Price (₹) <span className="text-pink-600">*</span>
                </label>
                <input
                  type="number"
                  placeholder="2352"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  MRP Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="3299"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Cost Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="1200"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 mt-1 focus:ring-1 focus:ring-[#D81B60]"
                />
              </div>
            </div>

            {/* Margin Calculation Box */}
            <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 flex items-center justify-between text-xs font-bold text-gray-800">
              <span>Estimated Profit Margin:</span>
              <span className="text-emerald-700 font-extrabold">
                ₹{Math.max(0, formData.price - formData.costPrice).toLocaleString('en-IN')} (
                {formData.price > 0 ? Math.round(((formData.price - formData.costPrice) / formData.price) * 100) : 0}% Margin)
              </span>
            </div>
          </div>

          {/* Section 3: Attributes & Sizes */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D81B60]" />
              <span>Fabric & Size Attributes</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider block mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set([
                    '0-1Y', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y',
                    '8-9Y', '9-10Y', '10-11Y', '11-12Y', '12-13Y', '13-14Y', '14-15Y', '15-16Y',
                    '0-2Y', '2-4Y', '4-6Y', '6-8Y', '8-10Y', '10-12Y', '12-14Y', '14-16Y',
                    'Free Size', 'S', 'M', 'L', 'XL',
                    ...(formData.sizes || [])
                  ])).map((s) => {
                    const isSel = (formData.sizes || []).includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${isSel
                          ? 'bg-[#D81B60] text-white border-[#D81B60] shadow-2xs scale-105'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {s} {isSel && '✓'}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Size Adder */}
                <div className="flex gap-2 mt-3 items-center">
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. 0-6 m, 6-12m, 2-3 Y)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    className="flex-1 max-w-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>
              </div>

              {/* Size-Wise Pricing & Stock Matrix Table */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#D81B60]" />
                      <span>Size-Wise Dynamic Pricing & Availability</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Set specific selling prices, MRPs, and availability for each size variant
                    </p>
                  </div>
                  {formData.sizeVariants && formData.sizeVariants.length > 0 && (
                    <button
                      type="button"
                      onClick={handleApplyBasePriceToAllVariants}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#D81B60] bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      ⚡ Auto-Fill from Base Price (₹{formData.price})
                    </button>
                  )}
                </div>

                {formData.sizeVariants && formData.sizeVariants.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-[11px] font-extrabold uppercase text-gray-600 border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-2.5">Size</th>
                          <th className="px-3 py-2.5">Selling Price (₹)</th>
                          <th className="px-3 py-2.5">MRP (₹)</th>
                          <th className="px-3 py-2.5">Stock</th>
                          <th className="px-3 py-2.5">Available (Y/N)</th>
                          <th className="px-3 py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {formData.sizeVariants.map((variant) => (
                          <tr key={variant.size} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-3 py-2 font-black text-gray-900">
                              <span className="px-2 py-0.5 rounded-lg bg-pink-50 border border-pink-200 text-[#D81B60] font-bold inline-block">
                                {variant.size}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="relative max-w-[110px]">
                                <span className="absolute left-2 top-2 text-gray-400 font-bold">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.price ?? ''}
                                  onChange={(e) => handleVariantChange(variant.size, 'price', Number(e.target.value))}
                                  className="w-full pl-5 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#D81B60]"
                                  placeholder="Price"
                                />
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="relative max-w-[110px]">
                                <span className="absolute left-2 top-2 text-gray-400 font-bold">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={variant.mrp ?? ''}
                                  onChange={(e) => handleVariantChange(variant.size, 'mrp', Number(e.target.value))}
                                  className="w-full pl-5 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#D81B60]"
                                  placeholder="MRP"
                                />
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="0"
                                value={variant.stock ?? ''}
                                onChange={(e) => handleVariantChange(variant.size, 'stock', Number(e.target.value))}
                                className="w-20 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:bg-white focus:ring-1 focus:ring-[#D81B60]"
                                placeholder="Qty"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={variant.isAvailable !== false && Number(variant.stock) > 0}
                                  onChange={(e) => handleVariantChange(variant.size, 'isAvailable', e.target.checked)}
                                  className="w-4 h-4 text-[#D81B60] rounded border-gray-300 focus:ring-[#D81B60]"
                                />
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  variant.isAvailable !== false && Number(variant.stock) > 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {variant.isAvailable !== false && Number(variant.stock) > 0 ? 'Y (In Stock)' : 'N (Out of Stock)'}
                                </span>
                              </label>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(variant.size)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Remove size"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-500">
                    No sizes selected yet. Select size chips above or add custom sizes to set prices.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Fabric Material
                  </label>
                  <input
                    type="text"
                    placeholder="Pure Silk Blend & Chiffon Dupatta"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="Dry Clean Only"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: SEO Metadata */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D81B60]" />
              <span>Search Engine Optimization (SEO)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Meta Title
                </label>
                <input
                  type="text"
                  placeholder="Floral Orange Lehenga Choli | Tohay Kids"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="floral-orange-lehenga-choli"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Media Upload, Organization & Stock */}
        <div className="lg:col-span-4 space-y-6">
          {/* Product Media Gallery */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#D81B60]" />
              <span>Product Media</span>
            </h3>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-square">
                  <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Hidden File Input for Local System Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleLocalFileUpload}
            />

            {/* Upload Buttons Row */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 border-2 border-dashed border-pink-300 hover:border-[#D81B60] bg-pink-50/40 hover:bg-pink-50 text-[#D81B60] rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <FolderPlus className="w-5 h-5 stroke-[2]" />
                <span>Upload Photos from Local Computer</span>
              </button>

              <button
                type="button"
                onClick={handleAddSampleImage}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                + Add Sample Web Photo
              </button>
            </div>
          </div>

          {/* Category & Organization */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Organization</h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    const match = (categoriesList || []).find((c) => c.name === newCat);
                    const subs = (match?.subcategories || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
                    setFormData({
                      ...formData,
                      category: newCat,
                      subcategory: subs[0] || ''
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                >
                  {(categoriesList || []).map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                >
                  {(() => {
                    const match = (categoriesList || []).find(
                      (c) =>
                        c.name === formData.category ||
                        (c.name || '').toLowerCase() === (formData.category || '').toLowerCase() ||
                        (c.name || '').toLowerCase().includes((formData.category || '').toLowerCase()) ||
                        (formData.category || '').toLowerCase().includes((c.name || '').toLowerCase())
                    );
                    const subs = (match?.subcategories || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);

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

          {/* Inventory & Status */}
          <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-2xs space-y-4">
            <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-[#D81B60]" />
              <span>Stock Control</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">
                  Quantity Available
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 mt-1"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-700">Display On Sale Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-700">Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-700">Trending Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isDealOfTheDay || false}
                    onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="text-xs font-extrabold text-[#D81B60]">⚡ Mark as Deal of the Day</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
