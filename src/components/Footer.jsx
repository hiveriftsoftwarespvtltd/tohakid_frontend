import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Mail, Phone, Clock, Banknote, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#210616] via-[#17040F] to-[#0D0208] text-white border-t border-pink-900/50 pt-14 pb-10 font-sans shadow-2xl relative overflow-hidden">
      
      {/* Subtle Ambient Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#D81B60]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-[#D81B60]/5 blur-3xl pointer-events-none rounded-full" />

      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info & Contact (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Prominent Logo on Clean Contrasting Capsule */}
            <div className="pb-1 inline-block">
              <div className="inline-flex bg-white px-4 py-2.5 rounded-2xl shadow-lg border border-pink-200/20">
                <Logo
                  size="normal"
                  align="start"
                  taglineClassName="text-xs sm:text-sm font-bold text-[#D81B60] tracking-wider mt-0.5"
                />
              </div>
            </div>

            {/* Brand Story Prose with Rich High Contrast */}
            <p className="text-sm sm:text-base text-pink-100/80 leading-relaxed max-w-md font-normal">
              Tohay Kids is India's dedicated celebration wear boutique for little ones. Thoughtfully handcrafted with hypoallergenic soft mulmul cotton, generous +2" growth margins, and radiant festive charm.
            </p>

            {/* Direct Support Details */}
            <div className="space-y-2.5 pt-1 text-sm sm:text-base">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-pink-100 hover:text-white transition-colors font-medium group"
              >
                <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-300 group-hover:bg-[#D81B60] group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>+91 98765 43210 (WhatsApp Support)</span>
              </a>

              <div className="flex items-center gap-3 text-pink-100/90">
                <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/25 flex items-center justify-center text-pink-300 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>care@tohaykids.com</span>
              </div>

              <div className="flex items-center gap-3 text-pink-200/60 text-xs sm:text-sm">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-pink-300/60 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/tohay_kids?stkn=ZDhxaG9lamJuajN3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-pink-200 shadow-xs border border-white/15 hover:bg-[#D81B60] hover:text-white hover:border-[#D81B60] transition-all transform hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-blue-300 shadow-xs border border-white/15 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-red-400 shadow-xs border border-white/15 hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
                aria-label="Youtube"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop Categories (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white border-b border-pink-500/25 pb-2.5">
              Festive Wear
            </h5>
            <ul className="space-y-3 text-sm sm:text-base text-pink-200/75 font-medium">
              <li>
                <Link to="/girls" className="hover:text-white hover:translate-x-1 transition-all block">Girls Collection</Link>
              </li>
              <li>
                <Link to="/boys" className="hover:text-white hover:translate-x-1 transition-all block">Boys Collection</Link>
              </li>
              <li>
                <Link to="/siblings" className="hover:text-white hover:translate-x-1 transition-all block">Sibling Matching Sets</Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-white hover:translate-x-1 transition-all block">New Arrivals</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white hover:translate-x-1 transition-all block">Celebration Edit</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Parent Care & Policies (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white border-b border-pink-500/25 pb-2.5">
              Parent Care
            </h5>
            <ul className="space-y-3 text-sm sm:text-base text-pink-200/75 font-medium">
              <li>
                <Link to="/track-order" className="hover:text-white hover:translate-x-1 transition-all block">Track Your Order</Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-white hover:translate-x-1 transition-all block">Size Guide & Chart</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white hover:translate-x-1 transition-all block">FAQs & Shipping</Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white hover:translate-x-1 transition-all block">7-Day Easy Exchange</Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white hover:translate-x-1 transition-all block">Contact & Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: About Tohay & Concierge Help (2.5 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white border-b border-pink-500/25 pb-2.5">
              The Tohay Promise
            </h5>
            <ul className="space-y-3 text-sm sm:text-base text-pink-200/75 font-medium">
              <li>
                <Link to="/about-us" className="hover:text-white hover:translate-x-1 transition-all block">About Tohay Kids</Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white hover:translate-x-1 transition-all block">Pure Mulmul Cotton Lining</Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-white hover:translate-x-1 transition-all block">+2" Room to Grow Guarantee</Link>
              </li>
            </ul>

            {/* Quick Stylist Box in Luxury Translucent Glass Style */}
            <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20 backdrop-blur-md shadow-lg space-y-2.5 mt-4">
              <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D81B60]" />
                <span>Need Sizing or Styling Help?</span>
              </p>
              <p className="text-xs sm:text-sm text-pink-200/80 leading-snug">
                Our festive wear consultants are available on WhatsApp to assist you.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 py-2 rounded-xl shadow-sm transition-all hover:scale-102 mt-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Stylist</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Bar with Divider */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-pink-200/70 relative z-10">
        <p className="text-center md:text-left leading-relaxed">
          © {currentYear} Tohay Kids India. All Rights Reserved. Crafted with <Heart className="w-3.5 h-3.5 inline text-[#D81B60] fill-[#D81B60] mx-0.5" /> for Little Celebrations.
          <span className="mx-2 hidden sm:inline text-pink-400/40">|</span>
          <span className="block sm:inline mt-1 sm:mt-0 font-medium text-pink-200/90">
            Designed By{' '}
            <a
              href="https://hiverift.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-pink-300 hover:text-white hover:underline transition-colors"
            >
              HiveRift Softwares Pvt Ltd
            </a>
          </span>
        </p>

        {/* Visual Payment Methods Badges on Clean White Cards */}
        <div className="flex items-center gap-2 shrink-0">
          {/* UPI Badge */}
          <div className="h-8 px-3 bg-white rounded-lg border border-white/20 shadow-xs flex items-center gap-0.5 text-xs font-black text-slate-800" title="UPI Instant Payments">
            <span className="text-[#00796B]">U</span>
            <span className="text-[#E65100]">P</span>
            <span className="text-[#00796B]">I</span>
          </div>

          {/* VISA Badge */}
          <div className="h-8 px-3 bg-white rounded-lg border border-white/20 shadow-xs flex items-center justify-center" title="Visa Card">
            <span className="font-black italic text-xs text-blue-800 tracking-tighter font-sans">VISA</span>
          </div>

          {/* Mastercard Badge */}
          <div className="h-8 px-3 bg-white rounded-lg border border-white/20 shadow-xs flex items-center gap-0.5" title="Mastercard">
            <div className="w-4 h-4 rounded-full bg-red-500 opacity-90 -mr-2" />
            <div className="w-4 h-4 rounded-full bg-amber-400 opacity-90" />
          </div>

          {/* RuPay Badge */}
          <div className="h-8 px-3 bg-white rounded-lg border border-white/20 shadow-xs flex items-center text-[11px] font-black" title="RuPay Card">
            <span className="text-[#103E79]">Ru</span>
            <span className="text-[#F26522]">Pay</span>
          </div>

          {/* COD Badge */}
          <div className="h-8 px-3 bg-white rounded-lg border border-white/20 shadow-xs flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700" title="Cash on Delivery">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
