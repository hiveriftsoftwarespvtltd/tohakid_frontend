import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import CartDrawer from '../components/CartDrawer';

export default function CartPage() {
  const { isCartOpen, setIsCartOpen } = useShop();

  useEffect(() => {
    if (!isCartOpen) {
      setIsCartOpen(true);
    }
  }, [isCartOpen, setIsCartOpen]);

  return <CartDrawer />;
}
