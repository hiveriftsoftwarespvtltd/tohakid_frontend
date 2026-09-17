import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { categoriesList as fallbackCategories } from '../../data/products';
import { formatImageUrl } from '../../utils/imageUtils';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p5 from '../../assets/p5.png';
import p6 from '../../assets/p6.png';
import p7 from '../../assets/p7.png';
import p8 from '../../assets/p8.png';

export default function TrendingCategoriesSection() {
  const categoriesRef = useRef(null);
  const navigate = useNavigate();
  const { categoriesList: dynamicCategories } = useShop();
  const displayCategories = (dynamicCategories && dynamicCategories.length > 0) ? dynamicCategories : fallbackCategories;

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCatImage = (cat) => {
    const raw = typeof cat === 'object' ? (cat?.image || cat?.imageUrl) : cat;
    if (raw && typeof raw === 'string' && raw.trim() !== '' && !raw.includes('unsplash') && !raw.includes('photo-')) {
      return formatImageUrl(raw);
    }
    if (raw && typeof raw !== 'string') {
      return raw;
    }
    const name = (typeof cat === 'object' ? (cat?.name || '') : String(cat || '')).toLowerCase();
    if (name.includes('lehenga')) return p1;
    if (name.includes('kurta')) return p4;
    if (name.includes('sharara')) return p6;
    if (name.includes('anarkali')) return p5;
    if (name.includes('gown')) return p3;
    if (name.includes('jacket')) return p7;
    if (name.includes('sibling')) return p8;
    if (name.includes('dress')) return p2;
    return p1;
  };

  return (
    <section className="max-w-[1600px] mx-auto px-4 relative">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-sky-500 rounded-full inline-block" />
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
            Trending Categories
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] flex items-center justify-center transition-all cursor-pointer"
            title="Previous Categories"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-2xs hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] flex items-center justify-center transition-all cursor-pointer"
            title="Next Categories"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div
        ref={categoriesRef}
        className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-1"
      >
        {(displayCategories || []).map((cat, idx) => (
          <div
            key={cat.id || cat._id || idx}
            onClick={() => navigate(cat.link || `/${(cat.category || cat.parentCategory || 'girls').toLowerCase()}?subcategory=${encodeURIComponent(cat.name)}`)}
            className="group flex-none flex flex-col items-center text-center cursor-pointer w-24 sm:w-28 md:w-32 transition-transform duration-300 transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1 border-2 border-pink-200 group-hover:border-[#D81B60] bg-gradient-to-b from-pink-50/50 to-white shadow-2xs group-hover:shadow-lg transition-all duration-300 overflow-hidden mb-2 relative">
              <img
                src={getCatImage(cat)}
                alt={cat.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h4 className="font-heading font-extrabold text-xs text-gray-900 group-hover:text-[#D81B60] transition-colors leading-tight">
              {cat.name}
            </h4>
            <span className="text-[10px] font-semibold text-gray-400 mt-0.5">
              {cat.category || cat.parentCategory || 'Girls'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
