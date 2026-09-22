import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { usePageBanner } from '../utils/usePageBanner';
import { isSubcategoryMatch, isAgeMatch, isColorMatch } from '../utils/filterUtils';
import cc from '../assets/cc.png';
import newArrivalsMobileImg from '../assets/newarrives.png';

const ITEMS_PER_PAGE = 9;

export default function NewArrivalsPage() {
  const { products } = useShop();
  const heroBanner = usePageBanner(
    'New Arrivals Hero Banner',
    'New Arrivals',
    'Fresh Styles. Premium Craftsmanship.',
    cc,
    '/new-arrivals',
    newArrivalsMobileImg
  );
  const [searchParams] = useSearchParams();
  const searchQueryParam = searchParams.get('search') || '';

  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const initialFilterState = {
    subcategories: [],
    ages: [],
    sizes: [],
    colors: [],
    maxPrice: 50000
  };

  const [filters, setFilters] = useState(initialFilterState);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, searchQueryParam]);

  const resetFilters = () => {
    setFilters({ subcategories: [], ages: [], sizes: [], colors: [], maxPrice: 50000 });
    setCurrentPage(1);
  };


  // Available filter options extracted from product dataset
  const availableCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.subcategory)));
  }, [products]);

  const availableColors = useMemo(() => {
    const colorMap = new Map();
    products.forEach((p) => {
      p.colors?.forEach((c) => colorMap.set(c.name, c));
    });
    return Array.from(colorMap.values());
  }, [products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Live search param
      if (searchQueryParam) {
        const query = searchQueryParam.toLowerCase();
        const matchesQuery =
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Gender category filter
      if (filters.gender && item.category !== filters.gender) {
        return false;
      }

      // Subcategories filter
      if (filters.subcategories && filters.subcategories.length > 0) {
        const matched = filters.subcategories.some((fSub) => isSubcategoryMatch(fSub, item.subcategory, item.name));
        if (!matched) return false;
      }

      // Ages filter
      if (filters.ages && filters.ages.length > 0) {
        const matchedAge = filters.ages.some((ageVal) => isAgeMatch(ageVal, item.ageRange, item.sizes, item.ageGroup));
        if (!matchedAge) return false;
      }

      // Sizes filter
      if (filters.sizes && filters.sizes.length > 0 && Array.isArray(item.sizes)) {
        if (!item.sizes.some((s) => filters.sizes.includes(s))) return false;
      }

      // Colors filter
      if (filters.colors && filters.colors.length > 0) {
        if (!isColorMatch(filters.colors, item.colors)) return false;
      }

      // Max price filter
      if (item.price > filters.maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0; // Default newest
    });
  }, [products, searchQueryParam, filters, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startIndex = filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-bold">
          {searchQueryParam ? `Search: "${searchQueryParam}"` : 'New Arrivals'}
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-200/60 shadow-md aspect-square sm:aspect-auto sm:h-[370px] md:h-[420px] lg:h-[460px] bg-[#FFF5F7] select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source
            media="(max-width: 640px)"
            srcSet={heroBanner.mobileImage || newArrivalsMobileImg}
          />
          <img
            src={heroBanner.image}
            alt={heroBanner.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Main Listing Grid Header (Count & Sort) */}
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
            Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{filteredProducts.length}</span> outfits
          </p>
        </div>

        <p className="text-[11px] font-bold text-gray-500 sm:hidden">
          Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{filteredProducts.length}</span> outfits
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

      {/* Main Layout */}
      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto no-scrollbar pr-0.5">
          <ProductFilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            isNewArrivalsPage={true}
            colors={availableColors}
            isOpenMobile={isMobileFilterOpen}
            setIsOpenMobile={setIsMobileFilterOpen}
          />
        </aside>

        {/* Right Product Grid */}
        <div className="flex-1 min-w-0 space-y-8">
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
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
            <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 space-y-4">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-400 mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-gray-800">No Outfits Match Your Filter</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try clearing some of your selected filters or search terms to explore more kids ethnicwear styles.
              </p>
              <button
                onClick={resetFilters}
                className="bg-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-pink-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
