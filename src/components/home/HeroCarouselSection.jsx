import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatImageUrl } from '../../utils/imageUtils';
import slider1 from '../../assets/slider1.png';
import arrivehero from '../../assets/arrivehero.png';
import celebration from '../../assets/celebration.png';

export default function HeroCarouselSection() {
  const navigate = useNavigate();
  const { banners } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const defaultHeroSlides = [
    {
      id: 1,
      title: 'Royal Indian Festive',
      highlightTitle: 'Collection 2026',
      subtitle: 'Handcrafted ethnic wear made for every little celebration.',
      image: slider1
    },
    {
      id: 2,
      title: 'Celebration & Wedding',
      highlightTitle: 'Festive Sparkle',
      subtitle: 'Royal kurtas, lehengas & twinning sibling outfits.',
      image: arrivehero
    },
    {
      id: 3,
      title: 'Little Prince & Princess',
      highlightTitle: 'New Arrivals',
      subtitle: 'Premium silk, organza & velvet ensembles crafted with love.',
      image: celebration
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
          image: formatImageUrl(b.imageUrl || b.image) || slider1,
        }))
      : defaultHeroSlides;

  const totalSlides = heroSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-slide every 4 seconds when not hovered
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides, isHovered, nextSlide]);

  if (!heroSlides || heroSlides.length === 0) return null;

  return (
    <section className="relative max-w-[1600px] mx-auto px-3 sm:px-4 pt-2 sm:pt-4">
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-pink-200/60 shadow-md h-[320px] sm:h-[370px] md:h-[420px] lg:h-[460px] bg-[#FFF5F7] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides rendering with smooth cross-fade animation */}
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Slide Background Image with subtle zoom on active */}
              <img
                src={slide.image || slider1}
                alt={slide.title || 'Hero Banner'}
                className={`absolute inset-0 w-full h-full object-cover object-right transition-transform duration-1000 ease-out ${
                  isActive ? 'scale-100' : 'scale-105'
                }`}
              />

              {/* Soft Gradient Overlay for readable text */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F7]/95 via-[#FFF5F7]/85 to-transparent w-full sm:w-[85%] md:w-[65%] z-0" />

              {/* Left Text & CTA Buttons Overlay */}
              <div
                className={`relative z-10 py-4 sm:py-8 md:py-10 pl-14 sm:pl-20 md:pl-24 lg:pl-28 pr-4 sm:pr-8 max-w-[92%] sm:max-w-xl md:max-w-2xl space-y-2.5 sm:space-y-4 transition-all duration-700 delay-100 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <h1 className="font-sans font-extrabold text-xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                  {(() => {
                    if (slide.highlightTitle) {
                      return (
                        <>
                          <span className="text-[#1E293B]">{slide.title}</span>{' '}
                          <span className="text-[#D81B60]">{slide.highlightTitle}</span>
                        </>
                      );
                    }
                    const words = (slide.title || '').split(' ');
                    if (words.length >= 3) {
                      const mid = Math.ceil(words.length / 2);
                      const firstPart = words.slice(0, mid).join(' ');
                      const secondPart = words.slice(mid).join(' ');
                      return (
                        <>
                          <span className="text-[#1E293B]">{firstPart}</span>{' '}
                          <span className="text-[#D81B60]">{secondPart}</span>
                        </>
                      );
                    }
                    return <span className="text-[#D81B60]">{slide.title}</span>;
                  })()}
                </h1>

                <div className="space-y-0.5 sm:space-y-1 text-xs sm:text-sm md:text-base leading-relaxed">
                  <p className="font-bold text-[#334155]">
                    {slide.subtitle}
                  </p>
                  {slide.description && (
                    <p className="text-[#64748B] hidden sm:block">
                      {slide.description}
                    </p>
                  )}
                </div>

                {/* Navigation CTA Buttons */}
                <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/boys')}
                    className="bg-white hover:bg-pink-50 text-[#1E293B] hover:text-[#D81B60] font-extrabold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-gray-300 hover:border-pink-300 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    BOYS
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/girls')}
                    className="bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    GIRLS
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/siblings')}
                    className="bg-white hover:bg-pink-50 text-[#D81B60] font-extrabold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-pink-300 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    SIBLINGS
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Left Navigation Circular Arrow Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* Right Navigation Circular Arrow Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white shadow-md text-[#D81B60] flex items-center justify-center transition-all z-20 hover:scale-110 border border-pink-100 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
        </button>

        {/* Pagination Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-[#D81B60]'
                  : 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white/80 hover:bg-white border border-pink-200 shadow-2xs'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
