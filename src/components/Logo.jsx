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
  // Upgraded image height presets for a more prominent, premium brand presence
  const sizeClasses = {
    small: 'h-11 sm:h-12 md:h-14',
    normal: 'h-16 sm:h-20 md:h-24 lg:h-28',
    large: 'h-24 sm:h-28 md:h-32 lg:h-36'
  };

  const taglineSizeClasses = {
    small: 'text-[10px] sm:text-[11px] tracking-wide',
    normal: 'text-xs sm:text-[13px] md:text-sm tracking-wider',
    large: 'text-sm sm:text-base md:text-lg tracking-widest'
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

