import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

export default function DealOfTheDay({ customProducts }) {
  const { products } = useShop();

  // Real-time countdown timer state (4 Hours, 15 Mins, 30 Secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 15, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 15, seconds: 30 }; // Auto reset loop for continuous live demo
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products:
  // 1. If customProducts prop is passed, use it.
  // 2. Otherwise, look for products marked with isDealOfTheDay/isFlashDeal or discount > 0 in database.
  // 3. Fallback to first 6 products.
  let dealProducts = [];
  if (customProducts && customProducts.length > 0) {
    dealProducts = customProducts;
  } else if (products && products.length > 0) {
    const flaggedDeals = products.filter(p => p.isDealOfTheDay || p.isFlashDeal || p.isSale || p.discount > 0 || (p.mrp && p.mrp > p.price));
    dealProducts = flaggedDeals.length > 0 ? flaggedDeals.slice(0, 6) : products.slice(0, 6);
  }

  return (
    <section className="max-w-[1600px] mx-auto px-4 my-8 md:my-12">
      <div className="bg-gradient-to-br from-[#FFF0F4] via-[#FFF5F7] to-[#FFFDFC] rounded-3xl border border-pink-200/80 p-4 sm:p-6 md:p-8 shadow-2xs">
        {/* Header with Live Countdown Timer & Section Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-pink-200/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#D81B60] rounded-full inline-block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#D81B60] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  <Zap className="w-3 h-3 fill-white" /> FLASH DEAL
                </span>
                <span className="text-xs font-bold text-pink-700 uppercase tracking-widest hidden sm:inline-block">
                  Limited Time Offer
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight mt-1">
                Deal of the Day
              </h2>
            </div>
          </div>

          {/* Real-time Countdown Timer Display */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/90 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-pink-200 shadow-2xs self-start md:self-auto">
            <Clock className="w-4 h-4 text-[#D81B60] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-extrabold text-xs sm:text-sm text-gray-900">
              <span className="bg-[#D81B60] text-white px-2 py-1 rounded-md">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-[#D81B60] font-bold">:</span>
              <span className="bg-[#D81B60] text-white px-2 py-1 rounded-md">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-[#D81B60] font-bold">:</span>
              <span className="bg-[#D81B60] text-white px-2 py-1 rounded-md">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* 6 Deal Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {dealProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={{ ...product, badge: 'FLAT 30% OFF' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
