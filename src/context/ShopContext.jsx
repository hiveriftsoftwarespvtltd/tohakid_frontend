import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as fallbackProducts } from '../data/products';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { bannerService } from '../services/bannerService';
import { categoryService } from '../services/categoryService';
import { couponService } from '../services/couponService';
import { categoriesList as fallbackCategories } from '../data/products';
import { enrichProductWithVariants } from '../utils/variantStorage';

const ShopContext = createContext();

const defaultUserData = {
  name: 'User',
  email: '',
  phone: '',
  gender: '',
  memberTier: 'Member',
  coins: 0,
  walletBalance: 0,
  kids: [],
  notifications: {
    whatsapp: true,
    email: true,
    sms: false
  }
};

const defaultAddressesData = [];
const defaultOrdersData = [];

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [banners, setBanners] = useState([]);
  const [categoriesList, setCategoriesList] = useState(fallbackCategories);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('tohay_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('tohay_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tohay_user');
    return saved ? JSON.parse(saved) : defaultUserData;
  });
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('tohay_addresses');
    return saved ? JSON.parse(saved) : defaultAddressesData;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('tohay_orders');
    return saved ? JSON.parse(saved) : defaultOrdersData;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('tohay_access_token'));
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE'); // 'PERCENTAGE' | 'FIXED'
  const [discountValue, setDiscountValue] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('tohay_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tohay_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('tohay_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tohay_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('tohay_orders', JSON.stringify(orders));
  }, [orders]);

  // Load backend data on startup if server available
  useEffect(() => {
    fetchBackendData();

    const handleProductUpdate = async () => {
      try {
        const prodRes = await productService.getProducts({ limit: 100 });
        if (Array.isArray(prodRes?.data)) {
          setProducts(prodRes.data.map(enrichProductWithVariants));
        }
      } catch (err) {}
    };

    const handleCategoryUpdate = async () => {
      try {
        const catRes = await categoryService.getCategories();
        if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
          setCategoriesList(catRes.data);
        }
      } catch (err) {}
    };

    const handleBannerUpdate = async () => {
      try {
        const banRes = await bannerService.getBanners();
        if (Array.isArray(banRes?.data)) {
          setBanners(banRes.data);
        }
      } catch (err) {}
    };

    window.addEventListener('products_updated', handleProductUpdate);
    window.addEventListener('variants_updated', handleProductUpdate);
    window.addEventListener('categories_updated', handleCategoryUpdate);
    window.addEventListener('banners_updated', handleBannerUpdate);
    return () => {
      window.removeEventListener('products_updated', handleProductUpdate);
      window.removeEventListener('variants_updated', handleProductUpdate);
      window.removeEventListener('categories_updated', handleCategoryUpdate);
      window.removeEventListener('banners_updated', handleBannerUpdate);
    };
  }, []);

  const fetchBackendData = async () => {
    try {
      // 1. Load catalog products from MongoDB backend database
      const prodRes = await productService.getProducts({ limit: 100 });
      if (Array.isArray(prodRes?.data)) {
        setProducts(prodRes.data.map(enrichProductWithVariants));
      }

      // 1b. Load promotional banners
      try {
        const banRes = await bannerService.getBanners();
        if (Array.isArray(banRes?.data)) {
          setBanners(banRes.data);
        }
      } catch (err) { }

      // 1c. Load categories
      try {
        const catRes = await categoryService.getCategories();
        if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
          setCategoriesList(catRes.data);
        }
      } catch (err) {}

      // 2. Check active user session if token exists
      if (localStorage.getItem('tohay_access_token')) {
        const meRes = await authService.getMe();
        if (meRes?.data) {
          setIsLoggedIn(true);
          setUser(meRes.data);

          // Sync cart from backend
          const cartRes = await cartService.getCart();
          if (cartRes?.data?.items) {
            setCart(cartRes.data.items);
            if (cartRes.data.couponCode) {
              setCouponCode(cartRes.data.couponCode);
              setDiscountPercent(cartRes.data.discountPercent || 0);
            }
          }

          // Sync wishlist
          const wishRes = await wishlistService.getWishlist();
          if (wishRes?.data?.productIds) {
            setWishlist(wishRes.data.productIds);
          }

          // Sync addresses
          const addrRes = await addressService.getAddresses();
          if (addrRes?.data) {
            setAddresses(addrRes.data);
          }

          // Sync orders
          const orderRes = await orderService.getMyOrders();
          if (orderRes?.data) {
            setOrders(orderRes.data);
          }
        }
      }
    } catch (err) {
      // Fallback gracefully to offline mock data
    }
  };

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const updateUserProfile = async (updatedFields) => {
    try {
      if (isLoggedIn) {
        const res = await userService.updateMyProfile(updatedFields);
        if (res?.data) {
          setUser(res.data);
          showToast('Profile updated successfully!');
          return;
        }
      }
    } catch (err) { }
    setUser((prev) => ({ ...prev, ...updatedFields }));
    showToast('Profile updated successfully!');
  };

  const addAddress = async (newAddr) => {
    try {
      if (isLoggedIn) {
        const res = await addressService.addAddress(newAddr);
        if (res?.data) {
          setAddresses((prev) => [...prev, res.data]);
          showToast('New address saved!');
          return;
        }
      }
    } catch (err) { }
    const addrWithId = { ...newAddr, id: Date.now(), isDefault: addresses.length === 0 };
    setAddresses((prev) => [...prev, addrWithId]);
    showToast('New address saved!');
  };

  const deleteAddress = async (id) => {
    try {
      if (isLoggedIn && typeof id === 'string' && id.length > 15) {
        await addressService.deleteAddress(id);
      }
    } catch (err) { }
    setAddresses((prev) => prev.filter((a) => a.id !== id && a._id !== id));
    showToast('Address removed.');
  };

  const setDefaultAddress = async (id) => {
    try {
      if (isLoggedIn && typeof id === 'string' && id.length > 15) {
        await addressService.setDefaultAddress(id);
      }
    } catch (err) { }
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id || a._id === id,
      }))
    );
    showToast('Default delivery address updated.');
  };

  const addToCart = async (product, size, qty = 1, extraOptions = {}) => {
    const selectedSize = size || (product.sizes ? product.sizes[0] : 'Standard');

    // Resolve variant price if available
    let itemPrice = Number(extraOptions.price);
    if (!itemPrice || isNaN(itemPrice)) {
      const v = product.sizeVariants?.find((vr) => vr.size === selectedSize);
      itemPrice = v && v.price ? Number(v.price) : Number(product.price || 0);
    }

    try {
      if (isLoggedIn) {
        const res = await cartService.addToCart(product.id, selectedSize, qty, { ...extraOptions, price: itemPrice });
        if (res?.data?.items) {
          setCart(res.data.items);
          showToast(`Added "${product.name}" to bag!`);
          setIsCartOpen(true);
          return;
        }
      }
    } catch (err) { }

    // Offline state fallback
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item.product?.id || item.productId) === product.id && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].qty += qty;
        updated[existingIndex].price = itemPrice;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            productId: product.id,
            size: selectedSize,
            price: itemPrice,
            child1Size: extraOptions.child1Size || null,
            child2Size: extraOptions.child2Size || null,
            qty,
          },
        ];
      }
    });
    showToast(`Added "${product.name}" to bag!`);
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId, size) => {
    try {
      if (isLoggedIn) {
        const res = await cartService.removeFromCart(productId, size);
        if (res?.data?.items) {
          setCart(res.data.items);
          showToast('Item removed from cart.');
          return;
        }
      }
    } catch (err) { }

    setCart((prev) => prev.filter((item) => !((item.product?.id || item.productId) === productId && item.size === size)));
    showToast('Item removed from cart.');
  };

  const updateCartQuantity = async (productId, size, delta) => {
    try {
      if (isLoggedIn) {
        const res = await cartService.updateQuantity(productId, size, delta);
        if (res?.data?.items) {
          setCart(res.data.items);
          return;
        }
      }
    } catch (err) { }

    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.product?.id || item.productId) === productId && item.size === size) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleWishlist = async (productId) => {
    try {
      if (isLoggedIn) {
        const res = await wishlistService.toggleWishlist(productId);
        if (res?.data?.productIds) {
          setWishlist(res.data.productIds);
          const action = res.data.action || 'updated in';
          showToast(`Item ${action} wishlist!`);
          return;
        }
      }
    } catch (err) { }

    let action = '';
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        action = 'removed from';
        return prev.filter((id) => id !== productId);
      } else {
        action = 'added to';
        return [...prev, productId];
      }
    });
    showToast(`Item ${action} wishlist!`);
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      showToast('Please enter a coupon code.');
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const cleanCode = code.trim().toUpperCase();

    try {
      // Validate against database via backend API
      const valRes = await couponService.validateCoupon(cleanCode, cartSubtotal);
      if (valRes?.data) {
        const couponData = valRes.data;
        const dType = couponData.type || 'PERCENTAGE';
        const dVal = couponData.value ?? 0;

        if (isLoggedIn) {
          try {
            await cartService.applyCoupon(cleanCode);
          } catch (e) {
            // Logged-in cart sync
          }
        }

        setCouponCode(couponData.code || cleanCode);
        setDiscountType(dType);
        setDiscountValue(dVal);
        setDiscountPercent(dType === 'PERCENTAGE' ? dVal : 0);

        const msg = dType === 'FIXED' || dType === 'Fixed Amount' ? `₹${dVal} OFF` : `${dVal}% OFF`;
        showToast(`Coupon "${cleanCode}" applied! ${msg}`);
        return { success: true, message: `Coupon "${cleanCode}" applied! ${msg}` };
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Invalid or expired coupon code';
      showToast(errMsg);
      return { success: false, message: errMsg };
    }

    showToast('Invalid or expired coupon code');
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  const removeCoupon = async () => {
    try {
      if (isLoggedIn) {
        await cartService.removeCoupon();
      }
    } catch (err) { }
    setCouponCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(0);
    setDiscountPercent(0);
    showToast('Coupon code removed.');
  };

  const clearCart = async () => {
    try {
      if (isLoggedIn) {
        await cartService.clearCart();
      }
    } catch (err) { }
    setCart([]);
  };

  const loginUser = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res?.data?.user) {
        setIsLoggedIn(true);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`);
        await fetchBackendData();
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      showToast(err.message || 'Login failed.');
      return { success: false, message: err.message || 'Login failed.' };
    }

    // Offline fallback
    setIsLoggedIn(true);
    const userName = email.includes('@') ? email.split('@')[0] : 'Parent';
    const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    const fallbackUser = {
      ...user,
      name: formattedName,
      email: email,
    };
    setUser(fallbackUser);
    showToast(`Welcome back, ${formattedName}!`);
    return { success: true, user: fallbackUser };
  };

  const signupUser = async ({ name, email, phone, password }) => {
    try {
      const res = await authService.signup({ name, email, phone, password });
      if (res?.data?.user) {
        // Do not auto-login user on signup
        localStorage.removeItem('tohay_access_token');
        return { success: true, message: res.message || 'Account created successfully! Please log in.' };
      }
    } catch (err) {
      showToast(err.message || 'Signup failed.');
      return { success: false, message: err.message || 'Signup failed.' };
    }

    return { success: true, message: 'Account created successfully! Please log in.' };
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (err) { }
    setIsLoggedIn(false);
    setUser(defaultUserData);
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    setOrders([]);
    localStorage.removeItem('tohay_access_token');
    localStorage.removeItem('tohay_user');
    localStorage.removeItem('tohay_cart');
    localStorage.removeItem('tohay_wishlist');
    localStorage.removeItem('tohay_addresses');
    localStorage.removeItem('tohay_orders');
    showToast('Logged out successfully');
  };

  const createOrder = async (orderPayload) => {
    try {
      const payloadWithCartItems = {
        items: cart.map((item) => {
          const itemPrice = item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0;
          return {
            productId: item.product?.id || item.productId || 'P1001',
            name: item.product?.name || item.name || 'Festive Outfit',
            price: itemPrice,
            qty: item.qty,
            size: item.size || 'Standard',
            image: item.product?.images?.[0] || item.image || '',
          };
        }),
        subtotal: cartSubtotal,
        discount: discountAmount,
        shipping: shippingFee,
        tax: Math.round(cartSubtotal * 0.05),
        totalAmount: cartTotal,
        ...orderPayload,
      };

      const res = await orderService.createOrder(payloadWithCartItems);
      const createdOrder = res?.data || res?.order;
      if (createdOrder) {
        setOrders((prev) => [createdOrder, ...prev]);
        clearCart();
        return { success: true, order: createdOrder };
      }
    } catch (err) {
      console.warn('Backend order creation warning:', err);
    }

    const randomId = `TK${Math.floor(10000 + Math.random() * 90000)}`;
    const fallbackOrder = {
      id: randomId,
      customerName: orderPayload.shippingAddress?.name || user?.name || 'Valued Parent',
      customerEmail: orderPayload.shippingAddress?.email || user?.email || 'parent@tohaykids.com',
      customerPhone: orderPayload.shippingAddress?.phone || user?.phone || '+91 98765 43210',
      items: cart.map((item) => ({
        product: item.product,
        productId: item.product?.id || item.productId,
        size: item.size,
        price: item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0,
        qty: item.qty,
      })),
      itemsCount: totalCartItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      tax: Math.round(cartSubtotal * 0.05),
      totalAmount: cartTotal,
      paymentMethod: orderPayload.paymentMethod || 'COD',
      paymentStatus: orderPayload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      shippingAddress: orderPayload.shippingAddress,
      timeline: [
        { status: 'Order Placed', time: new Date().toLocaleString(), completed: true, active: true },
        { status: 'Processing', time: 'Expected tomorrow', completed: false, active: false },
        { status: 'Shipped', time: 'Expected in 2 days', completed: false, active: false },
        { status: 'Out for Delivery', time: 'Expected in 3 days', completed: false, active: false },
        { status: 'Delivered', time: 'Expected in 4 days', completed: false, active: false },
      ],
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    clearCart();
    return { success: true, order: fallbackOrder };
  };

  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.price || item.product?.sizeVariants?.find((v) => v.size === item.size)?.price || item.product?.price || 0;
    return acc + itemPrice * item.qty;
  }, 0);
  const discountAmount = Math.round(
    discountType === 'FIXED' || discountType === 'Fixed Amount'
      ? Math.min(cartSubtotal, discountValue)
      : (cartSubtotal * (discountValue || discountPercent || 0)) / 100
  );
  const freeShippingThreshold = 1499;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        banners,
        categoriesList,
        setCategoriesList,
        cart,
        wishlist,
        user,
        isLoggedIn,
        loginUser,
        signupUser,
        logoutUser,
        updateUserProfile,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        createOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        couponCode,
        discountType,
        discountValue,
        discountPercent,
        discountAmount,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        cartSubtotal,
        shippingFee,
        cartTotal,
        totalCartItems,
        clearCart,
        freeShippingThreshold,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
