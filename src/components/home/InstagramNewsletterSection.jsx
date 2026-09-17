import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { usePageBanner } from '../../utils/usePageBanner';
import { formatImageUrl } from '../../utils/imageUtils';
import { products as fallbackProducts } from '../../data/products';
import p1 from '../../assets/p1.png';
import p2 from '../../assets/p2.png';
import p3 from '../../assets/p3.png';
import p4 from '../../assets/p4.png';
import p5 from '../../assets/p5.png';
import p6 from '../../assets/p6.png';
import p7 from '../../assets/p7.png';
import p8 from '../../assets/p8.png';

export default function InstagramNewsletterSection() {
  const galleryRef = useRef(null);
  const { products, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [shoppableLook, setShoppableLook] = useState(null);
  const [lookSelectedSize, setLookSelectedSize] = useState('');

  const instagramBanner = usePageBanner('Homepage Instagram Gallery', 'Little Moments.\nBig Memories.', 'Follow us for styling inspiration, new launches & little celebrations.', p1, 'https://instagram.com');
  const instagramPhotos = (instagramBanner.additionalImages && instagramBanner.additionalImages.length > 0)
    ? instagramBanner.additionalImages
    : [p1, p2, p3, p4, p5, p6, p7, p8];

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to TOHAY KIDS updates!');
      setNewsletterEmail('');
    }
  };

  return (
    <section className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Left Card: Little Moments. Big Memories. (7 Cols) */}
      <div className="lg:col-span-7 bg-[#FFF0F5] rounded-3xl p-5 sm:p-6 border border-pink-200/60 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden shadow-2xs">
        <div className="space-y-3 sm:max-w-[45%] text-center sm:text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-gray-900 leading-tight whitespace-pre-line">
            {instagramBanner.title}
          </h3>
          <p className="text-xs text-gray-600 font-normal leading-relaxed">
            {instagramBanner.subtitle}
          </p>
          <div className="pt-1">
            <a
              href={instagramBanner.link || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#D81B60] hover:bg-[#B5124E] text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-2xs transition-all transform hover:-translate-y-0.5"
            >
              {instagramBanner.btnPrimaryText || 'FOLLOW US @TOHAYKIDS'}
            </a>
          </div>
        </div>

        {/* Horizontal Gallery Scroll with Left/Right Navigation Buttons */}
        <div className="relative w-full sm:max-w-[55%] flex items-center">
          {/* Left Navigation Arrow Button */}
          <button
            onClick={() => scrollGallery('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-[#D81B60] hover:bg-pink-50 flex items-center justify-center transition-all z-20 border border-pink-100 cursor-pointer hover:scale-110"
            aria-label="Previous Photos"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Scrollable Photos Container */}
          <div
            ref={galleryRef}
            className="flex items-center gap-2.5 overflow-x-auto py-1 px-4 no-scrollbar scroll-smooth w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {instagramPhotos.map((imgSrc, i) => {
              const linkedProduct = (products && products.length > 0)
                ? products[i % products.length]
                : fallbackProducts[i % fallbackProducts.length];

              return (
                <div
                  key={i}
                  onClick={() => {
                    setShoppableLook({
                      image: imgSrc,
                      product: linkedProduct
                    });
                    setLookSelectedSize(linkedProduct?.sizes?.[0] || '4-6Y');
                  }}
                  className="w-24 sm:w-28 aspect-[3/4] flex-shrink-0 rounded-2xl overflow-hidden border border-pink-200/80 shadow-2xs group cursor-pointer relative"
                >
                  <img
                    src={formatImageUrl(imgSrc)}
                    alt={`Instagram Look ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Hover Overlay with SHOP THIS LOOK Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-2 text-white">
                    <span className="text-[9px] font-extrabold bg-[#D81B60] text-white px-2 py-1 rounded-lg flex items-center justify-center gap-1 shadow-md">
                      <ShoppingBag className="w-2.5 h-2.5" /> SHOP LOOK
                    </span>
                  </div>

                  {/* Top-Right Insta Pill Badge */}
                  <span className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 z-10">
                    <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                    1.{i + 2}k
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Navigation Arrow Button */}
          <button
            onClick={() => scrollGallery('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md text-[#D81B60] hover:bg-pink-50 flex items-center justify-center transition-all z-20 border border-pink-100 cursor-pointer hover:scale-110"
            aria-label="Next Photos"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Right Card: Get First Access to Styles They'll Love (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-pink-100 shadow-2xs flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading font-extrabold text-xl text-gray-900 leading-tight">
            Get First Access to Styles They'll Love
          </h3>
          <p className="text-xs text-gray-500 font-normal leading-relaxed">
            New arrivals, festive collections & exclusive offers – straight to your inbox.
          </p>
        </div>

        <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email address"
            required
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-xs focus:outline-hidden focus:border-pink-400 placeholder-gray-400 font-medium"
          />
          <button
            type="submit"
            className="bg-[#D81B60] hover:bg-[#B5124E] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-2xs uppercase tracking-wider flex-shrink-0"
          >
            JOIN US
          </button>
        </form>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 text-xs"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>WhatsApp Updates</span>
          </a>
          <span className="text-[10px] text-gray-400 font-normal">Instant VIP drops & deals</span>
        </div>
      </div>

    </section>
  );
}
