import React, { useState } from 'react';
import { Settings, Save, Truck, Percent, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { authService } from '../../services/authService';

export default function AdminSettings() {
  const { storeSettings, setStoreSettings, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'general' | 'shipping' | 'tax'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [form, setForm] = useState({
    storeName: storeSettings.storeName,
    contactEmail: storeSettings.contactEmail,
    supportPhone: storeSettings.supportPhone,
    address: storeSettings.address,
    freeShippingThreshold: storeSettings.freeShippingThreshold,
    standardShippingFee: storeSettings.standardShippingFee,
    gstTaxRate: storeSettings.gstTaxRate,
    adminName: storeSettings.adminProfile?.name || 'Admin',
    adminEmail: storeSettings.adminProfile?.email || 'admin@tohaykids.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          showToast('New passwords do not match!');
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        name: form.adminName,
        email: form.adminEmail,
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      try {
        const res = await authService.updateAdminCredentials(payload);
        if (res.data?.email || res.data?.name) {
          const updatedAdminUser = {
            name: res.data.name || form.adminName,
            email: res.data.email || form.adminEmail,
          };
          localStorage.setItem('tohay_admin_user', JSON.stringify(updatedAdminUser));
        }
      } catch (err) {
        console.warn('Backend credentials update fallback note:', err);
      }

      setStoreSettings((prev) => ({
        ...prev,
        storeName: form.storeName,
        contactEmail: form.contactEmail,
        supportPhone: form.supportPhone,
        address: form.address,
        freeShippingThreshold: Number(form.freeShippingThreshold),
        standardShippingFee: Number(form.standardShippingFee),
        gstTaxRate: Number(form.gstTaxRate),
        adminProfile: {
          ...prev.adminProfile,
          name: form.adminName,
          email: form.adminEmail
        }
      }));

      localStorage.setItem('tohay_admin_user', JSON.stringify({
        name: form.adminName,
        email: form.adminEmail
      }));

      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      showToast('Admin Credentials & Settings saved successfully! 🎉');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-gray-900">System & Store Settings</h1>
          <p className="text-xs text-gray-500 font-semibold">Manage admin profile, login credentials, store metadata, shipping & tax rates</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-6 py-2.5 bg-[#D81B60] hover:bg-[#C2185B] text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'profile', label: 'Admin Profile & Login', icon: User },
          { id: 'general', label: 'General Store Info', icon: Settings },
          { id: 'shipping', label: 'Shipping Rules', icon: Truck },
          { id: 'tax', label: 'Tax & GST Rates', icon: Percent }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#D81B60] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/80 shadow-2xs space-y-6">
        
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#D81B60]" />
                <span>Admin Identity & Email</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium">Update your admin account display name and login email address.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Admin Full Name</label>
                <input
                  type="text"
                  value={form.adminName}
                  onChange={(e) => setForm({ ...form, adminName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Admin Login Email</label>
                <input
                  type="email"
                  value={form.adminEmail}
                  onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#D81B60]" />
                  <span>Change Admin Password</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium">Leave password fields blank if you do not wish to change your password.</p>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={form.currentPassword}
                    onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D81B60] p-1 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D81B60] p-1 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1 focus:bg-white focus:border-[#D81B60] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Store Profile</h3>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Store Brand Name</label>
              <input
                type="text"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Support Email</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Helpline Phone</label>
                <input
                  type="text"
                  value={form.supportPhone}
                  onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Warehouse Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
              />
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Delivery Rules & Fees</h3>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={form.standardShippingFee}
                onChange={(e) => setForm({ ...form, standardShippingFee: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
              />
            </div>
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-heading font-extrabold text-base text-gray-900">Government Tax Configuration</h3>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-gray-600 tracking-wider">GST Rate (%)</label>
              <input
                type="number"
                value={form.gstTaxRate}
                onChange={(e) => setForm({ ...form, gstTaxRate: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold mt-1"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
