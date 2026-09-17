import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { usePageBanner } from '../../utils/usePageBanner';
import one from '../../assets/one.png';
import two from '../../assets/two.png';
import three from '../../assets/three.png';
import foure from '../../assets/foure.png';

export default function OccasionsSection() {
  const festiveOccasion = usePageBanner('Occasion Festive', 'FESTIVE', 'Diwali • Navratri • Eid', one, '/collections?type=festive');
  const weddingOccasion = usePageBanner('Occasion Wedding', 'WEDDING', 'Wedding • Reception • Sangeet', two, '/collections?type=wedding');
  const birthdayOccasion = usePageBanner('Occasion Birthday', 'BIRTHDAY', 'Party • Celebration', three, '/collections?type=party');
  const everydayOccasion = usePageBanner('Occasion Everyday Ethnic', 'EVERYDAY ETHNIC', 'Comfortable ethnic styles', foure, '/collections?type=everyday');

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#D81B60] rounded-full inline-block" />
          <div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
              Dress Them for Every Occasion
            </h2>
          </div>
        </div>
        <Link to="/collections" className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-[#D81B60] hover:text-pink-800 transition-colors uppercase tracking-wider">
          <span>VIEW ALL</span> <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Festive */}
        <Link
          to={festiveOccasion.btnPrimaryLink || festiveOccasion.link || '/collections?type=festive'}
          className="group block rounded-3xl overflow-hidden bg-white border border-amber-200/70 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-amber-50/50 w-full">
            <img
              src={festiveOccasion.image}
              alt={festiveOccasion.title}
              className="w-full h-full object-cover object-[25%_top] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-amber-50/30 to-white border-t border-amber-100/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#B8860B] group-hover:text-amber-700 transition-colors">
                {festiveOccasion.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                {festiveOccasion.subtitle}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-amber-50 group-hover:bg-[#B8860B] text-[#B8860B] group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-amber-200/60 shadow-2xs">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Wedding */}
        <Link
          to={weddingOccasion.btnPrimaryLink || weddingOccasion.link || '/collections?type=wedding'}
          className="group block rounded-3xl overflow-hidden bg-white border border-pink-200/70 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-pink-50/50 w-full">
            <img
              src={weddingOccasion.image}
              alt={weddingOccasion.title}
              className="w-full h-full object-cover object-[25%_top] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-pink-50/30 to-white border-t border-pink-100/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#C85A8B] group-hover:text-[#D81B60] transition-colors">
                {weddingOccasion.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                {weddingOccasion.subtitle}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-pink-50 group-hover:bg-[#D81B60] text-[#D81B60] group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-pink-200/60 shadow-2xs">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Birthday */}
        <Link
          to={birthdayOccasion.btnPrimaryLink || birthdayOccasion.link || '/collections?type=party'}
          className="group block rounded-3xl overflow-hidden bg-white border border-purple-200/70 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-purple-50/50 w-full">
            <img
              src={birthdayOccasion.image}
              alt={birthdayOccasion.title}
              className="w-full h-full object-cover object-[25%_top] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-purple-50/30 to-white border-t border-purple-100/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#8A2BE2] group-hover:text-purple-700 transition-colors">
                {birthdayOccasion.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                {birthdayOccasion.subtitle}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-purple-200/60 shadow-2xs">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Everyday Ethnic */}
        <Link
          to={everydayOccasion.btnPrimaryLink || everydayOccasion.link || '/collections?type=everyday'}
          className="group block rounded-3xl overflow-hidden bg-white border border-blue-200/70 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
        >
          <div className="relative h-[220px] sm:h-[260px] md:h-[280px] overflow-hidden bg-blue-50/50 w-full">
            <img
              src={everydayOccasion.image}
              alt={everydayOccasion.title}
              className="w-full h-full object-cover object-[25%_top] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-3.5 sm:p-4 bg-gradient-to-b from-blue-50/30 to-white border-t border-blue-100/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#2563EB] group-hover:text-blue-700 transition-colors">
                {everydayOccasion.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5 line-clamp-1">
                {everydayOccasion.subtitle}
              </p>
            </div>
            <span className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-blue-200/60 shadow-2xs">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
