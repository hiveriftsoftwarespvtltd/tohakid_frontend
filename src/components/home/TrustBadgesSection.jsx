import React from 'react';
import { Award, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function TrustBadgesSection() {
  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Premium Quality */}
        <div className="bg-white rounded-2xl border border-pink-100/90 p-4 sm:p-5 flex items-center gap-4 shadow-2xs hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full border-2 border-pink-200/80 bg-pink-50/70 flex items-center justify-center flex-shrink-0 text-pink-600">
            <Award className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
              Premium Quality
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5 leading-snug">
              Carefully crafted with fine fabrics
            </p>
          </div>
        </div>

        {/* Card 2: Skin Friendly */}
        <div className="bg-white rounded-2xl border border-pink-100/90 p-4 sm:p-5 flex items-center gap-4 shadow-2xs hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full border-2 border-pink-200/80 bg-pink-50/70 flex items-center justify-center flex-shrink-0 text-pink-600">
            <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
              Skin Friendly
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5 leading-snug">
              Soft materials for your little one's comfort
            </p>
          </div>
        </div>

        {/* Card 3: Free Shipping */}
        <div className="bg-white rounded-2xl border border-pink-100/90 p-4 sm:p-5 flex items-center gap-4 shadow-2xs hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full border-2 border-pink-200/80 bg-pink-50/70 flex items-center justify-center flex-shrink-0 text-pink-600">
            <Truck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
              Free Shipping
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5 leading-snug">
              On orders above ₹1499
            </p>
          </div>
        </div>

        {/* Card 4: Easy Returns */}
        <div className="bg-white rounded-2xl border border-pink-100/90 p-4 sm:p-5 flex items-center gap-4 shadow-2xs hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-full border-2 border-pink-200/80 bg-pink-50/70 flex items-center justify-center flex-shrink-0 text-pink-600">
            <RefreshCw className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
              Easy Returns
            </h3>
            <p className="text-xs text-gray-500 font-normal mt-0.5 leading-snug">
              Hassle free returns within 7 days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
