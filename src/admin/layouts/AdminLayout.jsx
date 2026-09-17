import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminProvider, useAdmin } from '../context/AdminContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import ConfirmModal from '../components/ConfirmModal';

function AdminLayoutInner({ children }) {
  const { toastMessage } = useAdmin();

  return (
    <div className="min-h-screen bg-[#FFFDFC] text-gray-900 flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#FFFDFC]">
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white text-xs font-extrabold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-pink-400">
          <span className="w-2 h-2 rounded-full bg-[#D81B60]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Action Confirmation Dialog */}
      <ConfirmModal />
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
