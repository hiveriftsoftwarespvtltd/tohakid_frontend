import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Package, MapPin, Coins, Heart, Settings, LogOut, Edit2, Plus, 
  CheckCircle, Copy, Shield, ChevronRight, Phone, Mail, Award, Truck, Download, RefreshCw, Trash2, Camera, Bell, Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import InvoiceModal from '../components/InvoiceModal';

export default function ProfilePage() {
  const { 
    user, updateUserProfile, addresses, addAddress, deleteAddress, setDefaultAddress, 
    orders, wishlist, products, addToCart, showToast, logoutUser 
  } = useShop();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'addresses', 'coins', 'wishlist', 'settings'
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  
  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender
  });

  // Kids profile state
  const [kidsList, setKidsList] = useState(user.kids || []);
  const [newKid, setNewKid] = useState({ name: '', age: '', preferredSize: '5-6Y', gender: 'Girl' });
  const [showAddKid, setShowAddKid] = useState(false);

  // New Address form state
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    name: user.name,
    phone: user.phone,
    flat: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Password state
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirmPass: '' });

  // Handle profile form save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsEditingProfile(false);
  };

  // Add Kid
  const handleAddKid = (e) => {
    e.preventDefault();
    if (newKid.name && newKid.age) {
      const updatedKids = [...kidsList, { ...newKid, id: Date.now() }];
      setKidsList(updatedKids);
      updateUserProfile({ kids: updatedKids });
      setNewKid({ name: '', age: '', preferredSize: '5-6Y', gender: 'Girl' });
      setShowAddKid(false);
    }
  };

  const handleRemoveKid = (id) => {
    const updatedKids = kidsList.filter((k) => k.id !== id);
    setKidsList(updatedKids);
    updateUserProfile({ kids: updatedKids });
  };

  // Add Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (addressForm.flat && addressForm.pincode && addressForm.city) {
      addAddress(addressForm);
      setAddressForm({
        type: 'Home',
        name: user.name,
        phone: user.phone,
        flat: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowAddAddressModal(false);
    } else {
      showToast('Please fill all required address fields.');
    }
  };

  // Copy Referral Code
  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode || 'TOHAY-ANANYA-2026');
    showToast('Referral code copied to clipboard!');
  };

  // Wishlist products
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-4 pt-4 pb-24 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-pink-600 font-bold">My Account</span>
      </nav>

      {/* User Header Summary Card (Matching Tohay Website Theme) */}
      <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-peach-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-gray-900 border border-pink-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle Festive Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#E9A6C5_1px,transparent_1px)] [background-size:20px_20px] opacity-35 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Avatar Icon & User Info */}
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-5 text-center md:text-left w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-pink-100/90 border-4 border-white shadow-md ring-2 ring-pink-200 flex items-center justify-center text-[#D81B60] shrink-0">
              <User className="w-10 h-10 md:w-12 md:h-12 stroke-[1.8]" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-gray-900 break-words">{user.name || 'Account Holder'}</h1>
              </div>
              <div className="text-xs text-gray-600 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 font-medium">
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 inline text-pink-500 shrink-0" />
                    <span className="break-all">{user.email}</span>
                  </span>
                )}
                {user.email && user.phone && <span className="text-pink-300 hidden sm:inline">•</span>}
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 inline text-pink-500 shrink-0" />
                    <span>{user.phone}</span>
                  </span>
                )}
              </div>
              {user.createdAt && (
                <p className="text-[11px] text-gray-500 font-medium">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stat Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-pink-200/60 text-center">
          <div 
            onClick={() => setActiveTab('orders')} 
            className="cursor-pointer bg-white/80 hover:bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-pink-100 transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <p className="font-heading font-black text-lg sm:text-xl text-pink-700">{orders.length}</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 leading-tight">Total Orders</p>
          </div>
          <div 
            onClick={() => setActiveTab('wishlist')} 
            className="cursor-pointer bg-white/80 hover:bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-pink-100 transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <p className="font-heading font-black text-lg sm:text-xl text-pink-700">{wishlist.length}</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 leading-tight">Saved Wishlist</p>
          </div>
          <div 
            onClick={() => setActiveTab('addresses')} 
            className="cursor-pointer bg-white/80 hover:bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-pink-100 transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <p className="font-heading font-black text-lg sm:text-xl text-pink-700">{addresses.length}</p>
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 leading-tight">Saved Addresses</p>
          </div>
        </div>
      </div>

      {/* Main Profile Layout Grid (Sidebar Nav + Active Tab Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
        
        {/* Navigation (Horizontal Scrollable Tabs on Mobile, Left Sidebar on Desktop) */}
        <div className="lg:col-span-3 bg-white rounded-2xl lg:rounded-3xl p-2 sm:p-3 lg:p-4 border border-pink-100 shadow-xs">
          <div className="flex lg:flex-col gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 lg:py-0 scroll-smooth">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-700 bg-gray-50/80 lg:bg-transparent hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Personal Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-700 bg-gray-50/80 lg:bg-transparent hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 shrink-0" />
                <span>My Orders ({orders.length})</span>
              </div>
              {(orders || []).some(o => (o.orderStatus || o.status || '').includes('Out')) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-700 bg-gray-50/80 lg:bg-transparent hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-700 bg-gray-50/80 lg:bg-transparent hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-gray-700 bg-gray-50/80 lg:bg-transparent hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings & Security</span>
            </button>

            <div className="lg:pt-3 lg:mt-3 lg:border-t lg:border-gray-100 shrink-0">
              <button
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl lg:rounded-2xl text-xs font-bold text-red-600 bg-red-50/80 lg:bg-transparent hover:bg-red-100 lg:hover:bg-red-50 transition-colors whitespace-nowrap cursor-pointer w-full"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Tab Content Container */}
        <div className="lg:col-span-9 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-pink-100 shadow-xs min-h-[400px]">
          
          {/* TAB 1: PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-gray-900">Personal Information</h2>
                  <p className="text-xs text-gray-500">Manage your contact details and children's outfit sizes</p>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="inline-flex items-center justify-center gap-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              {/* Profile Details / Edit Form */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-pink-50/50 p-4 sm:p-6 rounded-2xl border border-pink-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-700">Mobile Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-gray-700">Gender</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-pink-500"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div className="p-3.5 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Full Name</span>
                    <p className="font-heading font-extrabold text-sm sm:text-base text-gray-900 mt-0.5 break-words">{user.name || 'Not provided'}</p>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Email Address</span>
                    <p className="font-heading font-extrabold text-sm sm:text-base text-gray-900 mt-0.5 break-all">{user.email || 'Not provided'}</p>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Phone Number</span>
                    <p className="font-heading font-extrabold text-sm sm:text-base text-gray-900 mt-0.5">{user.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Gender</span>
                    <p className="font-heading font-extrabold text-sm sm:text-base text-gray-900 mt-0.5">{user.gender || 'Not specified'}</p>
                  </div>
                </div>
              )}

              {/* Kids Profile & Size Preferences */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-gray-900">My Kids & Fit Preferences</h3>
                    <p className="text-xs text-gray-500">Save your children's age & sizes for instant outfit recommendations</p>
                  </div>
                  <button
                    onClick={() => setShowAddKid(!showAddKid)}
                    className="inline-flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>{showAddKid ? 'Cancel' : 'Add Kid Profile'}</span>
                  </button>
                </div>

                {/* Add Kid Form */}
                {showAddKid && (
                  <form onSubmit={handleAddKid} className="bg-purple-50/60 p-4 sm:p-5 rounded-2xl border border-purple-100 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-purple-900">Add Child Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <label className="text-[11px] font-extrabold text-gray-700">Child's Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Anaya"
                          value={newKid.name}
                          onChange={(e) => setNewKid({ ...newKid, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-gray-700">Age</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 Years"
                          value={newKid.age}
                          onChange={(e) => setNewKid({ ...newKid, age: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-gray-700">Preferred Size</label>
                        <select
                          value={newKid.preferredSize}
                          onChange={(e) => setNewKid({ ...newKid, preferredSize: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        >
                          <option value="1-2Y">1-2Y</option>
                          <option value="3-4Y">3-4Y</option>
                          <option value="5-6Y">5-6Y</option>
                          <option value="7-8Y">7-8Y</option>
                          <option value="9-10Y">9-10Y</option>
                          <option value="11-12Y">11-12Y</option>
                          <option value="13-14Y">13-14Y</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-extrabold text-gray-700">Gender</label>
                        <select
                          value={newKid.gender}
                          onChange={(e) => setNewKid({ ...newKid, gender: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        >
                          <option value="Girl">Girl</option>
                          <option value="Boy">Boy</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddKid(false)}
                        className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Save Kid Profile
                      </button>
                    </div>
                  </form>
                )}

                {/* Kids Cards List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {kidsList.map((kid) => (
                    <div key={kid.id} className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-heading font-black text-sm shrink-0">
                          {kid.name[0]}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-heading font-extrabold text-sm text-gray-900 truncate">{kid.name} ({kid.gender})</h4>
                          <p className="text-xs text-gray-500">Age: {kid.age} • Size: <strong className="text-purple-700 font-mono">{kid.preferredSize}</strong></p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveKid(kid.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                        title="Remove Kid"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-gray-900">Order History & Tracking</h2>
                  <p className="text-xs text-gray-500">View current shipments and past purchases</p>
                </div>
                <Link
                  to="/track-order"
                  className="bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>Track Package</span>
                </Link>
              </div>

              {(orders || []).length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-3xl border border-gray-200 space-y-3">
                  <Package className="w-10 h-10 text-gray-400 mx-auto" />
                  <h3 className="font-heading font-bold text-sm text-gray-800">No Orders Placed Yet</h3>
                  <p className="text-xs text-gray-500">Your completed purchases and package tracking will appear here.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const orderId = order.id || order._id;
                  const displayStatus = order.orderStatus || order.status || 'Placed';
                  const displayTotal = order.totalAmount || order.total || 0;
                  const displayDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : (order.date || 'Today');
                  const displayAddress = typeof order.shippingAddress === 'object'
                    ? `${order.shippingAddress?.flat || ''}, ${order.shippingAddress?.city || ''}`
                    : (order.shippingAddress || order.address || 'Saved Address');
                  const orderItems = order.items || [];

                  return (
                    <div key={orderId} className="bg-gray-50/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-200/80 space-y-4">
                      {/* Order Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-gray-200/60 pb-3">
                        <div>
                          <span className="text-[11px] text-gray-500 font-mono">ORDER ID: <strong className="text-gray-900 font-bold">#{orderId}</strong></span>
                          <p className="text-xs text-gray-500">Placed on {displayDate}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${order.statusColor || 'bg-pink-50 text-pink-700 border-pink-200'}`}>
                            {displayStatus}
                          </span>
                          <span className="font-heading font-black text-base text-gray-900">₹{displayTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <p className="text-xs font-medium text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{order.expectedDelivery || 'Expected delivery in 3-5 business days'}</span>
                      </p>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {orderItems.map((item, i) => {
                          const itemName = item.product?.name || item.name || 'Festive Kidswear Outfit';
                          const itemImg = item.product?.images?.[0] || item.product?.image || item.image || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80';
                          const itemPrice = item.product?.price || item.price || 0;

                          return (
                            <div key={i} className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-100 gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={itemImg} alt={itemName} className="w-14 h-16 object-cover rounded-xl border shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="font-heading font-bold text-xs md:text-sm text-gray-900 truncate">{itemName}</h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5">Size: <strong className="text-gray-800">{item.size || 'Standard'}</strong> • Qty: {item.qty || 1}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-heading font-bold text-sm text-gray-900">₹{itemPrice.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <p className="text-[11px] text-gray-500 min-w-0">
                          Shipping to: <span className="font-medium text-gray-800">{displayAddress}</span>
                        </p>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Download className="w-3.5 h-3.5 shrink-0" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => {
                              const p = products.find((pr) => pr.id === (orderItems[0]?.product?.id || orderItems[0]?.id)) || products[0];
                              addToCart(p, orderItems[0]?.size || '5-6Y');
                            }}
                            className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-gray-900">Saved Shipping Addresses</h2>
                  <p className="text-xs text-gray-500">Manage delivery locations for quick checkout</p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(!showAddAddressModal)}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Modal */}
              {showAddAddressModal && (
                <form onSubmit={handleSaveAddress} className="bg-pink-50/60 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-pink-200 space-y-4">
                  <h3 className="font-heading font-extrabold text-base text-gray-900">New Address Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">Address Label</label>
                      <select
                        value={addressForm.type}
                        onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Parents / Relatives">Parents / Relatives</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">Recipient Name</label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">Flat / House / Building</label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 402, Sunshine Apts"
                        value={addressForm.flat}
                        onChange={(e) => setAddressForm({ ...addressForm, flat: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">Street / Area / Landmark</label>
                      <input
                        type="text"
                        placeholder="e.g. Sector 62, Near Metro Station"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">Pincode</label>
                      <input
                        type="text"
                        placeholder="6-digit Pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-gray-700">City & State</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs mt-1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(false)}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-pink-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col justify-between space-y-4 relative ${addr.isDefault ? 'border-pink-400 bg-pink-50/40 shadow-xs' : 'border-gray-200 bg-white'}`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                          {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-pink-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-xs text-gray-900">{addr.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.flat}, {addr.street}<br />
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-pink-600 inline" /> {addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-xs font-bold text-pink-600 hover:underline cursor-pointer"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Primary Address
                        </span>
                      )}

                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-gray-400 hover:text-red-500 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="min-w-0">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-gray-900">Saved Wishlist ({wishlistProducts.length})</h2>
                  <p className="text-xs text-gray-500">Your favorite outfit choices saved for later</p>
                </div>
                {wishlistProducts.length > 0 && (
                  <Link to="/wishlist" className="text-xs font-bold text-pink-600 hover:underline shrink-0 whitespace-nowrap self-start sm:self-auto">
                    View Full Page Wishlist →
                  </Link>
                )}
              </div>

              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-pink-300 mx-auto" />
                  <h3 className="font-heading font-bold text-base text-gray-800">Your wishlist is empty</h3>
                  <p className="text-xs text-gray-500">Browse collections and tap the heart icon to save favorite outfits!</p>
                  <Link
                    to="/girls"
                    className="inline-block bg-pink-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md mt-2"
                  >
                    Explore Outfits
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="font-heading font-black text-lg sm:text-xl text-gray-900">Account & Notification Settings</h2>
                <p className="text-xs text-gray-500">Control security preferences and communication alerts</p>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-pink-600 shrink-0" /> Communication Preferences
                </h3>

                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer gap-3">
                    <div>
                      <span className="font-bold text-xs text-gray-800">WhatsApp Order Updates</span>
                      <p className="text-[11px] text-gray-500">Receive dispatch notifications & delivery PIN on WhatsApp</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-pink-600 rounded shrink-0 cursor-pointer" />
                  </label>

                  <div className="border-t border-gray-200/60 my-2" />

                  <label className="flex items-center justify-between cursor-pointer gap-3">
                    <div>
                      <span className="font-bold text-xs text-gray-800">Festive Offers & Sale Email Newsletters</span>
                      <p className="text-[11px] text-gray-500">Get early access to festive drop alerts and promo codes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-pink-600 rounded shrink-0 cursor-pointer" />
                  </label>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pink-600 shrink-0" /> Change Security Password
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (passForm.newPass === passForm.confirmPass && passForm.newPass) {
                      showToast('Password updated successfully!');
                      setPassForm({ current: '', newPass: '', confirmPass: '' });
                    } else {
                      showToast('Passwords do not match.');
                    }
                  }}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={passForm.current}
                      onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={passForm.newPass}
                      onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={passForm.confirmPass}
                      onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tax Invoice PDF Modal */}
      <InvoiceModal
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        order={selectedInvoiceOrder}
      />
    </div>
  );
}
