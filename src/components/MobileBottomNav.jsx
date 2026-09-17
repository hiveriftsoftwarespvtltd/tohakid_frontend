import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileBottomNav() {
  const { cart, wishlist, setIsCartOpen } = useShop();

  const totalCartItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const wishlistCount = wishlist.length;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] select-none"
      style={{
        paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))'
      }}
    >
      <div className="h-14 flex items-center justify-around px-1 pt-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-center transition-all ${
              isActive ? 'text-[#D81B60]' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <Home className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-black leading-none tracking-tight mt-1">Home</span>
        </NavLink>

        <NavLink
          to="/new-arrivals"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-center transition-all ${
              isActive ? 'text-[#D81B60]' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <Grid className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-black leading-none tracking-tight mt-1">Categories</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-center transition-all relative ${
              isActive ? 'text-[#D81B60]' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5 shrink-0" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-pink-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black leading-none tracking-tight mt-1">Wishlist</span>
        </NavLink>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full text-center text-gray-500 hover:text-gray-800 relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-pink-600 shrink-0" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D81B60] text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-xs">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black leading-none tracking-tight mt-1">Bag</span>
        </button>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-center transition-all ${
              isActive ? 'text-[#D81B60]' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <User className="w-5 h-5 shrink-0" />
          <span className="text-[10px] font-black leading-none tracking-tight mt-1">Account</span>
        </NavLink>
      </div>
    </nav>
  );
}
