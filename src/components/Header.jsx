import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  ChevronRight, Sparkles, MessageCircle, Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Logo from './Logo';

export default function Header() {
  const { wishlist, totalCartItems, searchQuery, setSearchQuery, setIsCartOpen, products, isLoggedIn } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchFocused(false);
      }
    }
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close search on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setSearchFocused(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background screen scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Primary Navigation items with brand-matching colorful themes
  const navLinks = [
    {
      name: 'NEW ARRIVALS',
      path: '/new-arrivals',
      activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs',
      hoverClass: 'hover:text-amber-800 hover:bg-amber-100/60',
    },
    {
      name: 'BOYS',
      path: '/boys',
      activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
      hoverClass: 'hover:text-blue-800 hover:bg-blue-100/60',
    },
    {
      name: 'GIRLS',
      path: '/girls',
      activeClass: 'bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-xs',
      hoverClass: 'hover:text-pink-800 hover:bg-pink-100/60',
    },
    {
      name: 'SIBLINGS',
      path: '/siblings',
      activeClass: 'bg-gradient-to-r from-[#8E24AA] to-[#AB47BC] text-white shadow-xs',
      hoverClass: 'hover:text-purple-800 hover:bg-purple-100/60',
    },
  ];

  // Live search suggestions
  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      setIsSearchOpen(false);
      navigate(`/new-arrivals?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`sticky top-0 shadow-sm font-sans transition-all ${mobileMenuOpen ? 'z-50' : 'z-40'}`}>

      {/* 1. TOP COLORFUL FESTIVE ANNOUNCEMENT RIBBON */}
      <div className="bg-gradient-to-r from-[#D81B60] via-[#8E24AA] to-[#F59E0B] text-white text-[10.5px] sm:text-[11px] font-bold py-1.5 px-4 shadow-2xs">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Left Feature */}
          <div className="hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200 animate-pulse" />
            <span className="tracking-wide">Handcrafted Indian Festive Wear for Kids</span>
          </div>

          {/* Center Callout */}
          <div className="flex-1 sm:flex-initial text-center font-extrabold tracking-wide">
            ✨ FREE Express Shipping on Orders Above ₹1499 ✨
          </div>

          {/* Right Links */}
          <div className="hidden md:flex items-center gap-4 text-[10.5px]">
            <Link to="/track-order" className="hover:underline opacity-95 hover:opacity-100 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Track Order
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="hover:underline opacity-95 hover:opacity-100 flex items-center gap-1 text-yellow-200 font-extrabold"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp Help
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER ROW (Search | Centered Sleek Logo | Utilities) */}
      <div className="bg-gradient-to-r from-[#FFF4F7] via-[#FFF9FB] to-[#FFF7EE] border-b border-pink-200/70 shadow-2xs backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5">
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">

            {/* LEFT: Search & Account Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-800 hover:text-[#D81B60] hover:bg-pink-100/70 rounded-xl transition-all cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.8]" />
              </button>

              {/* Search Icon Button (Default state: Icon only) */}
              {!isSearchOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 60);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 hover:text-[#D81B60] border border-pink-200/80 hover:border-pink-300 rounded-full shadow-2xs transition-all cursor-pointer group"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="w-4 h-4 stroke-[2] text-[#D81B60] group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline text-xs font-bold text-gray-700 group-hover:text-[#D81B60]">Search</span>
                </button>
              )}

              {/* Desktop Expandable Search Input */}
              {isSearchOpen && (
                <div ref={searchContainerRef} className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-xs hidden sm:block animate-in fade-in duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search kids fashion..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      className="w-full pl-9 pr-8 py-2 bg-white border border-pink-300 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#D81B60] focus:ring-2 focus:ring-pink-200 transition-all shadow-xs"
                      autoFocus
                    />
                    <Search className="w-4 h-4 text-[#D81B60] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchFocused(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </form>

                  {/* Autocomplete Search Dropdown */}
                  {searchFocused && searchQuery.trim().length > 1 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-pink-200 overflow-hidden z-50 p-2"
                      onMouseLeave={() => setSearchFocused(false)}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Matching Products</div>
                      {searchResults.length > 0 ? (
                        searchResults.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            onClick={() => {
                              setSearchFocused(false);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-pink-50 rounded-xl transition-colors"
                          >
                            <img src={item.images?.[0] || item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg bg-pink-50" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                              <p className="text-[11px] text-[#D81B60] font-bold">₹{item.price}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </Link>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-gray-500 text-center">No products found</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Account / Sign In Pill Button */}
              <Link
                to={isLoggedIn ? "/profile" : "/login"}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 hover:text-[#8E24AA] border border-pink-200/80 hover:border-purple-300 rounded-full shadow-2xs transition-all shrink-0 group"
                title={isLoggedIn ? "Account" : "Sign In"}
              >
                <User className="w-4 h-4 stroke-[2] text-[#8E24AA] group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-bold text-gray-700 group-hover:text-[#8E24AA]">{isLoggedIn ? "Account" : "Sign In"}</span>
              </Link>
            </div>

            {/* CENTER: Prominent Centered TOHAY KIDS Logo with Crisp Showcase Card */}
            <div className="flex justify-center text-center">
              <div className="bg-white/95 hover:bg-white px-3 sm:px-6 py-1 sm:py-1.5 rounded-2xl shadow-xs hover:shadow-sm border border-pink-200/80 hover:border-pink-300 transition-all">
                <Logo size="normal" />
              </div>
            </div>

            {/* RIGHT: Wishlist & Cart Actions */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 text-[#1E293B]">
              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 hover:text-[#E91E63] border border-pink-200/80 hover:border-pink-300 rounded-full transition-all shadow-2xs group"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <div className="relative">
                  <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] text-[#E91E63] group-hover:scale-110 transition-transform" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-xs font-bold text-gray-700 group-hover:text-[#E91E63]">Wishlist</span>
              </Link>

              {/* Cart Button with Vibrant Gradient Pill */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#D81B60] via-[#E91E63] to-[#FF4081] hover:from-[#C2185B] hover:to-[#D81B60] text-white rounded-full shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer font-extrabold text-xs"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-[#D81B60] font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-2xs">
                  {totalCartItems}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isSearchOpen && (
        <div className="p-3 bg-white border-t border-pink-200 sm:hidden animate-in slide-in-from-top-2 duration-200 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-[#D81B60] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" />
            <input
              type="text"
              placeholder="Search kids outfits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-gray-50 border border-pink-300 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#D81B60]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              aria-label="Close search"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </form>

          {searchQuery.trim().length > 1 && searchResults.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-pink-200 overflow-hidden divide-y divide-gray-100">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 p-2.5 hover:bg-pink-50 transition-colors"
                >
                  <img src={item.images?.[0] || item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg bg-pink-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-[#D81B60] font-bold">₹{item.price}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. VIBRANT THEMED CATEGORY NAVIGATION BAR */}
      <nav className="hidden lg:block border-t border-b border-pink-200/60 bg-gradient-to-r from-[#FFF0F5]/90 via-[#FDF4FF]/85 to-[#FFFBEB]/90 py-1.5 shadow-2xs backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 p-1 bg-white/90 backdrop-blur-md rounded-full border border-pink-200/80 shadow-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-1.5 rounded-full inline-flex items-center justify-center text-[11px] font-extrabold uppercase tracking-[0.12em] transition-all duration-300 ${
                    isActive
                      ? `${link.activeClass} scale-[1.03]`
                      : `text-gray-700 ${link.hoverClass}`
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* 4. MOBILE SLIDE-OUT DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full h-full max-h-dvh bg-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header with Vibrant Gradient */}
            <div className="p-4 border-b border-pink-200 flex items-center justify-between bg-gradient-to-r from-[#FFF0F5] via-[#FFF5F8] to-[#FFFBEB] shrink-0">
              <div onClick={() => setMobileMenuOpen(false)} className="bg-white/95 px-3 py-1 rounded-xl shadow-2xs border border-pink-200/70">
                <Logo size="small" align="start" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-[#D81B60] hover:bg-pink-100/60 rounded-full transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links with Category Themed Colors */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-2">Collections</p>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase transition-all ${
                      isActive
                        ? `${link.activeClass}`
                        : `text-gray-800 ${link.hoverClass} border border-pink-100/60`
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </NavLink>
              ))}
            </div>

            {/* Drawer Footer with Festive Touch */}
            <div className="p-4 border-t border-pink-100 bg-gradient-to-r from-pink-50 to-amber-50 text-xs text-gray-700 text-center space-y-1 shrink-0">
              <p className="font-extrabold text-[#D81B60]">Crafted for Little Celebrations ✨</p>
              <p className="text-[10px] text-gray-500">Premium Ethnic & Festive Wear</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
