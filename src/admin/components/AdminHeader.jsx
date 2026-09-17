import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, Bell, ExternalLink, User, Settings, LogOut,
  ChevronDown, CheckCircle, Package, AlertTriangle, MessageSquare, Shield
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function AdminHeader() {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setIsMobileSidebarOpen,
    notificationsList,
    markAllNotificationsRead,
    storeSettings,
    showToast
  } = useAdmin();

  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-pink-100/80 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (window.innerWidth < 1024) {
              setIsMobileSidebarOpen(true);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-pink-50 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Right: Actions, Notifications & Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* View Storefront Link */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-bold text-[#D81B60] hover:bg-pink-50 transition-all shadow-2xs"
        >
          <span>View Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#D81B60] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-pink-100 z-50 p-4 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-sm text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-pink-100 text-[#D81B60] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  className="text-[11px] font-bold text-[#D81B60] hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                {notificationsList.map((notif) => {
                  let Icon = Package;
                  let iconBg = 'bg-pink-50 text-[#D81B60]';
                  if (notif.type === 'inventory') {
                    Icon = AlertTriangle;
                    iconBg = 'bg-amber-50 text-amber-600';
                  } else if (notif.type === 'customer') {
                    Icon = User;
                    iconBg = 'bg-emerald-50 text-emerald-600';
                  } else if (notif.type === 'review') {
                    Icon = MessageSquare;
                    iconBg = 'bg-purple-50 text-purple-600';
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                        notif.read
                          ? 'bg-gray-50/50 border-gray-100 opacity-75'
                          : 'bg-pink-50/40 border-pink-100 font-semibold'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-gray-900 leading-snug">{notif.title}</p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">{notif.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-100 text-center">
                <Link
                  to="/admin/orders/all"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-extrabold text-[#D81B60] hover:underline"
                >
                  View All Activity &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-pink-100 text-[#D81B60] border-2 border-[#D81B60] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-extrabold text-gray-900 leading-tight">
                {storeSettings.adminProfile.name.split(' ')[0]}
              </p>
              <p className="text-[10px] text-gray-500 font-bold">Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-pink-100 z-50 p-2 space-y-1 animate-fade-in">
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100 text-left">
                <p className="text-xs font-extrabold text-gray-900">{storeSettings.adminProfile.name}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate">{storeSettings.adminProfile.email}</p>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-pink-50 hover:text-[#D81B60] transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Store Settings</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('tohay_admin_token');
                  localStorage.removeItem('tohay_admin_user');
                  setShowProfileMenu(false);
                  showToast('Logged out of Admin Portal');
                  navigate('/admin/login');
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Log Out Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
