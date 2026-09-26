import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Feather, ShieldCheck, Truck, Users, ShoppingBag, Star, Heart, Smile, RefreshCw, Lock, Clock, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { usePageBanner } from '../utils/usePageBanner';
import cc from '../assets/cc.png';
import newArrivalsMobileImg from '../assets/newarrives.png';
import three from '../assets/three.png';
import p5 from '../assets/p5.png';
import p7 from '../assets/p7.png';
import p8 from '../assets/p8.png';

export default function AboutPage() {
  const heroBanner = usePageBanner(
    'About Us Hero Banner',
    'About Us',
    'Made for little celebrations, crafted with love.',
    cc,
    '/about-us',
    newArrivalsMobileImg
  );
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#D81B60] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#D81B60] font-bold">About Us</span>
      </nav>

      {/* 1. Top Hero Header Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-200/60 shadow-md aspect-square sm:aspect-auto sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[560px] bg-[#FFF5F7] select-none">
        <picture className="absolute inset-0 w-full h-full block">
          <source
            media="(max-width: 640px)"
            srcSet={heroBanner.mobileImage || newArrivalsMobileImg}
          />
          <img
            src={heroBanner.image}
            alt={heroBanner.title}
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* 2. Our Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-4">
        <div className="rounded-3xl overflow-hidden shadow-2xs border border-pink-100 bg-pink-50/50">
          <img
            src={three}
            alt="Our Story Kids"
            className="w-full h-[320px] sm:h-[400px] object-cover object-top"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-[#1E293B]">
              Our Story
            </h2>
            <div className="w-12 h-1 bg-[#D81B60] rounded-full" />
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
            <p>
              Tohay Kids was born out of a simple belief – every child deserves to feel special in what they wear.
            </p>
            <p>
              We create ethnic wear that blends tradition with modern comfort, making every outfit perfect for festivals, weddings and all those beautiful little moments.
            </p>
            <p>
              From handpicked fabrics to intricate detailing, every piece is designed with love and crafted with care.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              className="border-2 border-[#D81B60] text-[#D81B60] hover:bg-pink-50 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              KNOW MORE ABOUT US
            </button>
          </div>
        </div>
      </div>

      {/* 3. Why Parents Love Us Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1E293B]">
            Why Parents Love Us
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#D81B60] opacity-60">
            <div className="w-6 h-0.5 bg-[#D81B60] rounded-full" />
            <Heart className="w-3.5 h-3.5 text-[#D81B60]" />
            <div className="w-6 h-0.5 bg-[#D81B60] rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Premium Quality */}
          <div className="bg-[#FFF0F5] p-6 rounded-3xl border border-pink-100/80 shadow-2xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center shrink-0 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-base text-gray-900">Premium Quality</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Finest fabrics and attention to every detail for a luxurious feel.
            </p>
          </div>

          {/* Card 2: Skin Friendly */}
          <div className="bg-[#F5EEF8] p-6 rounded-3xl border border-purple-100/80 shadow-2xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-base text-gray-900">Skin Friendly</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Soft, breathable and gentle on your little one's delicate skin.
            </p>
          </div>

          {/* Card 3: Stylish & Trendy */}
          <div className="bg-[#E6F4EA] p-6 rounded-3xl border border-emerald-100/80 shadow-2xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-base text-gray-900">Stylish & Trendy</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Thoughtfully designed styles for every occasion and personality.
            </p>
          </div>

          {/* Card 4: Hassle-Free Shopping */}
          <div className="bg-[#FFF8E1] p-6 rounded-3xl border border-amber-100/80 shadow-2xs text-center space-y-3 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-base text-gray-900">Hassle-Free Shopping</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              Easy returns, secure payments and fast customer support.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Stats Counter Bar */}
      <div className="bg-[#FFF0F5] rounded-3xl p-6 sm:p-8 border border-pink-200/60 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-pink-200/60">
          <div className="space-y-1.5 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-900">50,000+</h4>
            <p className="text-xs font-semibold text-gray-600">Happy Customers</p>
          </div>

          <div className="space-y-1.5 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-900">10,000+</h4>
            <p className="text-xs font-semibold text-gray-600">Orders Delivered</p>
          </div>

          <div className="space-y-1.5 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-900">4.8/5</h4>
            <p className="text-xs font-semibold text-gray-600">Customer Rating</p>
          </div>

          <div className="space-y-1.5 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-900">150+</h4>
            <p className="text-xs font-semibold text-gray-600">Beautiful Styles</p>
          </div>

          <div className="space-y-1.5 pt-2 md:pt-0 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-900">100%</h4>
            <p className="text-xs font-semibold text-gray-600">Parent Satisfaction</p>
          </div>
        </div>
      </div>

      {/* 5. Crafted for Little Moments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1E293B]">
              Crafted for Little Moments
            </h2>
            <div className="w-12 h-1 bg-[#D81B60] rounded-full" />
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Celebrations & Festivals',
              'Weddings & Special Occasions',
              'Birthday Parties & Gatherings',
              'Everyday Ethnic Elegance'
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#D81B60] flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-[#D81B60]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-3 gap-4">
          <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-pink-50 shadow-2xs">
            <img src={p5} alt="Little Moments 1" className="w-full h-full object-cover object-top" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-pink-50 shadow-2xs">
            <img src={p7} alt="Little Moments 2" className="w-full h-full object-cover object-top" />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-pink-50 shadow-2xs">
            <img src={p8} alt="Little Moments 3" className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>

      {/* 6. Our Promises to You Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#1E293B]">
            Our Promises to You
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#D81B60] opacity-60">
            <div className="w-6 h-0.5 bg-[#D81B60] rounded-full" />
            <Heart className="w-3.5 h-3.5 text-[#D81B60]" />
            <div className="w-6 h-0.5 bg-[#D81B60] rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-xs text-gray-900">Quality You Can Trust</h4>
            <p className="text-[11px] text-gray-500 leading-tight">Every piece is carefully inspected for the best quality.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-xs text-gray-900">Comfort Always</h4>
            <p className="text-[11px] text-gray-500 leading-tight">Designed for all-day comfort so kids can enjoy freely.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-xs text-gray-900">Timely Delivery</h4>
            <p className="text-[11px] text-gray-500 leading-tight">Fast, reliable delivery because we know your time matters.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-xs text-gray-900">Easy Returns</h4>
            <p className="text-[11px] text-gray-500 leading-tight">Hassle-free returns within 7 days of delivery.</p>
          </div>

          <div className="space-y-2 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-full bg-pink-50 text-[#D81B60] flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-extrabold text-xs text-gray-900">Secure Payments</h4>
            <p className="text-[11px] text-gray-500 leading-tight">100% safe & secure checkout experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
