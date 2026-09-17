import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, MessageSquare, PhoneCall, 
  Sparkles, ShieldCheck, Truck, RefreshCw, Heart, ArrowRight 
} from 'lucide-react';
import { faqs } from '../data/products';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState(1); // Default open first question

  const categories = ['All', 'Sizing & Fit', 'Fabric & Comfort', 'Shipping & Delivery', 'Payment & COD', 'Returns & Exchange', 'Wash Care'];

  // Filter FAQs based on search & category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 bg-gradient-to-r from-[#8E1B46] via-[#D81B60] to-pink-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-100">
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-base text-pink-100 max-w-2xl mx-auto font-medium">
            Got questions about sizing, fabrics, shipping or returns? We have answers!
          </p>

          {/* Search Input Bar */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <input
              type="text"
              placeholder="Search questions, delivery timelines, fabric care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-7" />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#D81B60] text-white shadow-md scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-pink-50 hover:border-pink-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordions List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D81B60]" />
              <span>{activeCategory === 'All' ? 'All Popular Questions' : `${activeCategory} Questions`}</span>
            </h2>
            <span className="text-xs font-bold text-gray-400 font-mono">
              Showing {filteredFaqs.length} results
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle className="w-12 h-12 text-pink-300 mx-auto" />
              <p className="font-extrabold text-gray-800 text-base">No matching questions found</p>
              <p className="text-xs text-gray-500">Try searching for different keywords or clear your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="px-4 py-2 bg-pink-50 text-pink-700 font-bold text-xs rounded-xl"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const itemKey = faq.id || idx + 1;
                const isOpen = openFaqId === itemKey;
                return (
                  <div
                    key={itemKey}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'border-[#D81B60] bg-pink-50/30 shadow-xs'
                        : 'border-gray-200 hover:border-pink-200 bg-gray-50/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(itemKey)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-pink-100 text-[#D81B60] font-mono font-black text-xs flex items-center justify-center shrink-0">
                          Q{itemKey}
                        </span>
                        <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug">
                          {faq.q}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-100/70 px-2.5 py-0.5 rounded-md">
                          {faq.category || 'General'}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#D81B60]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-pink-100/80 bg-white/90 text-xs text-gray-700 font-medium leading-relaxed animate-fadeIn">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="bg-gradient-to-r from-gray-900 via-pink-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-extrabold text-lg sm:text-xl">Still Have Questions?</h3>
            <p className="text-xs text-gray-300 font-normal">
              Our parent happiness team is online to assist you with sizing, fabric details, and custom orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <Link
              to="/contact-us"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 hover:bg-pink-50 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4 text-pink-600" />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
