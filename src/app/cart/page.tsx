'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
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
    <div className="bg-sonic-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-sonic-850 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sonic-400 mb-1">
              <Link href="/shop" className="hover:text-white flex items-center gap-1">
                <ArrowLeft size={12} /> Continue Shopping
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Shopping Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-sonic-400 hover:text-red-400 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 size={13} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-sonic-900/40 border border-sonic-850 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-sonic-850 border border-sonic-800 flex items-center justify-center mx-auto text-sonic-500">
              <ShoppingBag size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
              <p className="text-xs sm:text-sm text-sonic-400 mt-1.5 max-w-sm mx-auto">
                Looks like you haven&apos;t added any audio equipment yet. Discover our flagship headphones, earbuds, and soundbars.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white px-7 py-3 rounded-xl font-bold text-sm shadow-xl shadow-brand-orange/20 transition-all hover:scale-105"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-4">
                {items.map(item => {
                  const itemImg = item.variant.image_url || item.product.main_image;
                  const unitPrice = item.variant.price ?? item.product.sale_price ?? item.product.base_price;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item.variant_id}
                      className="bg-sonic-900/60 border border-sonic-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-sonic-700"
                    >
                      {/* Product Thumbnail & Names */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-sonic-950 border border-sonic-800 shrink-0 relative">
                          <Image
                            src={itemImg}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                            {item.product.category?.name}
                          </span>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="text-base font-bold text-white hover:text-brand-orange block truncate transition-colors"
                          >
                            {item.product.name}
                          </Link>

                          {/* Color variant swatch & SKU */}
                          <div className="flex items-center gap-2 mt-1 text-xs text-sonic-400">
                             <span
                              className="w-3 h-3 rounded-full border border-sonic-600 shrink-0"
                              style={{ backgroundColor: item.variant.color_hex }}
                            />
                            <span>{item.variant.color_name}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-sonic-500">SKU: {item.variant.sku}</span>
                          </div>

                          <div className="text-xs text-sonic-300 font-mono mt-1">
                            ₹{unitPrice.toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-sonic-800">
                        <QuantitySelector
                          quantity={item.quantity}
                          max={item.variant.stock_quantity}
                          onChange={q => updateQuantity(item.variant_id, q)}
                        />

                        <div className="text-right min-w-[80px]">
                          <div className="text-base font-bold text-white font-mono">
                            ₹{lineTotal.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.variant_id)}
                          className="text-sonic-500 hover:text-red-400 p-2 rounded-lg transition-colors"
                          aria-label="Remove item from cart"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping & Return Policy notice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-sonic-900/40 border border-sonic-850 flex items-center gap-3">
                  <Truck size={20} className="text-brand-orange shrink-0" />
                  <div className="text-xs text-sonic-300">
                    <strong className="text-white block">Free Express Delivery</strong>
                    Orders above ₹999 receive complimentary tracked express dispatch.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sonic-900/40 border border-sonic-850 flex items-center gap-3">
                  <RotateCcw size={20} className="text-brand-orange shrink-0" />
                  <div className="text-xs text-sonic-300">
                    <strong className="text-white block">30-Day In-Home Trial</strong>
                    Test acoustic performance in your environment with full refund guarantee.
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-sonic-900/70 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-24 shadow-2xl">
                <h3 className="text-lg font-bold text-white tracking-tight pb-4 border-b border-sonic-800">
                  Order Summary
                </h3>

                {/* Coupon Code input */}
                <div>
                  <label className="text-xs font-semibold text-sonic-400 block mb-2">
                    Promotional Voucher
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-brand-orange/10 border border-brand-orange/30 p-3 rounded-xl text-xs text-brand-orange">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Tag size={14} />
                        <span>{appliedCoupon.code}</span>
                        <span className="font-normal">(-{appliedCoupon.discount_value}{appliedCoupon.discount_type === 'percentage' ? '%' : '₹'})</span>
                      </div>
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
                        placeholder="e.g. SONIC10"
                        value={inputCode}
                        onChange={e => setInputCode(e.target.value)}
                        className="flex-1 bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2.5 rounded-xl text-xs uppercase focus:outline-none focus:border-brand-orange"
                      />
                      <button
                        type="submit"
                        disabled={isApplying || !inputCode.trim()}
                        className="bg-sonic-800 hover:bg-sonic-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 transition-colors"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>}
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-xs text-sonic-300 pt-2 border-t border-sonic-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-mono">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        <span className="font-mono text-white">₹{shipping.toFixed(2)}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-mono text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-white pt-4 border-t border-sonic-800">
                    <span>Final Total</span>
                    <span className="font-mono text-brand-orange">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/25 transition-all hover:scale-[1.01]"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={17} />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-sonic-400">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>256-Bit SSL Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
