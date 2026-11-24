import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Quote,
} from 'lucide-react';

const parentReviews = [
  {
    id: 'rev-1',
    name: 'Priya Sharma',
    city: 'New Delhi',
    rating: 5,
    verifiedDate: 'October 2026',
    comment:
      'The fabric quality and finishing are truly exceptional! The 100% soft cotton lining gives total peace of mind for delicate skin. Zero itching or fussing, and my daughter loved wearing it all day during Diwali.',
  },
  {
    id: 'rev-2',
    name: 'Neha Verma',
    city: 'Mumbai',
    rating: 5,
    verifiedDate: 'September 2026',
    comment:
      'The fit is absolutely perfect! Finding ethnic clothes that active toddlers don’t complain about is hard, but my son was dancing and running around comfortably throughout the family wedding function.',
  },
  {
    id: 'rev-3',
    name: 'Anjali Tiwari',
    city: 'Bangalore',
    rating: 5,
    verifiedDate: 'October 2026',
    comment:
      'The real outfit looks even more royal and elegant than in the pictures! The colors are rich, stitching is top-notch, and the comfortable tailored fit is exceptionally thoughtful for fast-growing kids.',
  },
  {
    id: 'rev-4',
    name: 'Vikramaditya Sengupta',
    city: 'Kolkata',
    rating: 5,
    verifiedDate: 'October 2026',
    comment:
      'Impeccable craftsmanship and breathable organic fabric. The seams are super soft, traditional silhouette looks regal, and it washed cleanly without any color bleeding.',
  },
  {
    id: 'rev-5',
    name: 'Ritika Kapoor',
    city: 'Jaipur',
    rating: 5,
    verifiedDate: 'August 2026',
    comment:
      'Delighted by the gentle touch and neat embroidery borders. My toddler wore her festive outfit for over 5 hours without asking to change once. Tohay Kids is definitely our family go-to now!',
  },
  {
    id: 'rev-6',
    name: 'Sneha Patel',
    city: 'Ahmedabad',
    rating: 5,
    verifiedDate: 'September 2026',
    comment:
      'The vibrant prints and rich festive tones brought so much joy! Every family relative asked where we bought it. The fabric does not crush easily, which is a blessing with playful kids.',
  },
  {
    id: 'rev-7',
    name: 'Pooja & Manish Malhotra',
    city: 'Chandigarh',
    rating: 5,
    verifiedDate: 'November 2026',
    comment:
      'Ordered matching brother-sister festive outfits for Raksha Bandhan. The family pictures came out picture-perfect! Both kids stayed happy and comfortable all evening.',
  },
  {
    id: 'rev-8',
    name: 'Divya Menon',
    city: 'Chennai',
    rating: 5,
    verifiedDate: 'August 2026',
    comment:
      'Superior finishing compared to any high-street kids ethnic store. All heavy zaris and sequins are safely isolated on the outside, leaving only pure soft cotton against sensitive skin. 10/10!',
  },
];

export default function ParentReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const autoPlayRef = useRef(null);

  // Responsive breakpoints for cards per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1);
      } else if (width < 1024) {
        setVisibleCards(2);
      } else if (width < 1380) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, parentReviews.length - visibleCards);

  // Clamp current index when screen size changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isHovered || maxIndex === 0) return;

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, maxIndex, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <section className="max-w-[1600px] mx-auto px-4 relative select-none">
      {/* Section Header with Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8 border-b border-pink-100/70 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/80 text-[#D81B60] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-[#D81B60]" />
            <span>Real Experiences</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
            Loved by Parents
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Authentic feedback & styling experiences from verified parents
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] font-bold text-gray-400 mr-2 hidden sm:inline">
            {currentIndex + 1} - {Math.min(currentIndex + visibleCards, parentReviews.length)} of {parentReviews.length}
          </span>
          <button
            type="button"
            onClick={prevSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-pink-200/90 text-gray-700 shadow-xs hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Previous Reviews"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-pink-200/90 text-gray-700 shadow-xs hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] flex items-center justify-center transition-all cursor-pointer active:scale-95"
            aria-label="Next Reviews"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        className="overflow-hidden py-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {parentReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex-shrink-0 px-2 sm:px-2.5"
              style={{ width: `${100 / visibleCards}%` }}
            >
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-pink-100/90 shadow-xs hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between h-full min-h-[260px] space-y-4 relative group hover:-translate-y-1">
                {/* 1. Header Row: Rating Stars + Verified Parent Badge */}
                <div className="flex items-center justify-between border-b border-pink-50 pb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-gray-800">5.0</span>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Parent
                  </span>
                </div>

                {/* 2. Review Quote Text with Decorative Icon */}
                <div className="relative flex-1 flex flex-col justify-center">
                  <Quote className="w-6 h-6 text-pink-200/80 mb-1.5 -scale-x-100 shrink-0" />
                  <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed font-medium italic relative z-10">
                    “{rev.comment}”
                  </p>
                </div>

                {/* 3. Parent Profile Footer */}
                <div className="pt-3 flex items-center justify-between border-t border-pink-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      {rev.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-xs text-gray-900 leading-tight">
                        {rev.name}
                      </h4>
                      <p className="text-[10px] font-semibold text-gray-400">
                        {rev.city} • {rev.verifiedDate}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-[#D81B60] bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                    5/5 Rating
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {Array.from({ length: maxIndex + 1 }, (_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-[#D81B60] shadow-2xs'
                  : 'w-2 h-2 bg-pink-200 hover:bg-pink-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}


