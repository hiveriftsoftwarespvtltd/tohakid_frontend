import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  ChevronRight
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

  // Simplified Primary Navigation items
  const navLinks = [
    { name: 'NEW ARRIVALS', path: '/new-arrivals' },
    { name: 'BOYS', path: '/boys' },
    { name: 'GIRLS', path: '/girls' },
    { name: 'SIBLINGS', path: '/siblings' },
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
    <header className={`sticky top-0 bg-white border-b border-gray-100 shadow-2xs font-sans transition-all ${mobileMenuOpen ? 'z-50' : 'z-40'}`}>

      {/* 2. MAIN HEADER ROW (Search | Centered Prominent Logo | Utilities) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="grid grid-cols-3 items-center gap-4">

          {/* LEFT: Clean Minimal Search Icon / Expandable Input & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-800 hover:text-[#D81B60] hover:bg-pink-50/60 rounded-xl transition-all cursor-pointer"
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
                className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#D81B60] hover:bg-pink-50/60 rounded-xl transition-all cursor-pointer group"
                aria-label="Search"
                title="Search"
              >
                <Search className="w-5 h-5 stroke-[1.75] group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-xs font-semibold">Search</span>
              </button>
            )}

            {/* Desktop Expandable Search Input (Shown when search icon is clicked) */}
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
                    className="w-full pl-9 pr-8 py-2 bg-gray-50/95 hover:bg-gray-100/80 border border-pink-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 transition-all shadow-xs"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-[#D81B60] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchFocused(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </form>

                {/* Autocomplete Search Dropdown */}
                {searchFocused && searchQuery.trim().length > 1 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-50 p-2"
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

            {/* Account / Sign In Icon Button (Shifted next to Search) */}
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#D81B60] hover:bg-pink-50/60 rounded-xl transition-all shrink-0"
              title={isLoggedIn ? "Account" : "Sign In"}
            >
              <User className="w-5 h-5 stroke-[1.75]" />
              <span className="hidden md:inline text-xs font-semibold">{isLoggedIn ? "Account" : "Sign In"}</span>
            </Link>
          </div>

          {/* CENTER: Prominent Centered TOHAY KIDS Logo (Main Visual Focal Point) */}
          <div className="flex justify-center text-center">
            <Logo size="normal" />
          </div>

          {/* RIGHT: Minimal Line Icons (Wishlist, Cart) */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3 md:gap-5 text-[#1E293B]">
            {/* Wishlist Icon with Subtle Badge */}
            <Link
              to="/wishlist"
              className="relative flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#D81B60] hover:bg-pink-50/60 rounded-xl transition-all"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#E91E63] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold">Wishlist</span>
            </Link>

            {/* Cart Icon with Subtle Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 p-2 text-gray-700 hover:text-[#D81B60] hover:bg-pink-50/60 rounded-xl transition-all cursor-pointer"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#E91E63] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                  {totalCartItems}
                </span>
              </div>
              <span className="hidden md:inline text-xs font-semibold">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar (When Search Icon is clicked on Mobile) */}
      {isSearchOpen && (
        <div className="p-3 bg-white border-t border-pink-100 sm:hidden animate-in slide-in-from-top-2 duration-200 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-[#D81B60] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" />
            <input
              type="text"
              placeholder="Search kids outfits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-pink-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-pink-400"
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
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden divide-y divide-gray-100">
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

      {/* 3. REDESIGNED LUXURY PRIMARY NAVIGATION BAR (Segmented Capsule Track - No Extra Buttons) */}
      <nav className="hidden lg:block border-t border-b border-pink-100/70 bg-gradient-to-r from-white via-[#FFF9FA] to-white py-2.5 shadow-2xs">
        <div className="max-w-[1600px] mx-auto px-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 p-1 bg-[#FFF0F4]/70 backdrop-blur-md rounded-full border border-pink-200/60 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-6 py-2 rounded-full inline-flex items-center justify-center text-[12px] font-black uppercase tracking-[0.14em] transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                      : 'text-gray-700 hover:text-[#D81B60] hover:bg-white/90'
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
            {/* Drawer Header */}
            <div className="p-4 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/60 to-white shrink-0">
              <div onClick={() => setMobileMenuOpen(false)}>
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

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 overscroll-contain">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase transition-colors ${isActive ? 'bg-pink-100 text-[#D81B60]' : 'text-gray-800 hover:bg-pink-50'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </NavLink>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-600 text-center space-y-1 shrink-0">
              <p className="font-semibold text-gray-800">Crafted for Little Celebrations</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
