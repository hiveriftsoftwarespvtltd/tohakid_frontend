import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, RefreshCw, Truck, Award, MessageCircle, Globe, User, Banknote } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-white via-pink-50/40 to-pink-100/60 border-t border-pink-100 text-gray-700 pt-12 pb-6">
      {/* Brand Value Highlights */}
      <div className="max-w-[1600px] mx-auto px-4 pb-10 border-b border-pink-200/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-800">Premium Quality</h4>
            <p className="text-xs text-gray-500 mt-1">Handcrafted fabrics & zari work</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-800">Skin Friendly</h4>
            <p className="text-xs text-gray-500 mt-1">100% soft cotton inner lining</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-800">Free Shipping</h4>
            <p className="text-xs text-gray-500 mt-1">On all prepaid orders &gt; ₹1499</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-pink-100 shadow-xs">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-800">Easy Returns</h4>
            <p className="text-xs text-gray-500 mt-1">7 Days hassle-free exchange</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1600px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <Logo size="small" align="start" />
          <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
            Tohay Kids is India's premier destination for kids' ethnic, festive, and occasion wear. Made with love, soft fabrics, and vibrant Indian craftsmanship to make every occasion memorable.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-xs border border-pink-200 hover:bg-pink-600 hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xs border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-xs border border-red-200 hover:bg-red-600 hover:text-white transition-colors" aria-label="Youtube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
        </div>

        {/* Shop Category Links - Header Navigation Sync */}
        <div>
          <h5 className="font-heading font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Shop Outfits</h5>
          <ul className="space-y-2 text-xs font-medium text-gray-600">
            <li><Link to="/new-arrivals" className="hover:text-pink-600 transition-colors">New Arrivals</Link></li>
            <li><Link to="/boys" className="hover:text-pink-600 transition-colors">Boys Collection</Link></li>
            <li><Link to="/girls" className="hover:text-pink-600 transition-colors">Girls Collection</Link></li>
            <li><Link to="/siblings" className="hover:text-pink-600 transition-colors">Siblings Sets</Link></li>
            {/* <li><Link to="/collections" className="hover:text-pink-600 transition-colors">Festive Collections</Link></li> */}
          </ul>
        </div>

        {/* Customer Care Links */}
        <div>
          <h5 className="font-heading font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Customer Care</h5>
          <ul className="space-y-2 text-xs font-medium text-gray-600">
            <li><Link to="/track-order" className="hover:text-pink-600 transition-colors">Track Your Order</Link></li>
            <li><Link to="/contact-us" className="hover:text-pink-600 transition-colors">Help & Support</Link></li>
            <li><Link to="/about-us" className="hover:text-pink-600 transition-colors">About Tohay Kids</Link></li>
            <li><Link to="/faqs" className="hover:text-pink-600 transition-colors font-bold text-gray-800">Size Guide & FAQs</Link></li>
            <li><Link to="/contact-us" className="hover:text-pink-600 transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="max-w-[1600px] mx-auto px-4 pt-6 border-t border-pink-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p className="text-center md:text-left leading-relaxed">
          © {currentYear} Tohay Kids India. All Rights Reserved. Crafted with <Heart className="w-3.5 h-3.5 inline text-pink-500 fill-pink-500 mx-0.5" /> for Little Celebrations.
          <span className="mx-2 hidden sm:inline text-gray-300">|</span>
          <span className="block sm:inline mt-1 sm:mt-0 font-semibold text-gray-600">
            Designed By{' '}
            <a
              href="https://hiverift.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-[#D81B60] hover:underline"
            >
              HiveRift Softwares Pvt Ltd
            </a>
          </span>
        </p>
        
        {/* Visual Payment Methods Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {/* UPI Badge */}
          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center gap-0.5 text-[11px] font-black text-slate-800" title="UPI Instant Payments">
            <span className="text-[#00796B]">U</span>
            <span className="text-[#E65100]">P</span>
            <span className="text-[#00796B]">I</span>
          </div>

          {/* VISA Badge */}
          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center justify-center" title="Visa Card">
            <span className="font-extrabold italic text-xs text-blue-800 tracking-tighter font-serif">VISA</span>
          </div>

          {/* Mastercard Badge */}
          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center gap-0.5" title="Mastercard">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 -mr-1.5" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 opacity-90" />
          </div>

          {/* RuPay Badge */}
          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center text-[10px] font-black" title="RuPay Card">
            <span className="text-[#103E79]">Ru</span>
            <span className="text-[#F26522]">Pay</span>
          </div>

          {/* COD Badge */}
          <div className="h-7 px-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs flex items-center gap-1 text-[10px] font-extrabold text-emerald-700" title="Cash on Delivery">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
