import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  // Phone number: +91 92618 74142
  const phoneNumber = '919261874142';
  const defaultMessage = encodeURIComponent(
    'Hello Tohay Kids! I would like to inquire about your festive & premium collection.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div
      className="fixed z-50 bottom-20 right-4 md:bottom-8 md:right-8 flex items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip / Badge */}
      <div
        className={`hidden md:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-gray-800 text-xs font-semibold shadow-lg border border-emerald-100 transition-all duration-300 transform ${
          isHovered
            ? 'opacity-100 translate-x-0 scale-100'
            : 'opacity-0 translate-x-3 pointer-events-none scale-95'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#2be370] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        {/* Subtle Pulse Animation Wave behind button */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:opacity-50 pointer-events-none"
          style={{ animationDuration: '2.5s' }}
        />

        {/* Real FontAwesome WhatsApp Icon from react-icons */}
        <FaWhatsapp className="w-8 h-8 md:w-9 md:h-9 relative z-10 transition-transform duration-300 group-hover:rotate-12 drop-shadow-md" />

        {/* Online Status Dot Indicator */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
}
