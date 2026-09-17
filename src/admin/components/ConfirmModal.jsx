import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function ConfirmModal() {
  const { confirmModal, closeConfirmModal } = useAdmin();

  if (!confirmModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeConfirmModal}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl border border-pink-100 space-y-4">
        <button
          onClick={closeConfirmModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            confirmModal.isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg text-gray-900 leading-tight">
              {confirmModal.title || 'Confirm Action'}
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">Please review before continuing</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 font-medium leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
          {confirmModal.message}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={closeConfirmModal}
            className="flex-1 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {confirmModal.cancelText || 'Cancel'}
          </button>

          <button
            type="button"
            onClick={() => confirmModal.onConfirm()}
            className={`flex-1 py-2.5 px-4 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
              confirmModal.isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#D81B60] hover:bg-[#C2185B]'
            }`}
          >
            {confirmModal.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
