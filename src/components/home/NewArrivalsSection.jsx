import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ThreeDCarousel from '../ThreeDCarousel';
import { products as fallbackProducts } from '../../data/products';

export default function NewArrivalsSection() {
  const { products } = useShop();

  const newArrivals = useMemo(() => {
    const list = (products && products.length > 0) ? products : fallbackProducts;
    const flagged = list.filter((p) => p.isNew || p.isBestseller);
    return flagged.length > 0 ? flagged.slice(0, 8) : list.slice(0, 8);
  }, [products]);

  return (
    <section className="max-w-[1600px] mx-auto px-4 relative">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#D81B60] rounded-full inline-block" />
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
            New Arrivals
          </h2>
        </div>
        <Link
          to="/new-arrivals"
          className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-[#D81B60] hover:text-pink-800 transition-colors uppercase tracking-wider"
        >
          <span>VIEW ALL</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <ThreeDCarousel
        items={newArrivals.length > 0 ? newArrivals : products.slice(0, 8)}
        autoPlay={true}
        interval={4000}
      />
    </section>
  );
}
