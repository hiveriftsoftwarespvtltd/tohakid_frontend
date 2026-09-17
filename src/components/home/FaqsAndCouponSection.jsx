import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { faqs } from '../../data/products';

export default function FaqsAndCouponSection() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className="max-w-[1600px] mx-auto px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              Quick Questions?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">
              Find quick answers to common queries about sizes, shipping & care.
            </p>
          </div>
          <button
            onClick={() => navigate('/faqs')}
            className="self-start sm:self-auto border border-pink-400 text-pink-700 bg-white hover:bg-pink-50 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            VIEW ALL FAQS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.slice(0, 4).map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#D81B60] bg-pink-50/40 shadow-xs'
                    : 'border-gray-200/80 hover:border-pink-200 bg-gray-50/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-gray-900 cursor-pointer"
                >
                  <span className="leading-tight">{faq.q}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#D81B60] shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-pink-600 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-pink-100/70 bg-white/90 text-xs font-medium text-gray-600 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
