import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search, Heart, ShoppingBag, User, Menu, X,
  ChevronRight, ChevronDown, Truck, Sparkles, HelpCircle, Phone, Info, LogOut
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Logo from './Logo';

export default function Header() {
  const { wishlist, totalCartItems, searchQuery, setSearchQuery, setIsCartOpen, products, isLoggedIn, user, logoutUser, categoriesList } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCatId, setExpandedCatId] = useState(null);
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

  // Dynamic Category Links derived from Categories API (with subcategories support)
  const dynamicCategories = useMemo(() => {
    if (Array.isArray(categoriesList) && categoriesList.length > 0) {
      return categoriesList
        .filter((c) => c.status !== 'Inactive')
        .map((cat) => {
          const slug = (cat.slug || '').toLowerCase().trim();
          const name = (cat.name || '').trim();
          let path = `/${slug}`;
          let theme = {
            activeClass: 'bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-xs',
            hoverClass: 'hover:text-pink-800 hover:bg-pink-100/60',
            badgeBg: 'bg-pink-100 text-[#D81B60]',
          };

          if (slug === 'boys' || name.toLowerCase().includes('boy')) {
            path = '/boys';
            theme = {
              activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
              hoverClass: 'hover:text-blue-800 hover:bg-blue-100/60',
              badgeBg: 'bg-blue-100 text-blue-700',
            };
          } else if (slug === 'girls' || name.toLowerCase().includes('girl')) {
            path = '/girls';
            theme = {
              activeClass: 'bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-xs',
              hoverClass: 'hover:text-pink-800 hover:bg-pink-100/60',
              badgeBg: 'bg-pink-100 text-pink-700',
            };
          } else if (slug === 'siblings' || name.toLowerCase().includes('sibling')) {
            path = '/siblings';
            theme = {
              activeClass: 'bg-gradient-to-r from-[#8E24AA] to-[#AB47BC] text-white shadow-xs',
              hoverClass: 'hover:text-purple-800 hover:bg-purple-100/60',
              badgeBg: 'bg-purple-100 text-purple-700',
            };
          } else if (slug === 'new-arrivals' || name.toLowerCase().includes('new')) {
            path = '/new-arrivals';
            theme = {
              activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs',
              hoverClass: 'hover:text-amber-800 hover:bg-amber-100/60',
              badgeBg: 'bg-amber-100 text-amber-700',
            };
          }

          const rawSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          const subcategories = rawSubs
            .map((s) => (typeof s === 'string' ? s : s?.name))
            .filter(Boolean);

          return {
            id: cat.id || cat._id || slug,
            name: name,
            displayName: name.toUpperCase(),
            path,
            slug,
            subcategories,
            ...theme,
          };
        });
    }

    return [
      {
        id: 'new-arrivals',
        name: 'New Arrivals',
        displayName: 'NEW ARRIVALS',
        path: '/new-arrivals',
        subcategories: [],
        activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs',
        hoverClass: 'hover:text-amber-800 hover:bg-amber-100/60',
      },
      {
        id: 'boys',
        name: 'Boys',
        displayName: 'BOYS',
        path: '/boys',
        subcategories: ['Kurta Pjama set'],
        activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs',
        hoverClass: 'hover:text-blue-800 hover:bg-blue-100/60',
      },
      {
        id: 'girls',
        name: 'Girls',
        displayName: 'GIRLS',
        path: '/girls',
        subcategories: ['Angrakha Set', 'Sharara Set', 'Dhoti Set', 'Pant Set', 'Salwar'],
        activeClass: 'bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-xs',
        hoverClass: 'hover:text-pink-800 hover:bg-pink-100/60',
      },
      {
        id: 'siblings',
        name: 'Siblings',
        displayName: 'SIBLINGS',
        path: '/siblings',
        subcategories: ['DHOTI SET', 'Kurta Pjama set', 'PANT SET', 'Lehenga Choli', 'salwar'],
        activeClass: 'bg-gradient-to-r from-[#8E24AA] to-[#AB47BC] text-white shadow-xs',
        hoverClass: 'hover:text-purple-800 hover:bg-purple-100/60',
      },
    ];
  }, [categoriesList]);

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

      {/* MAIN HEADER ROW (Search | Centered Sleek Logo | Utilities) */}
      <div className="bg-gradient-to-r from-[#FFF4F7] via-[#FFF9FB] to-[#FFF7EE] border-b border-pink-200/70 shadow-2xs backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5">
          <div className="grid grid-cols-3 items-center gap-2 sm:gap-4">

            {/* LEFT: EXACTLY TWO ICONS - Menu (☰) and Search (🔍) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* 1. Three-line Menu/Hamburger icon (☰) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 sm:p-2.5 text-gray-800 hover:text-[#D81B60] hover:bg-pink-100/70 rounded-full transition-all cursor-pointer flex items-center justify-center border border-pink-200/80 bg-white/90 shadow-2xs group"
                aria-label="Open Navigation Menu"
                title="Open Menu"
              >
                <Menu className="w-5 h-5 stroke-[2] group-hover:scale-110 transition-transform text-gray-800 group-hover:text-[#D81B60]" />
              </button>

              {/* 2. Search Icon Button */}
              {!isSearchOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 60);
                  }}
                  className="p-2 sm:p-2.5 text-gray-700 hover:text-[#D81B60] hover:bg-pink-100/70 border border-pink-200/80 hover:border-pink-300 rounded-full shadow-2xs transition-all cursor-pointer group flex items-center justify-center bg-white/90"
                  aria-label="Search"
                  title="Search"
                >
                  <Search className="w-5 h-5 stroke-[2] text-[#D81B60] group-hover:scale-110 transition-transform" />
                </button>
              )}

              {/* Expandable Search Input when search is active */}
              {isSearchOpen && (
                <div ref={searchContainerRef} className="relative w-full max-w-[200px] sm:max-w-[260px] animate-in fade-in duration-200">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search kids fashion..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-pink-300 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#D81B60] focus:ring-1 focus:ring-pink-200 transition-all shadow-xs"
                      autoFocus
                    />
                    <Search className="w-3.5 h-3.5 text-[#D81B60] absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[2]" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchFocused(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 rounded-full transition-colors cursor-pointer"
                      aria-label="Close search"
                    >
                      <X className="w-3 h-3 stroke-[2]" />
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
            </div>

            {/* CENTER: Prominent Centered TOHAY KIDS Logo */}
            <div className="flex justify-center text-center">
              <Logo size="normal" />
            </div>

            {/* RIGHT: EXACTLY TWO ICONS - Wishlist (❤️) and Shopping Bag (🛍️) */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5">
              {/* 1. Wishlist Icon Button */}
              <Link
                to="/wishlist"
                className="relative p-2 sm:p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-[#E91E63] border border-pink-200/80 hover:border-pink-300 rounded-full transition-all shadow-2xs group flex items-center justify-center cursor-pointer"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2] text-[#E91E63] group-hover:scale-110 transition-transform" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* 2. Shopping Bag / Cart Icon Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 bg-gradient-to-r from-[#D81B60] via-[#E91E63] to-[#FF4081] hover:from-[#C2185B] hover:to-[#D81B60] text-white rounded-full shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#D81B60] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                    {totalCartItems}
                  </span>
                )}
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
            {dynamicCategories.map((link) => (
              <NavLink
                key={link.id || link.name}
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

      {/* 4. SLIDE-OUT DRAWER MENU (Responsive for both Mobile & Desktop) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 animate-fadeIn">
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full h-full max-h-dvh bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-pink-200 flex items-center justify-between bg-gradient-to-r from-[#FFF0F5] via-[#FFF5F8] to-[#FFFBEB] shrink-0">
              <div onClick={() => setMobileMenuOpen(false)} className="cursor-pointer">
                <Logo size="small" align="start" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-[#D81B60] hover:bg-pink-100/60 rounded-full transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 overscroll-contain">
              
              {/* 1. SIGN IN / ACCOUNT SECTION */}
              <div>
                {!isLoggedIn ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-pink-50 via-purple-50/50 to-pink-50 hover:from-pink-100/80 hover:to-purple-100/80 border border-pink-200/90 rounded-2xl transition-all shadow-2xs group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-pink-200 flex items-center justify-center text-[#D81B60] shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      <User className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm group-hover:text-[#D81B60] transition-colors">
                        Sign In / Register
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        Access orders, wishlist & profile
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ) : (
                  <div className="p-3.5 bg-gradient-to-r from-pink-50 via-purple-50/40 to-pink-50 border border-pink-200/90 rounded-2xl space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm truncate">
                          Hi, {user?.name || 'Customer'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {user?.email || user?.phone || 'Member'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-pink-200/60 text-xs">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-2 bg-white text-gray-800 font-bold rounded-xl border border-pink-200 hover:bg-pink-50 transition-colors shadow-2xs"
                      >
                        My Account & Orders
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setMobileMenuOpen(false);
                        }}
                        className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SHOPPING CATEGORIES (Loaded dynamically from Category API) */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-1">
                  Shopping Categories
                </p>

                {/* Categories from API with subcategories dropdown */}
                {dynamicCategories.map((cat) => {
                  const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                  const isExpanded = expandedCatId === cat.id;

                  return (
                    <div
                      key={cat.id || cat.name}
                      className="rounded-xl border border-pink-100/60 bg-gray-50/50 overflow-hidden transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <NavLink
                          to={cat.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex-1 flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase transition-all ${
                              isActive
                                ? `${cat.activeClass}`
                                : `text-gray-800 ${cat.hoverClass} hover:bg-pink-50/40`
                            }`
                          }
                        >
                          <span>{cat.displayName || cat.name}</span>
                          {!hasSubs && <ChevronRight className="w-4 h-4 opacity-60" />}
                        </NavLink>

                        {hasSubs && (
                          <button
                            type="button"
                            onClick={() => setExpandedCatId(isExpanded ? null : cat.id)}
                            className="px-3 py-2.5 text-gray-500 hover:text-[#D81B60] hover:bg-pink-100/50 transition-colors border-l border-pink-100/60 cursor-pointer flex items-center justify-center"
                            aria-label={`Toggle ${cat.name} subcategories`}
                            title="View Subcategories"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-[#D81B60]' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Subcategories List from API */}
                      {hasSubs && isExpanded && (
                        <div className="bg-white/95 border-t border-pink-100/60 px-3 py-2 space-y-1 animate-fadeIn">
                          {cat.subcategories.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={`${cat.path}?subcategory=${encodeURIComponent(sub)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-600 hover:text-[#D81B60] hover:bg-pink-50/60 transition-colors"
                            >
                              <span>{sub}</span>
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Additional Non-Gender Categories */}
                <NavLink
                  to="/shop-by-age"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#D81B60] hover:bg-pink-50 border border-gray-100 transition-all uppercase"
                >
                  <span>SHOP BY AGE</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </NavLink>

                <NavLink
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:text-[#D81B60] hover:bg-pink-50 border border-gray-100 transition-all uppercase"
                >
                  <span>ALL COLLECTIONS</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </NavLink>
              </div>

              {/* 3. OTHER APPLICABLE NAVIGATION OPTIONS */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-1">
                  Customer Care & Navigation
                </p>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:text-[#D81B60] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Track Your Order</span>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 hover:text-[#D81B60] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>My Wishlist</span>
                  </span>
                  {wishlist.length > 0 && (
                    <span className="bg-pink-100 text-[#D81B60] font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:text-[#D81B60] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>Size Guide & FAQs</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:text-[#D81B60] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>About Tohay Kids</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-gray-700 hover:text-[#D81B60] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>Contact & Support</span>
                </Link>
              </div>

            </div>

            {/* Drawer Footer with Festive Touch */}
            <div className="p-3.5 border-t border-pink-100 bg-gradient-to-r from-pink-50 to-amber-50 text-xs text-gray-700 text-center space-y-0.5 shrink-0">
              <p className="font-extrabold text-[#D81B60] text-xs">Crafted for Little Celebrations ✨</p>
              <p className="text-[10px] text-gray-500">Premium Festive & Ethnic Kids Wear</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
