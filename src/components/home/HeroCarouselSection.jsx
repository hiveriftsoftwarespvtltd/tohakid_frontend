import React, { useState, useEffect, useCallback } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Dynamically resolve banners from Database or fallback to default
  const apiHeroBanners = Array.isArray(banners)
    ? banners.filter(
        (b) =>
          (b.status === 'Active' || !b.status) &&
          (b.placement === 'Homepage Main Hero Carousel' ||
            b.position === 'Hero Slider' ||
            !b.placement)
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

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-slide every 4.5 seconds when not hovered
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered, nextSlide]);

  if (!heroSlides || heroSlides.length === 0) return null;

  return (
    <section className="relative max-w-[1600px] mx-auto px-3 sm:px-4 pt-2 sm:pt-4">
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-200/60 shadow-md aspect-square sm:aspect-auto min-h-[380px] sm:min-h-0 sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[560px] bg-[#FFF5F7] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides rendering with clean, clear images (NO text overlaid on images) */}
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const targetLink = slide.link || slide.btnPrimaryLink || '/collections';
          return (
            <div
              key={slide.id || idx}
              onClick={() => navigate(targetLink)}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Responsive Slide Banner Image (Serves Mobile Image on Phone Screens) */}
              <picture className="absolute inset-0 w-full h-full">
                {slide.mobileImage && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={slide.mobileImage}
                  />
                )}
                <img
                  src={slide.image || aa}
                  alt={slide.title || 'Brand Hero Banner'}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
                    isActive ? 'scale-100' : 'scale-105'
                  }`}
                />
              </picture>
            </div>
          );
        })}

        {/* Left Navigation Circular Arrow Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer"
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
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer"
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
                setCurrentSlide(idx);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-[#D81B60] shadow-xs'
                  : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/90 hover:bg-white border border-black/15 shadow-xs'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Three Fixed Navigation Boxes at the bottom of the banner: “Girls”, “Boys”, and “Siblings” */}
      <div className="flex justify-center pt-1 sm:pt-2">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-xs sm:max-w-md md:max-w-lg">
          {/* Box 1: Girls */}
          <Link
            to="/girls"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-white hover:bg-pink-50/50 text-gray-900 shadow-sm hover:shadow-md border border-pink-200/80 hover:border-[#D81B60] transition-all duration-300 hover:scale-102 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-gray-900 group-hover/box:text-[#D81B60] transition-colors whitespace-nowrap leading-none">
                Girls
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D81B60] opacity-0 -translate-x-1 group-hover/box:opacity-100 group-hover/box:translate-x-0 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          {/* Box 2: Boys */}
          <Link
            to="/boys"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-white hover:bg-amber-50/50 text-gray-900 shadow-sm hover:shadow-md border border-amber-200/80 hover:border-amber-500 transition-all duration-300 hover:scale-102 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-gray-900 group-hover/box:text-amber-700 transition-colors whitespace-nowrap leading-none">
                Boys
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700 opacity-0 -translate-x-1 group-hover/box:opacity-100 group-hover/box:translate-x-0 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>

          {/* Box 3: Siblings */}
          <Link
            to="/siblings"
            className="group/box flex items-center justify-center py-2.5 sm:py-3.5 px-3 sm:px-6 rounded-xl sm:rounded-2xl bg-white hover:bg-purple-50/50 text-gray-900 shadow-sm hover:shadow-md border border-purple-200/80 hover:border-purple-500 transition-all duration-300 hover:scale-102 active:scale-95 text-center cursor-pointer"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase text-gray-900 group-hover/box:text-[#8E24AA] transition-colors whitespace-nowrap leading-none">
                Siblings
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8E24AA] opacity-0 -translate-x-1 group-hover/box:opacity-100 group-hover/box:translate-x-0 transition-all duration-200 hidden sm:inline-block" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
