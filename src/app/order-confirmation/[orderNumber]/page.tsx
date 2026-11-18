'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { DataService } from '@/lib/data/store';
import { Order } from '@/types';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5500', '#f59e0b', '#ffffff'],
      });
    } catch {
      // ignore
    }

    async function fetchOrder() {
      if (orderNumber) {
        const found = await DataService.getOrderByNumber(orderNumber);
        setOrder(found);
      }
      setIsLoading(false);
    }

    fetchOrder();
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="bg-sonic-950 min-h-screen py-24 text-center text-sonic-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-sonic-950 min-h-screen py-24 text-center p-4">
        <h2 className="text-xl font-bold text-white">Order Details Not Found</h2>
        <p className="text-xs text-sonic-400 mt-2 mb-6">
          Order number #{orderNumber} could not be located in current records.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-sonic-950 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 size={42} />
          </div>

          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-sonic-300 mt-2 max-w-lg mx-auto">
              We&apos;ve sent a full acoustic breakdown and receipt to <strong className="text-white">{order.customer_email}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-sonic-900 border border-sonic-800 px-4 py-2 rounded-xl text-xs font-mono text-sonic-200">
            <span>Order Number:</span>
            <strong className="text-white text-sm">{order.order_number}</strong>
          </div>
        </div>

        {/* Order Details Container */}
        <div className="bg-sonic-900/60 border border-sonic-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Status Timeline */}
          <div className="p-4 bg-sonic-950 rounded-2xl border border-sonic-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
              <div>
                <span className="text-sonic-400 block text-[11px]">Fulfillment Status</span>
                <span className="text-white font-bold capitalize">{order.fulfillment_status}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sonic-850 text-sonic-300 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <span className="text-sonic-400 block text-[11px]">Estimated Dispatch</span>
                <span className="text-white font-bold">Within 24 Hours</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sonic-850 text-sonic-300 flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <div>
                <span className="text-sonic-400 block text-[11px]">Payment Method</span>
                <span className="text-white font-bold capitalize">{order.payment_method.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-sonic-800">
              Purchased Sound Systems
            </h3>

            <div className="space-y-3">
              {order.items?.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3.5 bg-sonic-950/60 rounded-xl border border-sonic-850"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image_url && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-sonic-900 relative shrink-0 border border-sonic-800">
                        <Image src={item.image_url} alt={item.product_name} fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.product_name}</h4>
                      <div className="text-[11px] text-sonic-400 flex items-center gap-2 mt-0.5">
                        <span>Color: {item.color_name}</span>
                        <span>•</span>
                        <span className="font-mono">SKU: {item.sku}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-white font-mono">
                      ₹{item.line_total.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-sonic-400">
                      Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Price Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-sonic-800">
            {/* Delivery address */}
            <div className="space-y-2 text-xs text-sonic-300">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-brand-orange" /> Shipping Destination
              </h4>
              <p className="font-semibold text-white">{order.customer_name}</p>
              <p>{order.shipping_address.street} {order.shipping_address.apartment}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              <p>{order.shipping_address.country}</p>
              <p className="pt-1 text-sonic-400">Contact: {order.customer_phone || order.customer_email}</p>
            </div>

            {/* Totals */}
            <div className="space-y-2 text-xs text-sonic-300 bg-sonic-950/60 p-4 rounded-2xl border border-sonic-850">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping_fee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${order.shipping_fee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono text-white">₹{order.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-sonic-800">
                <span>Total Paid</span>
                <span className="font-mono text-brand-orange">₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-sonic-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/account"
              className="w-full sm:w-auto bg-sonic-850 hover:bg-sonic-800 text-white px-6 py-3 rounded-xl text-xs font-bold border border-sonic-700 text-center transition-colors"
            >
              View Order in Customer Portal
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-white px-7 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 transition-all hover:scale-105"
            >
              <span>Continue Audio Discovery</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
