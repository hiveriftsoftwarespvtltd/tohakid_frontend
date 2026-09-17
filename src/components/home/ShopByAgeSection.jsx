import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageBanner } from '../../utils/usePageBanner';
import four4 from '../../assets/four4.png';
import five5 from '../../assets/five5.png';
import six6 from '../../assets/six6.png';

export default function ShopByAgeSection() {
  const age08Banner = usePageBanner('Shop By Age 0-8', '0–8 YEARS', 'Cute & Comfortable', four4, '/shop-by-age?age=0-8');
  const age912Banner = usePageBanner('Shop By Age 9-12', '9–12 YEARS', 'Trendy & Festive', five5, '/shop-by-age?age=9-12');
  const age1316Banner = usePageBanner('Shop By Age 13-16', '13–16 YEARS', 'Elegant & Graceful', six6, '/shop-by-age?age=13-16');

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-amber-500 rounded-full inline-block" />
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
            Shop by Age
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 0-8 Years Card */}
        <Link
          to={age08Banner.btnPrimaryLink || age08Banner.link || '/shop-by-age?age=0-8'}
          className="group block rounded-3xl overflow-hidden bg-white border border-amber-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[290px] sm:h-[330px] md:h-[350px] overflow-hidden bg-amber-50/50">
            <img
              src={age08Banner.image}
              alt={age08Banner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/40 to-white border-t border-amber-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#B8860B]">{age08Banner.title}</h3>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">{age08Banner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#B8860B] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              SHOP NOW <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* 9-12 Years Card */}
        <Link
          to={age912Banner.btnPrimaryLink || age912Banner.link || '/shop-by-age?age=9-12'}
          className="group block rounded-3xl overflow-hidden bg-white border border-pink-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[290px] sm:h-[330px] md:h-[350px] overflow-hidden bg-pink-50/50">
            <img
              src={age912Banner.image}
              alt={age912Banner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-pink-50/40 to-white border-t border-pink-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#C85A8B]">{age912Banner.title}</h3>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">{age912Banner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#C85A8B] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              SHOP NOW <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        {/* 13-16 Years Card */}
        <Link
          to={age1316Banner.btnPrimaryLink || age1316Banner.link || '/shop-by-age?age=13-16'}
          className="group block rounded-3xl overflow-hidden bg-white border border-purple-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[290px] sm:h-[330px] md:h-[350px] overflow-hidden bg-purple-50/50">
            <img
              src={age1316Banner.image}
              alt={age1316Banner.title}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 sm:p-5 bg-gradient-to-b from-purple-50/40 to-white border-t border-purple-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#8A2BE2]">{age1316Banner.title}</h3>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">{age1316Banner.subtitle}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#8A2BE2] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              SHOP NOW <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
