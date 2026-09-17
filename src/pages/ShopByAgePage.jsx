import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import ProductFilterSidebar from '../components/ProductFilterSidebar';
import { usePageBanner } from '../utils/usePageBanner';
import { isSubcategoryMatch, isAgeMatch } from '../utils/filterUtils';
import slider1 from '../assets/slider1.png';
import four4 from '../assets/four4.png';
import five5 from '../assets/five5.png';
import six6 from '../assets/six6.png';

const ITEMS_PER_PAGE = 9;

export default function ShopByAgePage() {
  const { products, categoriesList } = useShop();
  const heroBanner = usePageBanner('Shop By Age (0 to 16 Years)', 'Shop By Age', 'Perfect fit for every age group.', slider1);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAgeParam = searchParams.get('age') || '';

  const [selectedAge, setSelectedAge] = useState(initialAgeParam);
  const [sortOption, setSortOption] = useState('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (initialAgeParam !== null) {
      setSelectedAge(initialAgeParam);
    }
  }, [initialAgeParam]);

  const initialFilterState = {
    subcategories: [],
    ages: initialAgeParam ? [initialAgeParam] : [],
    sizes: [],
    colors: [],
    maxPrice: 50000
  };

  const [filters, setFilters] = useState(initialFilterState);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption, selectedAge]);

  const ageCardsData = [
    {
      id: '0-8',
      ageLabel: '0–8',
      unit: 'YEARS',
      tagline: 'Cute & Comfortable',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      textColor: '#854D0E',
      btnColor: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200',
      image: four4
    },
    {
      id: '9-12',
      ageLabel: '9–12',
      unit: 'YEARS',
      tagline: 'Stylish & Playful',
      bgColor: '#FDF2F8',
      borderColor: '#FBCFE8',
      textColor: '#9D174D',
      btnColor: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200',
      image: five5
    },
    {
      id: '13-16',
      ageLabel: '13–16',
      unit: 'YEARS',
      tagline: 'Trendy Teens',
      bgColor: '#F0F9FF',
      borderColor: '#BAE6FD',
      textColor: '#075985',
      btnColor: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200',
      image: six6
    }
  ];

  const handleAgeCardSelect = (ageId) => {
    if (selectedAge === ageId) {
      setSelectedAge('');
      setSearchParams({});
      setFilters((prev) => ({ ...prev, ages: [] }));
    } else {
      setSelectedAge(ageId);
      setSearchParams({ age: ageId });
      setFilters((prev) => ({ ...prev, ages: [ageId] }));
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ subcategories: [], ages: [], sizes: [], colors: [], maxPrice: 50000 });
    setSelectedAge('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const ageProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedAge && !isAgeMatch(selectedAge, p.ageRange, p.sizes, p.ageGroup)) return false;

      if (filters.subcategories.length > 0) {
        const matched = filters.subcategories.some((fSub) => isSubcategoryMatch(fSub, p.subcategory, p.name));
        if (!matched) return false;
      }
      if (filters.ages.length > 0) {
        const matchedAge = filters.ages.some((ageVal) => isAgeMatch(ageVal, p.ageRange, p.sizes, p.ageGroup));
        if (!matchedAge) return false;
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
  }, [products, selectedAge, filters, sortOption]);

  const totalPages = Math.ceil(ageProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return ageProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [ageProducts, currentPage]);

  const startIndex = ageProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, ageProducts.length);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">Shop by Age</span>
      </nav>

      <div className="relative rounded-3xl overflow-hidden border border-pink-200/60 shadow-2xs min-h-[260px] sm:min-h-[300px] md:min-h-[340px] flex items-center bg-[#FFF0F5]">
        <img
          src={heroBanner.image}
          alt={heroBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F5] via-[#FFF0F5]/95 to-transparent w-full md:w-3/5" />
        <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-xl space-y-3">
          <h1 className="font-sans font-bold md:font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#1E293B] tracking-tight leading-tight">
            {heroBanner.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed">
            {heroBanner.subtitle}
          </p>
          <div className="w-12 h-1 bg-pink-300 rounded-full opacity-70" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ageCardsData.map((card) => {
          const isSelected = selectedAge === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleAgeCardSelect(card.id)}
              className={`relative rounded-3xl p-6 border-2 transition-all duration-300 cursor-pointer shadow-2xs flex justify-between items-center overflow-hidden ${isSelected
                  ? 'border-[#D81B60] ring-4 ring-pink-200 scale-101 bg-white'
                  : 'hover:border-pink-300'
                }`}
              style={{ backgroundColor: isSelected ? '#FFFFFF' : card.bgColor }}
            >
              <div className="z-10 flex flex-col justify-between h-full space-y-4 max-w-[55%]">
                <div>
                  <h3 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-900 leading-none">
                    {card.ageLabel} <span className="text-xs font-bold uppercase tracking-wider block text-gray-600 mt-1">{card.unit}</span>
                  </h3>
                  <p className="text-xs font-semibold mt-2 text-gray-600">
                    {card.tagline}
                  </p>
                </div>
                <button
                  type="button"
                  className={`text-xs font-extrabold px-5 py-2.5 rounded-xl uppercase tracking-wider transition-all w-fit cursor-pointer shadow-2xs ${isSelected
                      ? 'bg-[#D81B60] text-white'
                      : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {isSelected ? 'SELECTED' : 'SHOP NOW'}
                </button>
              </div>
              <img
                src={card.image}
                alt={card.ageLabel}
                className="w-28 sm:w-32 h-36 sm:h-40 object-cover object-top rounded-2xl shadow-2xs shrink-0"
              />
            </div>
          );
        })}
      </div>

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
            Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{ageProducts.length}</span> results
          </p>
        </div>
        <p className="text-[11px] font-bold text-gray-500 sm:hidden">
          Showing <span className="text-[#D81B60] font-extrabold">{startIndex}-{endIndex}</span> of <span className="text-[#D81B60] font-extrabold">{ageProducts.length}</span> results
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

      <div className="flex gap-8 items-start">
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto no-scrollbar pr-0.5">
          <ProductFilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
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
                      className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${currentPage === pageNum
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
              <h3 className="font-heading font-extrabold text-base text-gray-800">No Outfits Found For Criteria</h3>
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
