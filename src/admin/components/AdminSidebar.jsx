import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, Layers, Award, Star,
  ShoppingBag, Clock, RefreshCw, Truck, CheckCircle2, XCircle, RotateCcw,
  Users, MessageSquare, Ticket, LayoutTemplate, Warehouse,
  CreditCard, TrendingUp, Sliders, ChevronDown, ChevronRight, X, Sparkles, UserCheck, Camera, Tag, User
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import logoImg from '../../assets/logo.png';

export default function AdminSidebar() {
  const { isSidebarCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen, ordersList, returnsList } = useAdmin();
  const location = useLocation();

  // Pending orders count for badge
  const pendingOrdersCount = (ordersList || []).filter((o) => (o.orderStatus || o.status) === 'Pending').length;
  const pendingReturnsCount = (returnsList || []).filter((r) => r.status === 'Requested' || r.status === 'Pending').length;

  // Single-open accordion group state
  const [openGroup, setOpenGroup] = useState('catalog');

  const toggleGroup = (groupKey) => {
    setOpenGroup((prev) => (prev === groupKey ? null : groupKey));
  };

  const navGroups = [
    {
      heading: 'MAIN',
      standalone: true,
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      heading: 'STORE CATALOG',
      groupKey: 'catalog',
      title: 'Catalog',
      icon: Package,
      items: [
        { name: 'Products', path: '/admin/catalog/products', icon: Package },
        { name: 'Categories', path: '/admin/catalog/categories', icon: FolderTree },
        { name: 'Subcategories', path: '/admin/catalog/subcategories', icon: Layers },
        { name: 'Product Reviews', path: '/admin/catalog/reviews', icon: Star }
      ]
    },
    {
      heading: 'ORDER FULFILLMENT',
      groupKey: 'orders',
      title: 'Orders',
      icon: ShoppingBag,
      items: [
        { name: 'All Orders', path: '/admin/orders/all', icon: ShoppingBag },
        { name: 'Pending Orders', path: '/admin/orders/pending', icon: Clock, badge: pendingOrdersCount, badgeColor: 'bg-amber-500 text-white' },
        { name: 'Processing Orders', path: '/admin/orders/processing', icon: RefreshCw },
        { name: 'Shipped Orders', path: '/admin/orders/shipped', icon: Truck },
        { name: 'Delivered Orders', path: '/admin/orders/delivered', icon: CheckCircle2 },
        { name: 'Cancelled Orders', path: '/admin/orders/cancelled', icon: XCircle },
        { name: 'Returns & Refunds', path: '/admin/returns', icon: RotateCcw, badge: pendingReturnsCount, badgeColor: 'bg-rose-500 text-white' }
      ]
    },
    {
      heading: 'MARKETING & PROMOS',
      groupKey: 'marketing',
      title: 'Marketing',
      icon: Ticket,
      items: [
        { name: 'Coupons & Discounts', path: '/admin/marketing/coupons', icon: Ticket },
        { name: 'Hero Banners & Sliders', path: '/admin/marketing/banners', icon: LayoutTemplate },
        { name: 'Kids Collections Cards', path: '/admin/marketing/gender-cards', icon: Sparkles },
        { name: 'Shop by Age Cards', path: '/admin/marketing/age-cards', icon: FolderTree },
        { name: 'Occasion Promo Cards', path: '/admin/marketing/occasion-cards', icon: Award },
        { name: 'Shop by Collection Cards', path: '/admin/marketing/collection-cards', icon: FolderTree },
        { name: 'Celebration Edit Banner', path: '/admin/marketing/celebration-edit', icon: Sparkles },
        { name: 'Social & Lookbook Gallery', path: '/admin/marketing/instagram-gallery', icon: Camera }
      ]
    },
    {
      heading: 'OPERATIONS & REPORTS',
      groupKey: 'operations',
      title: 'Operations',
      icon: Warehouse,
      items: [
        { name: 'Customers List', path: '/admin/customers', icon: Users },
        { name: 'Customer Reviews', path: '/admin/reviews', icon: MessageSquare },
        { name: 'Inventory Stock', path: '/admin/inventory', icon: Warehouse },
        { name: 'Transactions Logs', path: '/admin/payments', icon: CreditCard },
        { name: 'Sales Reports', path: '/admin/reports', icon: TrendingUp },
        { name: 'Store Settings', path: '/admin/settings', icon: Sliders }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 border-r border-slate-800 shadow-2xl overflow-hidden select-none">

      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 shrink-0">
        <NavLink to="/admin" className="flex items-center gap-3 group">
          <img src={logoImg} alt="Tohay Logo" className="h-11 object-contain group-hover:scale-105 transition-all bg-white/90 p-1 rounded-xl shadow-xs" />
        </NavLink>

        {/* Mobile Close */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-4">
        {navGroups.map((group, idx) => {
          // Standalone Top Level Link (Overview)
          if (group.standalone) {
            const Icon = group.icon;
            const isActive = group.exact
              ? location.pathname === group.path
              : location.pathname.startsWith(group.path);

            return (
              <div key={idx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400/90 uppercase mb-1.5">
                    {group.heading}
                  </p>
                )}
                <NavLink
                  to={group.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 group ${isActive
                      ? 'bg-gradient-to-r from-[#D81B60] to-pink-600 text-white shadow-md shadow-pink-900/30 border-l-4 border-white'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{group.name}</span>}

                  {/* Collapsed Tooltip */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-16 hidden group-hover:block bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fadeIn">
                      {group.name}
                    </div>
                  )}
                </NavLink>
              </div>
            );
          }

          // Collapsible Group Accordion
          const GroupIcon = group.icon;
          const isOpen = openGroup === group.groupKey;
          const hasActiveChild = group.items.some((item) =>
            item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
          );

          return (
            <div key={idx} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400/90 uppercase mb-1.5">
                  {group.heading}
                </p>
              )}

              {/* Group Header Button */}
              <button
                type="button"
                onClick={() => toggleGroup(group.groupKey)}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer group ${hasActiveChild
                    ? 'text-pink-300 bg-slate-800/80 border-l-2 border-pink-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <GroupIcon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${hasActiveChild ? 'text-[#D81B60]' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{group.title}</span>
                  )}
                </div>

                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {group.items.some(i => i.badge > 0) && (
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180 text-pink-400' : 'rotate-0 text-slate-400'
                        }`}
                    />
                  </div>
                )}

                {/* Collapsed Tooltip */}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 hidden group-hover:block bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 animate-fadeIn">
                    {group.title}
                  </div>
                )}
              </button>

              {/* Accordion Sub-links Smooth Grid Animation Container */}
              <div
                className={`grid transition-all duration-300 ease-in-out border-l border-slate-800 ml-5 ${!isSidebarCollapsed && isOpen
                    ? 'grid-rows-[1fr] opacity-100 mt-1'
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
              >
                <div className="overflow-hidden pl-3.5 space-y-1">
                  {group.items.map((item) => {
                    const ChildIcon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-[#D81B60] to-rose-600 text-white font-bold shadow-md shadow-pink-950/50 translate-x-1'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/70 hover:translate-x-1'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ChildIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-pink-400/80'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge > 0 && (
                          <span className={`px-1.5 py-0.5 text-[9px] font-mono font-black rounded-md ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Admin Profile Card */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 m-2 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                <User className="w-4 h-4 text-white stroke-[2]" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>Admin</span>
                <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
              </p>
              <p className="text-[10px] text-slate-400 truncate">admin@tohaykids.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Column */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 z-30 ${isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
