import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { usePageBanner } from '../../utils/usePageBanner';
import { formatImageUrl } from '../../utils/imageUtils';
import celebration from '../../assets/celebration.png';
import p3 from '../../assets/p3.png';

export default function CelebrationEditSection() {
  const navigate = useNavigate();
  const { products } = useShop();
  const celebrationBanner = usePageBanner('Homepage Celebration Edit', 'The Celebration Edit', 'Handpicked ethnic styles designed for weddings, festivals and special moments.', celebration, '/collections');

  const celebrationProducts = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="bg-[#FFF0F4] rounded-3xl border border-pink-200/60 p-4 sm:p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xs">

        {/* Left Side Banner Image */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
          <div className="rounded-2xl overflow-hidden shadow-xs border border-pink-100/80 max-w-[320px] lg:max-w-none">
            <img
              src={celebrationBanner.image}
              alt={celebrationBanner.title}
              className="w-full h-auto block object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Middle Text Content */}
        <div className="w-full lg:w-1/3 text-center lg:text-left space-y-3 px-2">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 leading-tight">
            {celebrationBanner.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-normal max-w-md mx-auto lg:mx-0 leading-relaxed">
            {celebrationBanner.subtitle}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate(celebrationBanner.link || '/collections')}
              className="bg-[#D81B60] hover:bg-[#B5124E] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {celebrationBanner.btnPrimaryText || 'SHOP THE COLLECTION'}
            </button>
          </div>
        </div>

        {/* Right Side 3 Dynamic Product Cards */}
        <div className="w-full lg:w-1/3 flex items-center justify-center lg:justify-end gap-3 sm:gap-4 overflow-x-auto py-2">
          {celebrationProducts.map((p) => (
            <div
              key={p.id || p._id}
              onClick={() => navigate(`/product/${p.id || p._id}`)}
              className="w-28 sm:w-32 flex-shrink-0 bg-white/90 rounded-2xl border border-pink-100 p-2 shadow-2xs hover:shadow-md transition-all cursor-pointer group text-center"
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2 bg-pink-50">
                <img
                  src={formatImageUrl((p.images && p.images[0]) || p.image || p3)}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-heading font-extrabold text-xs text-gray-900">₹ {p.price?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
