import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageBanner } from '../../utils/usePageBanner';
import one1 from '../../assets/one1.png';
import two2 from '../../assets/two2.png';
import three3 from '../../assets/three3.png';

export default function GenderCategoriesSection() {
  const girlsBanner = usePageBanner('Homepage Girls Card', 'Girls', 'Elegant ethnic styles for every little celebration.', one1, '/girls');
  const boysBanner = usePageBanner('Homepage Boys Card', 'Boys', 'Smart, stylish & comfortable looks for every occasion.', two2, '/boys');
  const siblingsBanner = usePageBanner('Homepage Siblings Card', 'Siblings', 'Matching styles made for unforgettable moments.', three3, '/siblings');

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#D81B60] rounded-full inline-block" />
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
            Shop by Gender
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Girls Card */}
        <Link
          to={girlsBanner.btnPrimaryLink || girlsBanner.link || '/girls'}
          className="group block rounded-3xl overflow-hidden bg-white border border-pink-100 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[320px] sm:h-[360px] md:h-[380px] overflow-hidden bg-pink-50">
            <img
              src={girlsBanner.image}
              alt={girlsBanner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-pink-50/40 to-white border-t border-pink-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 group-hover:text-[#D81B60] transition-colors">{girlsBanner.title}</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{girlsBanner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#D81B60] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs group-hover:bg-[#C2185B] transition-colors shrink-0">
              {girlsBanner.btnPrimaryText || 'EXPLORE'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Boys Card */}
        <Link
          to={boysBanner.btnPrimaryLink || boysBanner.link || '/boys'}
          className="group block rounded-3xl overflow-hidden bg-white border border-sky-100 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[320px] sm:h-[360px] md:h-[380px] overflow-hidden bg-sky-50">
            <img
              src={boysBanner.image}
              alt={boysBanner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-sky-50/40 to-white border-t border-sky-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 group-hover:text-sky-600 transition-colors">{boysBanner.title}</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{boysBanner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs group-hover:bg-sky-700 transition-colors shrink-0">
              {boysBanner.btnPrimaryText || 'EXPLORE'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Siblings Card */}
        <Link
          to={siblingsBanner.btnPrimaryLink || siblingsBanner.link || '/siblings'}
          className="group block rounded-3xl overflow-hidden bg-white border border-purple-100 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[320px] sm:h-[360px] md:h-[380px] overflow-hidden bg-purple-50">
            <img
              src={siblingsBanner.image}
              alt={siblingsBanner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-purple-50/40 to-white border-t border-purple-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 group-hover:text-purple-600 transition-colors">{siblingsBanner.title}</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{siblingsBanner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs group-hover:bg-purple-700 transition-colors shrink-0">
              {siblingsBanner.btnPrimaryText || 'TWINNING'} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
