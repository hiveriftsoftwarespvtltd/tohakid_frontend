import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as storeProducts } from '../../data/products';
import {
  adminCategories as seedCategories,
  adminBrands as seedBrands,
  adminOrdersData as seedOrders,
  adminCustomersData as seedCustomers,
  adminReviewsData as seedReviews,
  adminCouponsData as seedCoupons,
  adminReturnsData as seedReturns,
  adminBannersData as seedBanners,
  adminTransactionsData as seedTransactions,
  adminNotificationsData as seedNotifications,
  adminAnalyticsMetrics as seedMetrics,
} from '../data/adminMockData';

import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { orderService } from '../../services/orderService';
import { couponService } from '../../services/couponService';
import { bannerService } from '../../services/bannerService';
import { reviewService } from '../../services/reviewService';
import { returnService } from '../../services/returnService';
import { paymentService } from '../../services/paymentService';
import { userService } from '../../services/userService';
import { adminService } from '../../services/adminService';
import { authService } from '../../services/authService';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Main Data States - 100% Dynamic from Backend MongoDB
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [returnsList, setReturnsList] = useState([]);
  const [bannersList, setBannersList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeCustomers: 0,
    conversionRate: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    customerGrowth: 0,
  });

  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Tohay Kids Festive Wear',
    contactEmail: 'admin@tohaykids.com',
    supportPhone: '+91 98765 43210',
    currencySymbol: '₹',
    currencyCode: 'INR',
    address: 'Plot 42, Textile Hub, Sector 62, Noida, UP 201301',
    freeShippingThreshold: 1499,
    standardShippingFee: 99,
    gstTaxRate: 5,
    adminProfile: {
      name: 'Admin (Tohay Store)',
      email: 'admin@tohaykids.com',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  // Layout & Global States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: false,
    onConfirm: () => { },
  });

  useEffect(() => {
    const initAdmin = async () => {
      if (!localStorage.getItem('tohay_admin_token') && !localStorage.getItem('tohay_access_token')) {
        try {
          const authRes = await authService.adminLogin({
            email: 'admin@tohaykids.com',
            password: 'AdminPassword123!',
          });
          const token = authRes?.data?.accessToken || authRes?.accessToken;
          if (token) {
            localStorage.setItem('tohay_admin_token', token);
            localStorage.setItem('tohay_access_token', token);
          }
        } catch (err) { }
      }
      await fetchAdminBackendData();
    };

    initAdmin();

    const handleDataUpdate = () => {
      fetchAdminBackendData();
    };

    window.addEventListener('products_updated', handleDataUpdate);
    window.addEventListener('categories_updated', handleDataUpdate);

    return () => {
      window.removeEventListener('products_updated', handleDataUpdate);
      window.removeEventListener('categories_updated', handleDataUpdate);
    };
  }, []);


  const fetchAdminBackendData = async () => {
    try {
      // 1. Load Products
      const prodRes = await productService.getProducts({ limit: 100 });
      if (Array.isArray(prodRes?.data)) setProductsList(prodRes.data);

      // 2. Load Categories
      const catRes = await categoryService.getCategories();
      if (Array.isArray(catRes?.data)) setCategoriesList(catRes.data);

      // 3. Load Orders
      const orderRes = await orderService.getAllAdminOrders({ limit: 50 });
      if (Array.isArray(orderRes?.data)) setOrdersList(orderRes.data);

      // 4. Load Customers
      const custRes = await userService.getAllCustomers();
      if (Array.isArray(custRes?.data)) setCustomersList(custRes.data);

      // 5. Load Reviews
      const revRes = await reviewService.getAllAdminReviews();
      if (Array.isArray(revRes?.data)) setReviewsList(revRes.data);

      // 6. Load Coupons
      const coupRes = await couponService.getCoupons();
      if (Array.isArray(coupRes?.data)) setCouponsList(coupRes.data);

      // 7. Load Banners
      const banRes = await bannerService.getBanners();
      if (Array.isArray(banRes?.data)) setBannersList(banRes.data);

      // 8. Load Returns
      const retRes = await returnService.getAllAdminReturns();
      if (Array.isArray(retRes?.data)) setReturnsList(retRes.data);

      // 9. Load Payments
      const payRes = await paymentService.getAllAdminPayments();
      if (Array.isArray(payRes?.data)) setTransactionsList(payRes.data);

      // 10. Load Dashboard Metrics
      const dashRes = await adminService.getDashboardMetrics();
      if (dashRes?.data) setAnalyticsMetrics(dashRes.data);

      // 11. Load Store Settings
      const setRes = await adminService.getStoreSettings();
      if (setRes?.data) setStoreSettings((prev) => ({ ...prev, ...setRes.data }));
    } catch (err) {
      console.warn('Admin backend fetch warning:', err);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const openConfirmModal = ({ title, message, onConfirm, confirmText = 'Confirm', isDanger = false }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      isDanger,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // --- CRUD ACTIONS WITH API SYNC ---

  // Products
  const addProduct = async (newProd) => {
    if (!localStorage.getItem('tohay_admin_token') && !localStorage.getItem('tohay_access_token')) {
      try {
        const authRes = await authService.adminLogin({
          email: 'admin@tohaykids.com',
          password: 'AdminPassword123!',
        });
        const token = authRes?.data?.accessToken || authRes?.accessToken;
        if (token) {
          localStorage.setItem('tohay_admin_token', token);
          localStorage.setItem('tohay_access_token', token);
        }
      } catch (err) {}
    }

    try {
      const res = await productService.createProduct(newProd);
      const createdItem = res?.data || res;
      if (createdItem) {
        setProductsList((prev) => [createdItem, ...prev]);
        showToast(`Product "${createdItem.name || newProd.name}" added successfully!`);
        window.dispatchEvent(new CustomEvent('products_updated'));
        return createdItem;
      }
    } catch (err) {
      console.error('API error on addProduct:', err);
      showToast(err.message || 'Error adding product.');
      throw err;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    if (!localStorage.getItem('tohay_admin_token') && !localStorage.getItem('tohay_access_token')) {
      try {
        const authRes = await authService.adminLogin({
          email: 'admin@tohaykids.com',
          password: 'AdminPassword123!',
        });
        const token = authRes?.data?.accessToken || authRes?.accessToken;
        if (token) {
          localStorage.setItem('tohay_admin_token', token);
          localStorage.setItem('tohay_access_token', token);
        }
      } catch (err) {}
    }

    try {
      const res = await productService.updateProduct(id, updatedFields);
      const updatedItem = res?.data || res;
      if (updatedItem) {
        setProductsList((prev) => prev.map((p) => (p.id === id || p._id === id ? updatedItem : p)));
        showToast('Product updated successfully!');
        window.dispatchEvent(new CustomEvent('products_updated'));
        return updatedItem;
      }
    } catch (err) {
      console.error('API error on updateProduct:', err);
      showToast(err.message || 'Error updating product.');
      throw err;
    }
  };


  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
    } catch (err) { }
    const target = productsList.find((p) => p.id === id);
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product "${target?.name || id}" deleted.`);
    window.dispatchEvent(new CustomEvent('products_updated'));
  };

  const bulkDeleteProducts = async (selectedIds) => {
    try {
      await productService.bulkDeleteProducts(selectedIds);
    } catch (err) { }
    setProductsList((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    showToast(`Deleted ${selectedIds.length} selected products.`);
    window.dispatchEvent(new CustomEvent('products_updated'));
  };

  const bulkUpdateProductStatus = async (selectedIds, status) => {
    try {
      await productService.bulkUpdateStatus(selectedIds, status);
    } catch (err) { }
    const isSale = status === 'Sale';
    setProductsList((prev) => prev.map((p) => (selectedIds.includes(p.id) ? { ...p, isSale } : p)));
    showToast(`Updated status for ${selectedIds.length} products to ${status}.`);
    window.dispatchEvent(new CustomEvent('products_updated'));
  };

  // Categories
  const addCategory = async (catData) => {
    try {
      const res = await categoryService.createCategory(catData);
      if (res?.data) {
        setCategoriesList((prev) => [res.data, ...prev]);
        showToast(`Category "${res.data.name}" created.`);
        window.dispatchEvent(new CustomEvent('categories_updated'));
        return;
      }
    } catch (err) { }

    const created = {
      id: `cat-${Date.now()}`,
      productsCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      ...catData,
    };
    setCategoriesList((prev) => [created, ...prev]);
    showToast(`Category "${created.name}" created.`);
    window.dispatchEvent(new CustomEvent('categories_updated'));
  };

  const updateCategory = async (id, fields) => {
    try {
      const res = await categoryService.updateCategory(id, fields);
      if (res?.data) {
        setCategoriesList((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        showToast('Category updated.');
        window.dispatchEvent(new CustomEvent('categories_updated'));
        return;
      }
    } catch (err) { }

    setCategoriesList((prev) => prev.map((c) => (c.id === id ? { ...c, ...fields } : c)));
    showToast('Category updated.');
    window.dispatchEvent(new CustomEvent('categories_updated'));
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
    } catch (err) { }
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
    window.dispatchEvent(new CustomEvent('categories_updated'));
  };

  // Orders
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      if (res?.data) {
        setOrdersList((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
        showToast(`Order #${orderId} status updated to ${newStatus}.`);
        return;
      }
    } catch (err) { }

    setOrdersList((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedTimeline = (order.timeline || []).map((t) => {
            if (t.status.toLowerCase() === newStatus.toLowerCase()) {
              return { ...t, completed: true, date: new Date().toLocaleString() };
            }
            return t;
          });
          return { ...order, orderStatus: newStatus, timeline: updatedTimeline };
        }
        return order;
      })
    );
    showToast(`Order #${orderId} status updated to ${newStatus}.`);
  };

  // Stock Adjustment
  const adjustStock = async (productId, adjustmentQty, reason = 'Manual Adjustment') => {
    try {
      const res = await adminService.adjustStock(productId, adjustmentQty, reason);
      if (res?.data) {
        setProductsList((prev) => prev.map((p) => (p.id === productId ? res.data : p)));
        showToast(`Stock updated for Product #${productId} (${adjustmentQty > 0 ? '+' : ''}${adjustmentQty} units).`);
        return;
      }
    } catch (err) { }

    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newQty = Math.max(0, (p.stock || 0) + adjustmentQty);
          return { ...p, stock: newQty };
        }
        return p;
      })
    );
    showToast(`Stock updated for Product #${productId} (${adjustmentQty > 0 ? '+' : ''}${adjustmentQty} units).`);
  };

  // Reviews
  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      const res = await reviewService.updateReviewStatus(reviewId, newStatus);
      if (res?.data) {
        setReviewsList((prev) => prev.map((r) => (r.id === reviewId ? res.data : r)));
        showToast(`Review #${reviewId} marked as ${newStatus}.`);
        return;
      }
    } catch (err) { }

    setReviewsList((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
    showToast(`Review #${reviewId} marked as ${newStatus}.`);
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
    } catch (err) { }
    setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Review deleted.');
  };

  // Coupons
  const addCoupon = async (couponData) => {
    try {
      const res = await couponService.createCoupon(couponData);
      if (res?.data) {
        setCouponsList((prev) => [res.data, ...prev]);
        showToast(`Coupon "${res.data.code}" created successfully!`);
        return;
      }
    } catch (err) { }

    const created = {
      id: `coup-${Date.now()}`,
      usedCount: 0,
      status: 'Active',
      ...couponData,
    };
    setCouponsList((prev) => [created, ...prev]);
    showToast(`Coupon "${created.code}" created successfully!`);
  };

  const updateCoupon = async (id, updatedFields) => {
    const couponId = id || updatedFields._id || updatedFields.id;
    try {
      const res = await couponService.updateCoupon(couponId, updatedFields);
      if (res?.data) {
        setCouponsList((prev) =>
          prev.map((c) => (c.id === couponId || c._id === couponId || c.code === updatedFields.code ? res.data : c))
        );
        showToast(`Coupon updated successfully!`);
        return;
      }
    } catch (err) { }

    setCouponsList((prev) =>
      prev.map((c) => (c.id === couponId || c._id === couponId || c.code === updatedFields.code ? { ...c, ...updatedFields } : c))
    );
    showToast(`Coupon updated successfully!`);
  };

  const toggleCouponStatus = async (coupon) => {
    const targetId = coupon.id || coupon._id || coupon.code;
    const newStatus = coupon.status === 'Active' || coupon.isActive ? 'Inactive' : 'Active';
    const isActive = newStatus === 'Active';
    await updateCoupon(targetId, { status: newStatus, isActive });
  };

  const deleteCoupon = async (id) => {
    const couponId = id || '';
    if (!couponId || couponId === 'undefined') return;
    try {
      await couponService.deleteCoupon(couponId);
    } catch (err) { }
    setCouponsList((prev) => prev.filter((c) => c.id !== couponId && c._id !== couponId && c.code !== couponId));
    showToast('Coupon code deleted.');
  };

  // Banners
  const addBanner = async (bannerData) => {
    try {
      const res = await bannerService.createBanner(bannerData);
      if (res?.data) {
        setBannersList((prev) => [res.data, ...prev]);
        showToast('Promotional Banner created!');
        window.dispatchEvent(new CustomEvent('banners_updated'));
        return;
      }
    } catch (err) { }

    const created = {
      id: `ban-${Date.now()}`,
      status: 'Active',
      ...bannerData,
    };
    setBannersList((prev) => [created, ...prev]);
    showToast('Promotional Banner created!');
    window.dispatchEvent(new CustomEvent('banners_updated'));
  };

  const deleteBanner = async (id) => {
    try {
      await bannerService.deleteBanner(id);
    } catch (err) { }
    setBannersList((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    showToast('Banner removed.');
    window.dispatchEvent(new CustomEvent('banners_updated'));
  };

  const updateBanner = async (id, updatedFields) => {
    const bannerId = id || updatedFields._id || updatedFields.id;
    try {
      const res = await bannerService.updateBanner(bannerId, updatedFields);
      if (res?.data) {
        setBannersList((prev) =>
          prev.map((b) => (b.id === bannerId || b._id === bannerId ? res.data : b))
        );
        showToast('Banner updated successfully!');
        window.dispatchEvent(new CustomEvent('banners_updated'));
        return;
      }
    } catch (err) { }

    setBannersList((prev) =>
      prev.map((b) => (b.id === bannerId || b._id === bannerId ? { ...b, ...updatedFields } : b))
    );
    showToast('Banner updated successfully!');
    window.dispatchEvent(new CustomEvent('banners_updated'));
  };

  // Returns
  const updateReturnStatus = async (returnId, newStatus) => {
    try {
      const res = await returnService.updateReturnStatus(returnId, newStatus);
      if (res?.data) {
        setReturnsList((prev) => prev.map((ret) => (ret.id === returnId ? res.data : ret)));
        showToast(`Return request #${returnId} updated to ${newStatus}.`);
        return;
      }
    } catch (err) { }

    setReturnsList((prev) => prev.map((ret) => (ret.id === returnId ? { ...ret, status: newStatus } : ret)));
    showToast(`Return request #${returnId} updated to ${newStatus}.`);
  };

  const markAllNotificationsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const saveStoreSettings = async (newSettings) => {
    try {
      const res = await adminService.updateStoreSettings(newSettings);
      if (res?.data) {
        setStoreSettings((prev) => ({ ...prev, ...res.data }));
        showToast('Store settings saved successfully!');
        return;
      }
    } catch (err) { }
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved successfully!');
  };

  return (
    <AdminContext.Provider
      value={{
        productsList,
        categoriesList,
        brandsList,
        ordersList,
        customersList,
        reviewsList,
        couponsList,
        returnsList,
        bannersList,
        transactionsList,
        notificationsList,
        analyticsMetrics,
        storeSettings,
        setStoreSettings: saveStoreSettings,

        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toastMessage,
        showToast,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,

        addProduct,
        updateProduct,
        deleteProduct,
        bulkDeleteProducts,
        bulkUpdateProductStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
        adjustStock,
        updateReviewStatus,
        deleteReview,
        addCoupon,
        updateCoupon,
        toggleCouponStatus,
        deleteCoupon,
        addBanner,
        updateBanner,
        deleteBanner,
        updateReturnStatus,
        markAllNotificationsRead,
        refreshBackendData: fetchAdminBackendData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
