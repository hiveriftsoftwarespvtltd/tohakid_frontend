import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Logo({ 
  className = '', 
  size = 'normal', 
  showTagline = true, 
  align = 'center',
  taglineClassName = '' 
}) {
  // Compact, sleek image height presets to maximize screen space for products
  const sizeClasses = {
    small: 'h-7 sm:h-8 md:h-9',
    normal: 'h-9 sm:h-11 md:h-12 lg:h-13',
    large: 'h-14 sm:h-16 md:h-20 lg:h-24'
  };

  const taglineSizeClasses = {
    small: 'text-[7.5px] sm:text-[8.5px] tracking-wide',
    normal: 'text-[9px] sm:text-[10px] md:text-[10.5px] tracking-wider',
    large: 'text-xs sm:text-sm md:text-base tracking-widest'
  };

  const alignClasses = align === 'start' 
    ? 'items-start text-left' 
    : align === 'end' 
    ? 'items-end text-right' 
    : 'items-center text-center';

  return (
    <Link 
      to="/" 
      className={`inline-flex flex-col justify-center group cursor-pointer bg-white ${alignClasses} ${className}`} 
      aria-label="TOHAY KIDS Home"
    >
      <img
        src={logoImg}
        alt="Tohay Kids Logo"
        className={`object-contain bg-white transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size] || sizeClasses.normal}`}
      />
      {showTagline && (
        <span
          className={`font-serif italic font-medium text-[#C2185B] group-hover:text-[#D81B60] transition-colors duration-300 mt-1 select-none whitespace-nowrap leading-tight bg-white ${taglineSizeClasses[size] || taglineSizeClasses.normal} ${taglineClassName}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Elegance for Little Dreamers
        </span>
      )}
    </Link>
  );
}

