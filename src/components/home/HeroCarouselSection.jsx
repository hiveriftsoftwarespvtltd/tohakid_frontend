import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatImageUrl } from '../../utils/imageUtils';
import aa from '../../assets/aa.png';
import bb from '../../assets/bb.png';
import cc from '../../assets/cc.png';
import dd from '../../assets/dd.png';

export default function HeroCarouselSection() {
  const navigate = useNavigate();
  const { banners } = useShop();
  const [isHovered, setIsHovered] = useState(false);

  const defaultHeroSlides = [
    {
      id: 1,
      image: aa,
      link: '/boys'
    },
    {
      id: 2,
      image: bb,
      link: '/girls'
    },
    {
      id: 3,
      image: cc,
      link: '/new-arrivals'
    },
    {
      id: 4,
      image: dd,
      link: '/siblings'
    }
  ];

  // Dynamically resolve banners strictly for Hero Carousel (never include Gender/Promo cards)
  const apiHeroBanners = Array.isArray(banners)
    ? banners.filter(
        (b) =>
          (b.status === 'Active' || !b.status) &&
          (b.placement === 'Homepage Main Hero Carousel' ||
            (!b.placement && b.position === 'Hero Slider'))
      )
    : (banners?.hero || []);

  const heroSlides =
    apiHeroBanners.length > 0
      ? apiHeroBanners.map((b) => ({
          ...b,
          image: formatImageUrl(b.imageUrl || b.image) || aa,
          mobileImage: formatImageUrl(b.mobileImageUrl || b.mobileImage) || null,
        }))
      : defaultHeroSlides;

  const totalSlides = heroSlides.length;

  // Clone first and last slide for seamless infinite loop (no rewind jerk)
  const extendedSlides = React.useMemo(() => {
    if (totalSlides <= 1) return heroSlides;
    return [heroSlides[totalSlides - 1], ...heroSlides, heroSlides[0]];
  }, [heroSlides, totalSlides]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isMovingRef = useRef(false);

  const nextSlide = useCallback(() => {
    if (isMovingRef.current || totalSlides <= 1) return;
    isMovingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (isMovingRef.current || totalSlides <= 1) return;
    isMovingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [totalSlides]);

  const handleTransitionEnd = (e) => {
    // Only handle transition of the track itself, not bubbling from children
    if (e.target !== e.currentTarget) return;
    isMovingRef.current = false;
    if (currentIndex === totalSlides + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalSlides);
    }
  };

  // Re-enable transition after teleporting back to clone
  useEffect(() => {
    if (!isTransitioning) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitioning]);

  // Safety fallback to unlock sliding if transitionend is missed (e.g. background tab)
  useEffect(() => {
    if (isMovingRef.current) {
      const timer = setTimeout(() => {
        isMovingRef.current = false;
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45 && touchEndX.current !== 0) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Auto-slide every 4.0 seconds when not hovered
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered, nextSlide]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const activeDot = (currentIndex - 1 + totalSlides) % totalSlides;

  return (
    <section className="relative max-w-[1600px] mx-auto px-3 sm:px-4 pt-2 sm:pt-4">
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-100/80 shadow-md aspect-square sm:aspect-auto sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[560px] bg-[#FAF8F5] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Continuous track with hardware-accelerated transform translation */}
        <div
          className="flex w-full h-full"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            transition: isTransitioning ? 'transform 750ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {extendedSlides.map((slide, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 relative select-none"
            >
              {/* Responsive Slide Banner Image (Serves Mobile Image on Phone Screens) */}
              <picture className="block absolute inset-0 w-full h-full">
                  {slide.mobileImage && (
                    <source
                      media="(max-width: 640px)"
                      srcSet={slide.mobileImage}
                    />
                  )}
                  <img
                    src={slide.image || aa}
                    alt={slide.title || 'Brand Hero Banner'}
                    loading={idx === 1 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />
                </picture>
              </div>
          ))}
        </div>

        {/* Left Navigation Circular Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* Right Navigation Circular Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-2.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* Slide Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2 pointer-events-auto">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isMovingRef.current) return;
                isMovingRef.current = true;
                setIsTransitioning(true);
                setCurrentIndex(idx + 1);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-[#D81B60] shadow-xs'
                  : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/90 hover:bg-white border border-black/15 shadow-xs'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Three Fixed Navigation Boxes at the bottom of the banner: “Girls”, “Boys”, and “Siblings” */}
      <div className="flex justify-center pt-2 sm:pt-3">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-xs sm:max-w-md md:max-w-lg">
          {/* Box 1: Girls */}
          <Link
            to="/girls"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E91E63] to-[#EC407A] text-white shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 border border-pink-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">
                Girls
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          {/* Box 2: Boys */}
          <Link
            to="/boys"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 border border-sky-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">
                Boys
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          {/* Box 3: Siblings */}
          <Link
            to="/siblings"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#8E24AA] via-[#9C27B0] to-[#BA68C8] text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 border border-purple-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">
                Siblings
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
