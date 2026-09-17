import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../ProductCard';
import { products as fallbackProducts } from '../../data/products';

export default function BestsellersSection() {
  const { products } = useShop();

  const bestsellers = useMemo(() => {
    const list = (products && products.length > 0) ? products : fallbackProducts;
    const flagged = list.filter((p) => p.isBestseller || p.isTrending);
    return flagged.length > 0 ? flagged.slice(0, 6) : list.slice(0, 6);
  }, [products]);

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="flex items-end justify-between mb-6 md:mb-8 border-b border-pink-100/60 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#D81B60] rounded-full inline-block" />
          <div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">Explore Our Bestsellers</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Loved by parents. Made for little celebrations.</p>
          </div>
        </div>
        <Link to="/new-arrivals" className="hidden sm:flex items-center gap-1 text-xs font-extrabold text-[#D81B60] hover:text-pink-800 transition-colors uppercase tracking-wider">
          <span>VIEW ALL</span> <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {bestsellers.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
