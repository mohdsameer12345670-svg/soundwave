'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { DataService } from '@/lib/data/store';
import { ShippingAddress, OrderItem } from '@/types';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  ChevronLeft,
  Zap,
  Loader2,
} from 'lucide-react';

// ─── Razorpay window type declaration ─────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

// ─── Load Razorpay JS SDK dynamically ─────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Payment method types ──────────────────────────────────────────────────────
type PaymentMethod = 'cash_on_delivery' | 'razorpay';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, tax, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ShippingAddress>({
    first_name: user?.shipping_address?.first_name || user?.full_name?.split(' ')[0] || '',
    last_name: user?.shipping_address?.last_name || user?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || user?.shipping_address?.phone || '',
    street: user?.shipping_address?.street || '',
    apartment: user?.shipping_address?.apartment || '',
    city: user?.shipping_address?.city || '',
    state: user?.shipping_address?.state || '',
    postal_code: user?.shipping_address?.postal_code || '',
    country: user?.shipping_address?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [razorpayLoading, setRazorpayLoading] = useState(false);

  // ─── Empty cart guard ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="bg-sonic-950 min-h-screen py-20 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-sonic-900/60 border border-sonic-800 p-8 rounded-3xl">
          <AlertCircle size={40} className="mx-auto text-amber-400 mb-3" />
          <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
          <p className="text-xs text-sonic-400 mt-2 mb-6">
            Please add audio items to your shopping cart before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-3 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Return to Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // ─── Form helpers ────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postal_code) {
      setErrorMsg('Please complete all required fields (marked with *).');
      return false;
    }
    return true;
  };

  // ─── Build order items snapshot ──────────────────────────────────────────────
  const buildOrderItems = (): OrderItem[] =>
    items.map(item => ({
      id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order_id: '',
      product_id: item.product.id,
      variant_id: item.variant.id,
      product_name: item.product.name,
      color_name: item.variant.color_name,
      sku: item.variant.sku,
      unit_price: item.variant.price ?? item.product.sale_price ?? item.product.base_price,
      quantity: item.quantity,
      line_total: (item.variant.price ?? item.product.sale_price ?? item.product.base_price) * item.quantity,
      image_url: item.variant.image_url || item.product.main_image,
    }));

  // ─── Cash on Delivery flow ───────────────────────────────────────────────────
  const handleCODOrder = async () => {
    setIsSubmitting(true);
    try {
      const newOrder = await DataService.createOrder({
        user_id: user?.id || null,
        customer_name: `${formData.first_name} ${formData.last_name}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData,
        subtotal,
        discount_amount: discount,
        shipping_fee: shipping,
        tax_amount: tax,
        total_amount: total,
        coupon_code: appliedCoupon?.code || null,
        payment_status: 'pending',
        payment_method: 'cash_on_delivery',
        fulfillment_status: 'pending',
        customer_notes: customerNotes || null,
        items: buildOrderItems(),
      });
      clearCart();
      router.push(`/order-confirmation/${newOrder.order_number}`);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ─── Razorpay flow ──────────────────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    setRazorpayLoading(true);
    setErrorMsg('');

    // 1. Load Razorpay JS SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg('Could not load Razorpay SDK. Please check your internet connection.');
      setRazorpayLoading(false);
      return;
    }

    // 2. Create Razorpay order on server
    let rzpOrderId = '';
    let rzpAmount = 0;
    let rzpCurrency = 'INR';

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,          // server converts to paise
          currency: 'INR',
          receipt: `sw_${Date.now()}`,
          notes: {
            customer_name: `${formData.first_name} ${formData.last_name}`.trim(),
            customer_email: formData.email,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.orderId) {
        setErrorMsg(data.error || 'Could not initiate payment. Please try again.');
        setRazorpayLoading(false);
        return;
      }

      rzpOrderId = data.orderId;
      rzpAmount = data.amount;
      rzpCurrency = data.currency;
    } catch {
      setErrorMsg('Network error while creating payment session. Please try again.');
      setRazorpayLoading(false);
      return;
    }

    setRazorpayLoading(false);

    // 3. Open Razorpay checkout modal
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: rzpAmount,
      currency: rzpCurrency,
      name: 'SoundWave',
      description: `Order for ${items.length} item${items.length > 1 ? 's' : ''}`,
      image: '/favicon.ico',
      order_id: rzpOrderId,
      prefill: {
        name: `${formData.first_name} ${formData.last_name}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        shipping_address: `${formData.street}, ${formData.city}`,
      },
      theme: { color: '#f97316' }, // SoundWave orange
      handler: async (response: RazorpayResponse) => {
        // 4. Verify signature server-side
        setIsSubmitting(true);
        try {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            setErrorMsg(verifyData.error || 'Payment verification failed. Contact support with your payment ID.');
            setIsSubmitting(false);
            return;
          }

          // 5. Create order in database ONLY after verified payment
          const newOrder = await DataService.createOrder({
            user_id: user?.id || null,
            customer_name: `${formData.first_name} ${formData.last_name}`.trim(),
            customer_email: formData.email,
            customer_phone: formData.phone,
            shipping_address: formData,
            subtotal,
            discount_amount: discount,
            shipping_fee: shipping,
            tax_amount: tax,
            total_amount: total,
            coupon_code: appliedCoupon?.code || null,
            payment_status: 'paid',
            payment_method: 'razorpay',
            payment_id: response.razorpay_payment_id,
            fulfillment_status: 'pending',
            customer_notes: customerNotes || null,
            items: buildOrderItems(),
          });

          clearCart();
          router.push(`/order-confirmation/${newOrder.order_number}`);
        } catch (err: unknown) {
          setErrorMsg((err as Error).message || 'Payment was received but order creation failed. Please contact support.');
          setIsSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
          setRazorpayLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ─── Form submit ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) return;

    if (paymentMethod === 'cash_on_delivery') {
      await handleCODOrder();
    } else {
      await handleRazorpayPayment();
    }
  };

  const isRazorpayConfigured = !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('XXXX'));

  return (
    <div className="bg-sonic-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/cart" className="text-xs text-sonic-400 hover:text-white flex items-center gap-1 transition-colors">
            <ChevronLeft size={14} /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Lock size={13} />
            <span>Secure 256-bit Encrypted Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── Left Column ── */}
            <div className="lg:col-span-7 space-y-8">

              {/* 1. Contact */}
              <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">1</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">Email Address *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                      placeholder="you@domain.com"
                      className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">Phone Number *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                </div>
              </div>

              {/* 2. Shipping */}
              <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">2</span>
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">First Name *</label>
                    <input type="text" name="first_name" required value={formData.first_name} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">Last Name *</label>
                    <input type="text" name="last_name" required value={formData.last_name} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-sonic-400 block mb-1">Street Address *</label>
                    <input type="text" name="street" required placeholder="123 Audio Boulevard" value={formData.street} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-sonic-400 block mb-1">Apartment / Flat / Area (Optional)</label>
                    <input type="text" name="apartment" placeholder="Flat 4B, Andheri West" value={formData.apartment || ''} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">PIN Code *</label>
                    <input type="text" name="postal_code" required value={formData.postal_code} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                  </div>
                  <div>
                    <label className="text-xs text-sonic-400 block mb-1">Country *</label>
                    <select name="country" value={formData.country} onChange={handleInputChange}
                      className="w-full bg-sonic-950 border border-sonic-750 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-orange">
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs text-sonic-400 block mb-1">Special Delivery Notes</label>
                  <textarea rows={2} placeholder="e.g. Leave with building guard, gate code #4190"
                    value={customerNotes} onChange={e => setCustomerNotes(e.target.value)}
                    className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-orange" />
                </div>
              </div>

              {/* 3. Payment */}
              <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h3>

                <div className="space-y-3 pt-2">
                  {/* Razorpay */}
                  <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-sonic-800 bg-sonic-950/60 hover:border-sonic-700'
                  }`}>
                    <input type="radio" name="payment_method" value="razorpay"
                      checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1 accent-brand-orange" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Razorpay logo SVG */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 12L12 4L20 12L12 20L4 12Z" fill="#072654"/>
                          <path d="M9 12L12 9L15 12L12 15L9 12Z" fill="#3395FF"/>
                        </svg>
                        <span className="text-sm font-bold text-white">Pay Online via Razorpay</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Recommended</span>
                      </div>
                      <p className="text-xs text-sonic-400 mt-1 leading-relaxed">
                        UPI, Credit/Debit Card, Net Banking, Wallets — all in one secure Indian payment gateway.
                      </p>
                      {/* Payment logos row */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {['UPI', 'Visa', 'MC', 'RuPay', 'PayTM'].map(label => (
                          <span key={label} className="text-[10px] bg-sonic-800 text-sonic-300 px-2 py-0.5 rounded font-mono">
                            {label}
                          </span>
                        ))}
                      </div>
                      {!isRazorpayConfigured && (
                        <p className="text-[10px] text-amber-400 mt-2 bg-amber-500/10 px-2 py-1 rounded-lg">
                          ⚠ Add NEXT_PUBLIC_RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to .env.local to enable live payments.
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-sonic-800 bg-sonic-950/60 hover:border-sonic-700'
                  }`}>
                    <input type="radio" name="payment_method" value="cash_on_delivery"
                      checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="mt-1 accent-brand-orange" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote size={16} className="text-brand-orange" />
                        <span className="text-sm font-bold text-white">Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-sonic-400 mt-1 leading-relaxed">
                        Inspect your gear upon delivery. Pay cash or card to the courier.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Trust badges */}
                <div className="flex items-center gap-4 flex-wrap pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-sonic-400">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-sonic-400">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-sonic-400">
                    <Truck size={13} className="text-brand-orange" />
                    <span>Free Returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column: Order Summary ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-sonic-900/70 border border-sonic-800 rounded-3xl p-6 sm:p-8 space-y-6 sticky top-24 shadow-2xl">
                <h3 className="text-base font-bold text-white tracking-tight pb-3 border-b border-sonic-800 flex items-center justify-between">
                  <span>Order Items ({items.length})</span>
                  <Link href="/cart" className="text-xs font-semibold text-brand-orange hover:underline">Edit</Link>
                </h3>

                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => {
                    const itemImg = item.variant.image_url || item.product.main_image;
                    const unitPrice = item.variant.price ?? item.product.sale_price ?? item.product.base_price;
                    return (
                      <div key={item.variant_id} className="flex items-center gap-3 text-xs">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-sonic-850 shrink-0 relative border border-sonic-800">
                          <Image src={itemImg} alt={item.product.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{item.product.name}</h4>
                          <div className="text-[11px] text-sonic-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.variant.color_hex }} />
                            <span>{item.variant.color_name}</span>
                            <span>× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono text-white font-semibold">
                          ₹{(unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing summary */}
                <div className="space-y-2 text-xs text-sonic-300 pt-4 border-t border-sonic-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-mono">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-mono text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-sonic-800">
                    <span>Total</span>
                    <span className="font-mono text-brand-orange">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error */}
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  disabled={isSubmitting || razorpayLoading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/25 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {(isSubmitting || razorpayLoading) ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      <span>{razorpayLoading ? 'Opening Payment...' : 'Processing...'}</span>
                    </>
                  ) : paymentMethod === 'razorpay' ? (
                    <>
                      <Zap size={17} />
                      <span>Pay ₹{total.toFixed(2)} via Razorpay</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order (Cash on Delivery)</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-sonic-400">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>30-Day Money-Back Acoustic Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
