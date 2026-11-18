'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';
import { DataService } from '@/lib/data/store';

interface CartContextType {
  items: CartItem[];
  wishlist: string[]; // product IDs
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Totals & calculations
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  totalItemsCount: number;
  
  // Coupon
  appliedCoupon: Coupon | null;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Toast feedback
  toastMessage: string | null;
  clearToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('soundwave_cart');
      if (savedCart) setItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('soundwave_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn('Could not restore saved cart from storage:', e);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('soundwave_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist cart to storage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('soundwave_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Could not persist wishlist to storage:', e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.stock_quantity <= 0) {
      showToast(`Selected variant (${variant.color_name}) is currently out of stock.`);
      return;
    }

    setItems(currentItems => {
      const existingIndex = currentItems.findIndex(i => i.variant_id === variant.id);

      if (existingIndex > -1) {
        const currentQty = currentItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, variant.stock_quantity);
        const updated = [...currentItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated quantity for ${product.name} (${variant.color_name}) in cart.`);
        return updated;
      } else {
        const newItem: CartItem = {
          id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product_id: product.id,
          variant_id: variant.id,
          quantity: Math.min(quantity, variant.stock_quantity),
          product,
          variant,
        };
        showToast(`Added ${product.name} (${variant.color_name}) to your cart.`);
        return [...currentItems, newItem];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item => {
        if (item.variant_id === variantId) {
          const max = item.variant.stock_quantity;
          const validQty = Math.min(quantity, max);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeItem = (variantId: string) => {
    setItems(currentItems => currentItems.filter(item => item.variant_id !== variantId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Financial Calculations
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.variant.price ?? item.product.sale_price ?? item.product.base_price;
    return sum + unitPrice * item.quantity;
  }, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discount = Math.min(appliedCoupon.discount_value, subtotal);
    }
  }

  // Shipping calculation: Free over ₹999, else ₹99
  const shipping = items.length === 0 ? 0 : subtotal >= 999 ? 0 : 99.0;

  // Tax calculation: 8% on discounted subtotal
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = items.length === 0 ? 0 : Math.round(taxableAmount * 0.08 * 100) / 100;

  // Final total
  const total = items.length === 0 ? 0 : Math.max(0, taxableAmount + shipping + tax);

  const totalItemsCount = items.reduce((count, item) => count + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    const res = await DataService.validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setAppliedCoupon(res.coupon);
      showToast(`Coupon "${res.coupon.code}" applied! Saved ₹${res.discount.toFixed(2)}.`);
      return { success: true, message: `Coupon applied: -${res.coupon.discount_value}${res.coupon.discount_type === 'percentage' ? '%' : '₹'}` };
    }
    return { success: false, message: res.message || 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Promo coupon removed.');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        isDrawerOpen,
        setIsDrawerOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        toggleWishlist,
        isInWishlist,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        totalItemsCount,
        appliedCoupon,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        toastMessage,
        clearToast: () => setToastMessage(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
