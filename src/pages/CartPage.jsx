import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import CartDrawer from '../components/CartDrawer';

export default function CartPage() {
  const { setIsCartOpen } = useShop();

  // Keep overlay state closed when visiting the dedicated /cart route
  // and strip any legacy #cart hash from the URL cleanly.
  useEffect(() => {
    setIsCartOpen(false);
    if (window.location.hash === '#cart') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [setIsCartOpen]);

  return <CartDrawer isPageMode />;
}
