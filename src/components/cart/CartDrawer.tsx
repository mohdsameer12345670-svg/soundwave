'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { QuantitySelector } from '@/components/ui/QuantitySelector';

export const CartDrawer: React.FC = () => {
  const pathname = usePathname();
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeItem,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Do not render storefront cart drawer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    const res = await applyCoupon(inputCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCode('');
    }
    setIsApplying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-sonic-950 border-l border-sonic-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-sonic-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-brand-orange w-5 h-5" />
              <h2 className="text-lg font-bold text-white tracking-tight">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sonic-850 text-sonic-300">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-sonic-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sonic-900 border border-sonic-800 flex items-center justify-center text-sonic-500">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your cart is empty</h3>
                  <p className="text-xs text-sonic-400 mt-1 max-w-xs">
                    Discover our studio headphones, wireless earbuds, soundbars, and premium audio gear.
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Link href="/shop" onClick={() => setIsDrawerOpen(false)}>
                    CONTINUE SHOPPING
                  </Link>
                </button>
              </div>
            ) : (
              items.map(item => {
                const itemImg = item.variant.image_url || item.product.main_image;
                const unitPrice = item.variant.price ?? item.product.sale_price ?? item.product.base_price;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.variant_id}
                    className="flex gap-3 bg-sonic-900/60 border border-sonic-850 p-3 rounded-xl hover:border-sonic-750 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-sonic-850 shrink-0 relative border border-sonic-800">
                      <Image
                        src={itemImg}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="text-sm font-medium text-white hover:text-brand-orange truncate transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.variant_id)}
                            className="text-sonic-500 hover:text-red-400 p-0.5 transition-colors shrink-0"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Color & SKU */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-sonic-400">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-sonic-600 shrink-0"
                            style={{ backgroundColor: item.variant.color_hex }}
                          />
                          <span className="truncate">{item.variant.color_name}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-sonic-500">{item.variant.sku}</span>
                        </div>
                      </div>

                      {/* Quantity & Line Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-sonic-800/60">
                        <QuantitySelector
                          quantity={item.quantity}
                          max={item.variant.stock_quantity}
                          onChange={q => updateQuantity(item.variant_id, q)}
                          size="sm"
                        />
                        <div className="text-right">
                          <span className="text-sm font-bold text-white">
                            ₹{lineTotal.toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-sonic-400">
                              (₹{unitPrice.toFixed(2)} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals & checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-sonic-850 bg-sonic-900/50 space-y-4">
              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-brand-orange/10 border border-brand-orange/30 px-3 py-2 rounded-lg text-xs text-brand-orange">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag size={12} /> Code <strong>{appliedCoupon.code}</strong> applied (-{appliedCoupon.discount_value}{appliedCoupon.discount_type === 'percentage' ? '%' : '₹'})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-sonic-400 hover:text-white underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SONIC10)"
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      className="flex-1 bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3 py-1.5 rounded-lg text-xs uppercase focus:outline-none focus:border-brand-orange"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !inputCode.trim()}
                      className="bg-sonic-800 hover:bg-sonic-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-sonic-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-sonic-800">
                  <span>Total</span>
                  <span className="text-brand-orange">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.01]"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full bg-sonic-850 hover:bg-sonic-800 text-sonic-200 hover:text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors"
                >
                  View Full Cart & Summary
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-sonic-400">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Encrypted checkout & 30-day money-back guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
