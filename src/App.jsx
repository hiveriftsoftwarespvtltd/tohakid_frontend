import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';

// Store Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileBottomNav from './components/MobileBottomNav';
import WhatsAppButton from './components/WhatsAppButton';

// Store Pages
import HomePage from './pages/HomePage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import BoysPage from './pages/BoysPage';
import GirlsPage from './pages/GirlsPage';
import SiblingsPage from './pages/SiblingsPage';
import ShopByAgePage from './pages/ShopByAgePage';
import CollectionsPage from './pages/CollectionsPage';
import SalePage from './pages/SalePage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import FaqPage from './pages/FaqPage';

// Admin Layout & Pages
import AdminLayout from './admin/layouts/AdminLayout';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminAnalytics from './admin/pages/AdminAnalytics';
import AdminProducts from './admin/pages/AdminProducts';
import AdminProductForm from './admin/pages/AdminProductForm';
import AdminCategories from './admin/pages/AdminCategories';
import AdminSubcategories from './admin/pages/AdminSubcategories';
import AdminOrders from './admin/pages/AdminOrders';
import AdminOrderDetail from './admin/pages/AdminOrderDetail';
import AdminCustomers from './admin/pages/AdminCustomers';
import AdminInventory from './admin/pages/AdminInventory';
import AdminReviews from './admin/pages/AdminReviews';
import AdminCoupons from './admin/pages/AdminCoupons';
import AdminReturns from './admin/pages/AdminReturns';
import AdminBanners from './admin/pages/AdminBanners';
import AdminGenderCards from './admin/pages/AdminGenderCards';
import AdminAgeCards from './admin/pages/AdminAgeCards';
import AdminOccasionCards from './admin/pages/AdminOccasionCards';
import AdminCollectionCards from './admin/pages/AdminCollectionCards';
import AdminCelebrationEdit from './admin/pages/AdminCelebrationEdit';
import AdminInstagramSection from './admin/pages/AdminInstagramSection';
import AdminPrepaidOffer from './admin/pages/AdminPrepaidOffer';
import AdminPayments from './admin/pages/AdminPayments';
import AdminReports from './admin/pages/AdminReports';
import AdminSettings from './admin/pages/AdminSettings';

// Protected Store Profile Guard
function ProtectedProfile({ children }) {
  const { isLoggedIn, showToast } = useShop();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to access your profile account.');
    }
  }, [isLoggedIn, showToast]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Protected Admin Portal Guard
function ProtectedAdminRoute({ children }) {
  const adminToken = localStorage.getItem('tohay_admin_token');
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// Scroll to Top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Global Toast Banner for Customer Store
function ToastBanner() {
  const { toastMessage } = useShop();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce border border-pink-400">
      <span>{toastMessage}</span>
    </div>
  );
}

// Storefront Customer Layout
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFC] pb-16 md:pb-0">
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <ToastBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Authentication Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Suite Routes Hierarchy */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="catalog/products" element={<AdminProducts />} />
            <Route path="catalog/add-product" element={<AdminProductForm />} />
            <Route path="catalog/edit-product/:id" element={<AdminProductForm />} />
            <Route path="catalog/categories" element={<AdminCategories />} />
            <Route path="catalog/subcategories" element={<AdminSubcategories />} />
            <Route path="catalog/reviews" element={<AdminReviews />} />
            <Route path="orders/all" element={<AdminOrders />} />
            <Route path="orders/:filterType" element={<AdminOrders />} />
            <Route path="orders/details/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="marketing/coupons" element={<AdminCoupons />} />
            <Route path="marketing/banners" element={<AdminBanners />} />
            <Route path="marketing/gender-cards" element={<AdminGenderCards />} />
            <Route path="marketing/age-cards" element={<AdminAgeCards />} />
            <Route path="marketing/occasion-cards" element={<AdminOccasionCards />} />
            <Route path="marketing/collection-cards" element={<AdminCollectionCards />} />
            <Route path="marketing/celebration-edit" element={<AdminCelebrationEdit />} />
            <Route path="marketing/instagram-gallery" element={<AdminInstagramSection />} />
            <Route path="marketing/prepaid-offer" element={<AdminPrepaidOffer />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>

          {/* Storefront Customer Routes Hierarchy */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/boys" element={<BoysPage />} />
            <Route path="/girls" element={<GirlsPage />} />
            <Route path="/siblings" element={<SiblingsPage />} />
            {/* <Route path="/collections" element={<CollectionsPage />} /> */}
            <Route path="/collections" element={<Navigate to="/" replace />} />
            {/* <Route path="/sale" element={<SalePage />} /> */}
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedProfile>
                  <ProfilePage />
                </ProtectedProfile>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/help" element={<FaqPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
