import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { parentReviews } from '../../data/products';

export default function ParentReviewsSection() {
  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
          Loved by Parents
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Real feedback & photos from verified parents across India
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {parentReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-5 rounded-3xl border border-pink-100/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:-translate-y-1"
          >
            {/* Top Row: 5-Star Rating & Verified Badge */}
            <div className="flex items-center justify-between border-b border-pink-50 pb-3">
              <div className="flex items-center gap-1">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Parent
              </span>
            </div>

            {/* Review Comment */}
            <p className="text-xs text-gray-700 leading-relaxed font-medium italic relative z-10">
              “{rev.comment}”
            </p>

            {/* Bottom Card: Parent Info */}
            <div className="pt-3 border-t border-pink-100/80 flex items-center justify-between gap-3 bg-pink-50/40 p-2.5 rounded-2xl">
              <div className="min-w-0">
                <h4 className="font-heading font-extrabold text-xs text-gray-900 leading-tight truncate">
                  {rev.name}
                </h4>
                <p className="text-[10px] font-semibold text-gray-500 truncate">{rev.city}</p>
              </div>

              {rev.outfit && (
                <span className="text-[10px] font-bold text-[#D81B60] bg-pink-100/80 px-2 py-1 rounded-lg truncate max-w-[130px]" title={`Purchased: ${rev.outfit}`}>
                  {rev.outfit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
