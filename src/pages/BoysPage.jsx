import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { usePageBanner } from '../utils/usePageBanner';
import { isCategoryMatch, isSubcategoryMatch, isAgeMatch, isColorMatch } from '../utils/filterUtils';
import boyshero from '../assets/boyshero.png';

const ITEMS_PER_PAGE = 9;

export default function BoysPage() {
  const { products, categoriesList } = useShop();
  const heroBanner = usePageBanner('Boys Category Top Banner', 'Boys Collection', 'Smart. Stylish. Made for every celebration.', boyshero);
  const [searchParams] = useSearchParams();
  const selectedSubcatParam = searchParams.get('subcategory') || '';

  const [activeSubcat, setActiveSubcat] = useState(selectedSubcatParam);
  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const boysSubcategories = useMemo(() => {
    if (Array.isArray(categoriesList)) {
      const match = categoriesList.find((c) => (c.name || '').toLowerCase().includes('boy'));
      if (match && Array.isArray(match.subcategories) && match.subcategories.length > 0) {
        return match.subcategories.map(s => typeof s === 'string' ? s : s?.name).filter(Boolean);
      }
    }
    // Dynamically derive from active boys products in store
    const fromProducts = Array.from(
      new Set(
        products
          .filter((p) => isCategoryMatch('Boys', p.category) && p.subcategory && typeof p.subcategory === 'string' && p.subcategory.trim())
          .map((p) => p.subcategory.trim())
      )
    );
    return fromProducts;
  }, [categoriesList, products]);

  const initialFilterState = {
    subcategories: selectedSubcatParam ? [selectedSubcatParam] : [],
    ages: [],
    sizes: [],
    colors: [],
    maxPrice: 50000
  };

  const [filters, setFilters] = useState(initialFilterState);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, activeSubcat]);

  const resetFilters = () => {
    setFilters({ subcategories: [], ages: [], sizes: [], colors: [], maxPrice: 50000 });
    setActiveSubcat('');
    setCurrentPage(1);
  };

  const handleSubcatTabClick = (subcat) => {
    if (activeSubcat === subcat) {
      setActiveSubcat('');
      setFilters((prev) => ({ ...prev, subcategories: [] }));
    } else {
      setActiveSubcat(subcat);
      setFilters((prev) => ({ ...prev, subcategories: [subcat] }));
    }
  };

  const boysProducts = useMemo(() => {
    return products.filter((p) => {
      if (!isCategoryMatch('Boys', p.category)) return false;


      if (filters.subcategories && filters.subcategories.length > 0) {
        const matched = filters.subcategories.some((fSub) => isSubcategoryMatch(fSub, p.subcategory, p.name));
        if (!matched) return false;
      }
      if (filters.ages && filters.ages.length > 0) {
        const matchedAge = filters.ages.some((ageVal) => isAgeMatch(ageVal, p.ageRange, p.sizes, p.ageGroup));
        if (!matchedAge) return false;
      }
      if (filters.sizes && filters.sizes.length > 0 && Array.isArray(p.sizes)) {
        if (!p.sizes.some((s) => filters.sizes.includes(s))) return false;
      }
      if (filters.colors && filters.colors.length > 0) {
        if (!isColorMatch(filters.colors, p.colors)) return false;
      }
      if (p.price > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, filters, sortOption]);

  const totalPages = Math.ceil(boysProducts.length / ITEMS_PER_PAGE) || 1;
  
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return boysProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [boysProducts, currentPage]);

  const startIndex = boysProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, boysProducts.length);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">Boys Collection</span>
      </nav>

      {/* Boys Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-pink-200/60 shadow-2xs min-h-[260px] sm:min-h-[320px] flex items-center bg-[#FFF5F7]">
        <img
          src={heroBanner.image}
          alt={heroBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F7] via-[#FFF5F7]/95 to-transparent w-full md:w-3/5" />

        <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-xl space-y-4">
          <h1 className="font-sans font-bold md:font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1E293B] tracking-tight leading-tight">
            {heroBanner.title}
          </h1>
          <div className="space-y-1 text-xs sm:text-sm md:text-base leading-relaxed">
            <p className="font-bold text-[#334155]">{heroBanner.subtitle}</p>
            <p className="text-[#64748B]">Comfortable ethnic wear for your little champs.</p>
          </div>
          
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSubcatTabClick('Kurta Pyjama Sets')}
              className="bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-2xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              KURTA PYJAMA SETS
            </button>
            <button
              onClick={() => handleSubcatTabClick('Sherwani Sets')}
              className="bg-white hover:bg-gray-50 text-[#1E293B] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg border border-[#CBD5E1] shadow-2xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              SHERWANI SETS
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Boys Collections Chips Bar from MongoDB Atlas */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider shrink-0">Collections:</span>
        {['All Boys', ...(boysSubcategories || [])].map((subcat) => {
          const isSelected = subcat === 'All Boys' ? activeSubcat === '' : activeSubcat === subcat;
          return (
            <button
              key={subcat}
              type="button"
              onClick={() => {
                if (subcat === 'All Boys') {
                  setActiveSubcat('');
                  setFilters((prev) => ({ ...prev, subcategories: [] }));
                } else {
                  handleSubcatTabClick(subcat);
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#D81B60] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              }`}
            >
              {subcat}
            </button>
          );
        })}
      </div>

      {/* Grid Header & Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-pink-50 border border-pink-200 text-[#D81B60] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 sm:hidden">
            <span className="text-xs font-bold text-gray-500 shrink-0">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D81B60]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <p className="hidden sm:block text-xs font-bold text-gray-600">
            Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{boysProducts.length}</span> results
          </p>
        </div>

        <p className="text-[11px] font-bold text-gray-500 sm:hidden">
          Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{boysProducts.length}</span> results
        </p>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#D81B60]"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto no-scrollbar pr-0.5">
          <ProductFilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            isBoysPage={true}
            categories={boysSubcategories}
            isOpenMobile={isMobileFilterOpen}
            setIsOpenMobile={setIsMobileFilterOpen}
          />
        </aside>

        <div className="flex-1 min-w-0 space-y-8">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Working Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-700 text-xs font-bold border border-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#D81B60] text-white shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }
                    }}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-700 text-xs font-bold border border-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-pink-100">
              <h3 className="font-heading font-extrabold text-base text-gray-800">No Boys Outfits Match Criteria</h3>
              <button onClick={resetFilters} className="mt-4 bg-[#D81B60] hover:bg-[#C2185B] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
