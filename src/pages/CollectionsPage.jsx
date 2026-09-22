import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Heart, Users, Crown, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { usePageBanner } from '../utils/usePageBanner';
import arrivehero from '../assets/arrivehero.png';
import celebration from '../assets/celebration.png';
import p1 from '../assets/p1.png';
import p2 from '../assets/p2.png';
import p3 from '../assets/p3.png';
import p4 from '../assets/p4.png';
import p5 from '../assets/p5.png';
import p6 from '../assets/p6.png';
import p7 from '../assets/p7.png';
import p8 from '../assets/p8.png';
import five5 from '../assets/five5.png';

export default function CollectionsPage() {
  const navigate = useNavigate();
  const heroBanner = usePageBanner('Collections Hero Banner', 'Main Collections', 'Explore our curated ethnic groupings for Girls, Boys & Matching Siblings.', arrivehero);

  // 1. GIRLS COLLECTIONS (Specified: Sharara Sets, Dhoti Sets, Pants Sets, Anarkali Sets, Lehenga Sets)
  const girlsCollections = [
    {
      id: 'girls-sharara',
      name: 'Sharara & Gharara Sets',
      tagline: 'Graceful, flowy & celebratory sharara outfits',
      image: p6,
      link: '/girls?subcategory=Sharara+Sets'
    },
    {
      id: 'girls-dhoti',
      name: 'Dhoti Suit Sets',
      tagline: 'Traditional yet trendy dhoti style ethnic wear',
      image: p2,
      link: '/girls?subcategory=Dhoti+Sets'
    },
    {
      id: 'girls-pants',
      name: 'Pants & Kurti Sets',
      tagline: 'Comfortable & modern embroidered pants suits',
      image: p5,
      link: '/girls?subcategory=Pants+Sets'
    },
    {
      id: 'girls-anarkali',
      name: 'Anarkali Suit Sets',
      tagline: 'Timeless royal flare for little princesses',
      image: p3,
      link: '/girls?subcategory=Anarkali+Suits'
    },
    {
      id: 'girls-lehenga',
      name: 'Lehenga Choli Sets',
      tagline: 'Handworked silk & organza wedding lehengas',
      image: p1,
      link: '/girls?subcategory=Lehenga+Choli'
    }
  ];

  // 2. BOYS COLLECTIONS (Specified: Kurta Pajama Sets, Kurta Pajama with Koti/Jacket Sets, Sherwanis, Indo-Western)
  const boysCollections = [
    {
      id: 'boys-kurtapajama',
      name: 'Kurta Pajama Sets',
      tagline: 'Classic & pure cotton lining kurta pajama sets',
      image: five5,
      link: '/boys?subcategory=Kurta+Pyjama+Sets'
    },
    {
      id: 'boys-koti',
      name: 'Kurta Pajama with Koti / Jacket',
      tagline: 'Dapper ethnic kurta sets with embroidered Nehru jackets',
      image: p7,
      link: '/boys?subcategory=Nehru+Jacket+Sets'
    },
    {
      id: 'boys-sherwani',
      name: 'Royal Sherwani Sets',
      tagline: 'Grand royal wedding sherwanis for young champs',
      image: p4,
      link: '/boys?subcategory=Sherwani+Sets'
    },
    {
      id: 'boys-indowestern',
      name: 'Indo-Western Sets',
      tagline: 'Fusion festive outfits for modern celebrations',
      image: p7,
      link: '/boys?subcategory=Indo+Western'
    }
  ];

  // 3. SIBLING COLLECTIONS (Specified: Coordinated matching outfits for boys and girls together)
  const siblingCollections = [
    {
      id: 'sibling-combo',
      name: 'Brother & Sister Matching Sets',
      tagline: 'Coordinated festive duo sets for brothers & sisters',
      image: p8,
      link: '/siblings?subcategory=Brother+%26+Sister+Sets'
    },
    {
      id: 'sibling-twins',
      name: 'Festive Duo & Twin Collections',
      tagline: 'Matching ethnic combinations for grand celebrations',
      image: p8,
      link: '/siblings'
    }
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">Main Collections</span>
      </nav>

      {/* Top Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-pink-200/60 shadow-2xs h-[320px] sm:h-[370px] md:h-[420px] lg:h-[460px] flex items-center bg-[#FFF0F5]">
        <img
          src={heroBanner.image}
          alt={heroBanner.title}
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F5] via-[#FFF0F5]/95 to-transparent w-full md:w-3/5" />

        <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-pink-100 text-[#D81B60] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Principal Product Groupings</span>
          </div>
          <h1 className="font-sans font-bold md:font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#1E293B] tracking-tight leading-tight">
            {heroBanner.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed">
            {heroBanner.subtitle}
          </p>
        </div>
      </div>

      {/* SECTION 1: GIRLS' COLLECTIONS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-[#D81B60] uppercase tracking-widest">Princess Styles</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mt-0.5">
              Girls' Principal Collections
            </h2>
          </div>
          <Link to="/girls" className="text-xs font-bold text-[#D81B60] hover:underline flex items-center gap-1">
            <span>EXPLORE ALL GIRLS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {girlsCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(col.link)}
              className="group bg-white rounded-3xl p-3 border border-pink-100/80 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full aspect-[3.5/4] rounded-2xl overflow-hidden bg-pink-50/50 mb-3 relative">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1 text-center pb-1">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 group-hover:text-[#D81B60] transition-colors">
                  {col.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">
                  {col.tagline}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 font-extrabold text-[11px] text-[#D81B60] group-hover:underline uppercase tracking-wider">
                    <span>VIEW COLLECTION</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: BOYS' COLLECTIONS */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">Little Champs</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mt-0.5">
              Boys' Principal Collections
            </h2>
          </div>
          <Link to="/boys" className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
            <span>EXPLORE ALL BOYS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {boysCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(col.link)}
              className="group bg-white rounded-3xl p-3 border border-sky-100/80 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full aspect-[3.5/4] rounded-2xl overflow-hidden bg-sky-50/50 mb-3 relative">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1 text-center pb-1">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 group-hover:text-sky-600 transition-colors">
                  {col.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">
                  {col.tagline}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 font-extrabold text-[11px] text-sky-600 group-hover:underline uppercase tracking-wider">
                    <span>VIEW COLLECTION</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SIBLING COLLECTION SHOWCASE */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest">Matching Duo Outfits</span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mt-0.5">
              Dedicated Sibling Collections
            </h2>
          </div>
          <Link to="/siblings" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
            <span>EXPLORE SIBLING SETS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siblingCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(col.link)}
              className="group bg-gradient-to-r from-purple-50/70 to-pink-50/70 rounded-3xl p-4 sm:p-6 border border-purple-100 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-full sm:w-48 aspect-[3.5/4] rounded-2xl overflow-hidden bg-white shrink-0">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  <Users className="w-3 h-3" />
                  <span>Coordinated Duo</span>
                </div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 group-hover:text-purple-700 transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-gray-600 font-medium max-w-md">
                  {col.tagline}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    SHOP MATCHING SIBLING SETS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
