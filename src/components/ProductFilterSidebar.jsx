import React, { useMemo } from 'react';
import { ShieldCheck, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isSubcategoryMatch } from '../utils/filterUtils';

export default function ProductFilterSidebar({
  filters,
  setFilters,
  resetFilters,
  isBoysPage = false,
  isGirlsPage = false,
  isSiblingPage = false,
  isNewArrivalsPage = false,
  isShopByAgePage = false,
  isCollectionsPage = false,
  isSalePage = false,
  categories = null,
  colors = [
    { name: 'Pink', hex: '#FF80AB' },
    { name: 'Lavender', hex: '#CE93D8' },
    { name: 'Mint Green', hex: '#A5D6A7' },
    { name: 'Yellow', hex: '#FDE047' },
    { name: 'Sky Blue', hex: '#38BDF8' },
    { name: 'Peach', hex: '#FFAB91' },
    { name: 'Maroon', hex: '#880E4F' },
    { name: 'Teal', hex: '#0F766E' }
  ],
  isOpenMobile = false,
  setIsOpenMobile = () => { },
  allProducts = null
}) {
  const { products: storeProducts, categoriesList } = useShop();
  const rawProducts = allProducts || storeProducts || [];

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.subcategories && filters.subcategories.length > 0) ||
      (filters.ages && filters.ages.length > 0) ||
      (filters.sizes && filters.sizes.length > 0) ||
      (filters.colors && filters.colors.length > 0) ||
      (filters.discounts && filters.discounts.length > 0) ||
      (filters.shopByGenders && filters.shopByGenders.length > 0) ||
      (filters.maxPrice && filters.maxPrice < 5000)
    );
  }, [filters]);

  // Base product pool for current page context
  const baseProducts = useMemo(() => {
    if (isBoysPage) return rawProducts.filter((p) => p.category === 'Boys' || (p.category && p.category.toLowerCase().includes('boy')));
    if (isGirlsPage) return rawProducts.filter((p) => p.category === 'Girls' || (p.category && p.category.toLowerCase().includes('girl')));
    if (isSiblingPage) return rawProducts.filter((p) => p.category === 'Siblings' || (p.category && p.category.toLowerCase().includes('sibling')));
    if (isNewArrivalsPage) return rawProducts.filter((p) => p.isNew || (p.category && p.category.toLowerCase().includes('new')));
    if (isSalePage) return rawProducts.filter((p) => p.isSale || (p.price && p.mrp && p.price < p.mrp));
    return rawProducts;
  }, [rawProducts, isBoysPage, isGirlsPage, isSiblingPage, isNewArrivalsPage, isSalePage]);

  // 100% Pure Dynamic Subcategories matching Admin API categoriesList
  const displayCategories = useMemo(() => {
    // 1. First priority: Subcategories officially configured in Admin Panel / Database API
    const adminSubs = new Set();

    // Check explicit categories prop passed from page
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((c) => {
        const name = typeof c === 'string' ? c : c?.name;
        if (name && typeof name === 'string' && name.trim()) {
          adminSubs.add(name.trim());
        }
      });
    }

    // Extract from backend categoriesList filtered strictly by active page context
    if (Array.isArray(categoriesList) && categoriesList.length > 0) {
      categoriesList.forEach((c) => {
        const catNameLower = (c.name || '').toLowerCase();
        let isRelevant = true;
        if (isBoysPage) isRelevant = catNameLower.includes('boy');
        else if (isGirlsPage) isRelevant = catNameLower.includes('girl');
        else if (isSiblingPage) isRelevant = catNameLower.includes('sibling');

        if (isRelevant && Array.isArray(c.subcategories)) {
          c.subcategories.forEach((s) => {
            const name = typeof s === 'string' ? s : s?.name;
            if (name && typeof name === 'string' && name.trim()) {
              adminSubs.add(name.trim());
            }
          });
        }
      });
    }

    // If Admin has defined subcategories, show EXACTLY those official subcategories from Admin
    if (adminSubs.size > 0) {
      return Array.from(adminSubs);
    }

    // 2. Fallback only if admin has not defined any subcategories in database yet:
    const targetProducts = (isBoysPage || isGirlsPage || isSiblingPage)
      ? baseProducts
      : (baseProducts.length > 0 ? baseProducts : rawProducts);

    const productSubs = new Set();
    if (Array.isArray(targetProducts) && targetProducts.length > 0) {
      targetProducts.forEach((p) => {
        if (p.subcategory && typeof p.subcategory === 'string' && p.subcategory.trim()) {
          productSubs.add(p.subcategory.trim());
        }
      });
    }

    return Array.from(productSubs);
  }, [categories, categoriesList, baseProducts, rawProducts, isBoysPage, isGirlsPage, isSiblingPage]);

  const getSubcategoryCount = (label) => {
    return baseProducts.filter((p) => isSubcategoryMatch(label, p.subcategory, p.name)).length;
  };

  const getAgeCount = (ageVal) => {
    return baseProducts.filter((p) => isAgeMatch(ageVal, p.ageRange, p.sizes, p.ageGroup)).length;
  };

  const getDiscountCount = (itemLabel) => {
    return baseProducts.filter((p) => {
      const mrp = Number(p.mrp || p.price || 0);
      const price = Number(p.price || 0);
      if (!mrp || !price || mrp <= price) return false;
      const pct = Math.round(((mrp - price) / mrp) * 100);

      if (itemLabel.includes('10%') && itemLabel.includes('20%')) return pct >= 10 && pct < 20;
      if (itemLabel.includes('20%') && itemLabel.includes('30%')) return pct >= 20 && pct < 30;
      if (itemLabel.includes('30%') && itemLabel.includes('40%')) return pct >= 30 && pct < 40;
      if (itemLabel.includes('40%') && itemLabel.includes('50%')) return pct >= 40;
      return false;
    }).length;
  };

  const getShopByCount = (genderLabel) => {
    return baseProducts.filter((p) => {
      if (genderLabel === 'Boys') return p.category === 'Boys';
      if (genderLabel === 'Girls') return p.category === 'Girls';
      if (genderLabel === 'Siblings') return p.category === 'Siblings';
      return false;
    }).length;
  };

  const handleSubcategoryChange = (catName) => {
    setFilters((prev) => {
      const current = prev.subcategories || [];
      const updated = current.includes(catName)
        ? current.filter((c) => c !== catName)
        : [...current, catName];
      return { ...prev, subcategories: updated };
    });
  };

  const handleAgeChange = (ageVal) => {
    setFilters((prev) => {
      const current = prev.ages || [];
      const updated = current.includes(ageVal)
        ? current.filter((a) => a !== ageVal)
        : [...current, ageVal];
      return { ...prev, ages: updated };
    });
  };

  const handleSizeChange = (sz) => {
    setFilters((prev) => {
      const current = prev.sizes || [];
      const updated = current.includes(sz)
        ? current.filter((s) => s !== sz)
        : [...current, sz];
      return { ...prev, sizes: updated };
    });
  };

  const handleColorChange = (cName) => {
    setFilters((prev) => {
      const current = prev.colors || [];
      const updated = current.includes(cName)
        ? current.filter((c) => c !== cName)
        : [...current, cName];
      return { ...prev, colors: updated };
    });
  };

  const handleDiscountChange = (discLabel) => {
    setFilters((prev) => {
      const current = prev.discounts || [];
      const updated = current.includes(discLabel)
        ? current.filter((d) => d !== discLabel)
        : [...current, discLabel];
      return { ...prev, discounts: updated };
    });
  };

  const handleShopByChange = (genderLabel) => {
    setFilters((prev) => {
      const current = prev.shopByGenders || [];
      const updated = current.includes(genderLabel)
        ? current.filter((g) => g !== genderLabel)
        : [...current, genderLabel];
      return { ...prev, shopByGenders: updated };
    });
  };

  const filterContent = (
    <div className="space-y-6 text-gray-800">
      {/* Top Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-heading font-extrabold text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-[#D81B60]" />
          Filters
        </h3>
        <button
          type="button"
          onClick={resetFilters}
          className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${hasActiveFilters
              ? 'bg-pink-100 text-[#D81B60] hover:bg-pink-200 shadow-2xs'
              : 'text-gray-400 hover:text-gray-600 bg-gray-50'
            }`}
        >
          <RotateCcw className="w-3 h-3" />
          Reset Filters
        </button>
      </div>
      {/* 0. DISCOUNT FILTER (Only for Sale Page) */}
      {isSalePage && (
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <h4 className="font-heading font-extrabold text-xs text-gray-900 uppercase tracking-wider">
            DISCOUNT
          </h4>
          <div className="space-y-2 text-xs font-medium">
            {[
              { label: '10% – 20% OFF' },
              { label: '20% – 30% OFF' },
              { label: '30% – 40% OFF' },
              { label: '40% – 50% OFF' }
            ].map((item) => {
              const isChecked = (filters.discounts || []).includes(item.label);
              const dynamicCount = getDiscountCount(item.label);
              return (
                <label key={item.label} className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleDiscountChange(item.label)}
                      className="w-4 h-4 rounded border-gray-300 text-[#D81B60] focus:ring-[#D81B60] cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-gray-400 font-normal">({dynamicCount})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 0.5. SHOP BY GENDER FILTER (Only for Sale Page) */}
      {isSalePage && (
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <h4 className="font-heading font-extrabold text-xs text-gray-900 uppercase tracking-wider">
            SHOP BY
          </h4>
          <div className="space-y-2 text-xs font-medium">
            {['Boys', 'Girls', 'Siblings'].map((genderLabel) => {
              const isChecked = (filters.shopByGenders || []).includes(genderLabel);
              const dynamicCount = getShopByCount(genderLabel);
              return (
                <label key={genderLabel} className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleShopByChange(genderLabel)}
                      className="w-4 h-4 rounded border-gray-300 text-[#D81B60] focus:ring-[#D81B60] cursor-pointer"
                    />
                    <span>{genderLabel}</span>
                  </div>
                  <span className="text-gray-400 font-normal">({dynamicCount})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. SUBCATEGORIES (Only shown when categories exist in database or active products) */}
      {displayCategories.length > 0 && (
        <div className="space-y-3 pb-4 border-b border-gray-100">
          <h4 className="font-heading font-extrabold text-xs text-gray-900 uppercase tracking-wider">
            SUBCATEGORY
          </h4>
          <div className="space-y-2 text-xs font-semibold">
            {displayCategories.map((cat) => {
              const isChecked = (filters.subcategories || []).includes(cat);
              const dynamicCount = getSubcategoryCount(cat);
              return (
                <label key={cat} className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer group">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSubcategoryChange(cat)}
                      className="w-4 h-4 rounded border-gray-300 text-[#D81B60] focus:ring-[#D81B60] cursor-pointer"
                    />
                    <span className="group-hover:text-[#D81B60] transition-colors">{cat}</span>
                  </div>
                  <span className="text-gray-400 font-normal">({dynamicCount})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}





      {/* 6. CTA BUTTONS */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => setIsOpenMobile(false)}
          className="w-full bg-[#D81B60] hover:bg-[#B5124E] text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          APPLY FILTERS
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="w-full text-center text-xs font-bold text-gray-400 hover:text-[#D81B60] uppercase tracking-wider py-1 cursor-pointer transition-colors"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Trust Badge Widget below Sidebar */}
      <div className="pt-2">
        <div className="bg-gradient-to-r from-blue-50/80 to-pink-50/80 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white text-[#D81B60] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-gray-900">Premium Quality</h5>
            <p className="text-[11px] text-gray-500 font-normal leading-tight">Finest fabrics for superior comfort</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs h-fit">
        {filterContent}
      </div>

      {/* Mobile Bottom Sheet / Drawer via Portal */}
      {isOpenMobile && createPortal(
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col z-50 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-heading font-bold text-base text-gray-900">Filter Outfits</h3>
              <button onClick={() => setIsOpenMobile(false)} className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              {filterContent}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
