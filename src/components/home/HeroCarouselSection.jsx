import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatImageUrl } from '../../utils/imageUtils';
import aa from '../../assets/aa.png';
import bb from '../../assets/bb.png';
import cc from '../../assets/cc.png';
import dd from '../../assets/dd.png';

// ✅ OUTSIDE component — stable reference, never re-created on render
const DEFAULT_HERO_SLIDES = [
  { id: 1, image: aa, link: '/boys' },
  { id: 2, image: bb, link: '/girls' },
  { id: 3, image: cc, link: '/new-arrivals' },
  { id: 4, image: dd, link: '/siblings' },
];

// Local fallback images mapped by position index
const FALLBACK_IMAGES = [aa, bb, cc, dd];

// Sub-component for individual slide: renders local fallback immediately, fades in API image when loaded
const CarouselSlide = React.memo(({ slide, fallback, isPriority }) => {
  const [apiLoaded, setApiLoaded] = useState(false);
  const apiSrc = slide.image;
  const isDifferentFromFallback = Boolean(apiSrc && apiSrc !== fallback);

  return (
    <div className="w-full h-full shrink-0 relative overflow-hidden select-none">
      {/* 1. Base Layer: Local fallback image — instant 0ms render from memory, never blank */}
      <img
        src={fallback}
        alt={slide.title || 'Kids Ethnic Wear'}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        draggable={false}
      />

      {/* 2. Top Layer: API / Cloudinary image — only fades in once 100% downloaded */}
      {isDifferentFromFallback && (
        <picture
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            apiLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.mobileImage && (
            <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
          )}
          <img
            src={apiSrc}
            alt={slide.title || 'Kids Ethnic Wear'}
            loading={isPriority ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            onLoad={() => setApiLoaded(true)}
            onError={() => setApiLoaded(false)}
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </picture>
      )}

      {/* Clickable banner link if configured */}
      {slide.link && (
        <Link
          to={slide.link}
          className="absolute inset-0 z-10"
          aria-label={slide.title || 'Shop Collection'}
        />
      )}
    </div>
  );
});

export default function HeroCarouselSection() {
  const { banners } = useShop();
  const [isHovered, setIsHovered] = useState(false);

  const heroSlides = useMemo(() => {
    const apiHeroBanners = Array.isArray(banners)
      ? banners.filter(
          (b) =>
            (b.status === 'Active' || !b.status) &&
            b.placement === 'Homepage Main Hero Carousel' &&
            b.position !== 'Gender Collection Card' &&
            !b.placement?.toLowerCase().includes('card') &&
            !!(b.imageUrl || b.image)
        )
      : [];

    if (apiHeroBanners.length > 0) {
      return apiHeroBanners.map((b) => ({
        ...b,
        image: formatImageUrl(b.imageUrl || b.image) || aa,
        mobileImage: formatImageUrl(b.mobileImageUrl || b.mobileImage) || null,
      }));
    }
    return DEFAULT_HERO_SLIDES;
  }, [banners]);

  const totalSlides = heroSlides.length;

  const extendedSlides = useMemo(() => {
    if (totalSlides <= 1) return heroSlides;
    return [heroSlides[totalSlides - 1], ...heroSlides, heroSlides[0]];
  }, [heroSlides, totalSlides]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isMovingRef = useRef(false);

  // Safety bound check: ensure currentIndex is never outside extended range
  useEffect(() => {
    if (currentIndex < 0 || currentIndex > totalSlides + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  }, [currentIndex, totalSlides]);

  const nextSlide = useCallback(() => {
    if (isMovingRef.current || totalSlides <= 1) return;
    isMovingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev >= totalSlides + 1) return 1;
      return prev + 1;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (isMovingRef.current || totalSlides <= 1) return;
    isMovingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      if (prev <= 0) return totalSlides;
      return prev - 1;
    });
  }, [totalSlides]);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    isMovingRef.current = false;
    if (currentIndex >= totalSlides + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(totalSlides);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsTransitioning(true));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitioning]);

  // Safety timeout: In case browser drops transitionend (e.g. background tab)
  useEffect(() => {
    if (isTransitioning && (currentIndex === 0 || currentIndex >= totalSlides + 1)) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        if (currentIndex === 0) setCurrentIndex(totalSlides);
        if (currentIndex >= totalSlides + 1) setCurrentIndex(1);
        isMovingRef.current = false;
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isTransitioning, totalSlides]);

  useEffect(() => {
    if (isMovingRef.current) {
      const timer = setTimeout(() => { isMovingRef.current = false; }, 900);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45 && touchEndX.current !== 0) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Auto-play: Pauses when user hovers OR when tab is hidden in background
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;
    const timer = setInterval(() => {
      if (document.hidden) return; // Prevent slider from running off in background tab
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [totalSlides, isHovered, nextSlide]);

  if (!heroSlides || heroSlides.length === 0) return null;

  const activeDot = (currentIndex - 1 + totalSlides) % totalSlides;

  return (
    <section className="relative max-w-[1600px] mx-auto px-3 sm:px-4 pt-2 sm:pt-4">
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-100/80 shadow-md aspect-square sm:aspect-auto sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[560px] select-none bg-[#FAF8F5]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Slide Track ── */}
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
          {extendedSlides.map((slide, idx) => {
            const realIdx = ((idx - 1) % totalSlides + totalSlides) % totalSlides;
            const fallback = FALLBACK_IMAGES[realIdx % FALLBACK_IMAGES.length];
            const slideKey = `hero-slide-${idx}-${slide.id || slide._id || realIdx}`;

            return (
              <CarouselSlide
                key={slideKey}
                slide={slide}
                fallback={fallback}
                isPriority={idx === 1}
              />
            );
          })}
        </div>

        {/* ── Left Arrow ── */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="absolute left-2.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* ── Right Arrow ── */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="absolute right-2.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/95 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* ── Dots Indicator ── */}
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

      {/* ── Bottom Nav: Girls / Boys / Siblings ── */}
      <div className="flex justify-center pt-2 sm:pt-3">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-xs sm:max-w-md md:max-w-lg">
          <Link
            to="/girls"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#D81B60] via-[#E91E63] to-[#EC407A] text-white shadow-md shadow-pink-500/25 hover:shadow-lg hover:shadow-pink-500/40 border border-pink-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">Girls</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          <Link
            to="/boys"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/40 border border-sky-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">Boys</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          <Link
            to="/siblings"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#8E24AA] via-[#9C27B0] to-[#BA68C8] text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 border border-purple-300/30 transition-all duration-300 hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-white whitespace-nowrap leading-none drop-shadow-xs">Siblings</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 -translate-x-1 group-hover/box:translate-x-0.5 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
