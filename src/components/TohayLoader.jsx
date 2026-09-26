import React from 'react';
import loaderGif from '../assets/tohay_kids_loader.gif';

/**
 * Premium Tohay Kids Brand Loader Component
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} text - Optional descriptive text below loader
 * @param {boolean} fullScreen - Renders as full-screen modal/overlay
 * @param {string} className - Additional CSS classes
 */
export default function TohayLoader({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    xl: 'w-36 h-36 sm:w-44 sm:h-44',
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center text-center p-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        <img
          src={loaderGif}
          alt="Tohay Kids Loading..."
          className={`object-contain select-none drop-shadow-sm ${sizeClasses[size] || sizeClasses.md}`}
        />
      </div>

      {text && (
        <p className="mt-3 text-xs sm:text-sm font-extrabold text-[#D81B60] tracking-wide font-sans animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/85 backdrop-blur-xs flex items-center justify-center animate-fadeIn p-4">
        <div className="bg-white/90 p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl flex flex-col items-center">
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
}
