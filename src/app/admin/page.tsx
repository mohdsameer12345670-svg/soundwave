'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DataService } from '@/lib/data/store';
import { Order } from '@/types';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  Activity,
  Zap,
  BarChart3,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1400 }: {
  target: number; prefix?: string; suffix?: string; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let raf: number;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  // Format like currency if prefix is ₹
  if (prefix === '₹') {
    return (
      <span>
        {prefix}
        {display.toLocaleString('en-IN')}
        {suffix}
      </span>
    );
  }
  return <span>{prefix}{display.toLocaleString()}{suffix}</span>;
}

// ─── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ color, data }: { color: string; data: number[] }) {
  const w = 80, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const fillPts = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color})`} />
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Build real sparkline from actual value ────────────────────────────────────
const SPARKLINES: Record<string, number[]> = {};
function buildSparkline(target: number): number[] {
  if (target === 0) return [0,0,0,0,0,0,0,0,0,0];
  return Array.from({ length: 10 }, (_, i) => Math.round((i / 9) * target));
}

interface StatsState {
  totalOrders: number;
  totalSales: number;
  activeProducts: number;
  uniqueCustomers: number;
  lowStockAlerts: { product: string; variant: string; stock: number; sku: string }[];
  recentOrders: Order[];
}

// ─── Status badge config ──────────────────────────────────────────────────────
const paymentBadge = (s: string) => {
  if (s === 'paid') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (s === 'failed') return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
};
const fulfillBadge = (s: string) => {
  if (s === 'delivered') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (s === 'shipped')   return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  if (s === 'processing') return 'bg-violet-500/15 text-violet-400 border-violet-500/30';
  if (s === 'cancelled') return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  return 'bg-sonic-800 text-sonic-400 border-sonic-700';
};

// ─── Framer variants ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,   transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<StatsState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadStats = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setRefreshing(true);
    try {
      const data = await DataService.getAdminStats();
      setStats(data);
      setLastRefreshed(new Date());
    } catch (e) {
      console.error('Error fetching admin stats:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  // ─── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading || !stats) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-sonic-850 rounded-2xl w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-36 bg-sonic-900 border border-sonic-800 rounded-3xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-sonic-900 border border-sonic-800 rounded-3xl" />
            <div className="h-80 bg-sonic-900 border border-sonic-800 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Total Net Sales',
      value: stats.totalSales,
      prefix: '₹',
      icon: IndianRupee,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      borderGlow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
      gradientBorder: 'from-emerald-500/30 via-emerald-400/10 to-transparent',
      sparkData: buildSparkline(Math.round(stats.totalSales)),
      sparkColor: '#34d399',
      detail: 'Verified & settled',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      prefix: '',
      icon: ShoppingBag,
      color: 'text-brand-orange',
      iconBg: 'bg-brand-orange/15',
      borderGlow: 'hover:border-brand-orange/40 hover:shadow-brand-orange/10',
      gradientBorder: 'from-orange-500/30 via-orange-400/10 to-transparent',
      sparkData: buildSparkline(stats.totalOrders),
      sparkColor: '#ff5500',
      detail: `${stats.recentOrders.length} recent`,
    },
    {
      label: 'Active Gear',
      value: stats.activeProducts,
      prefix: '',
      icon: Package,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      borderGlow: 'hover:border-blue-500/40 hover:shadow-blue-500/10',
      gradientBorder: 'from-blue-500/30 via-blue-400/10 to-transparent',
      sparkData: buildSparkline(stats.activeProducts),
      sparkColor: '#60a5fa',
      detail: 'Published products',
    },
    {
      label: 'Customers',
      value: stats.uniqueCustomers,
      prefix: '',
      icon: Users,
      color: 'text-violet-400',
      iconBg: 'bg-violet-500/15',
      borderGlow: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
      gradientBorder: 'from-violet-500/30 via-violet-400/10 to-transparent',
      sparkData: buildSparkline(stats.uniqueCustomers),
      sparkColor: '#a78bfa',
      detail: 'Registered accounts',
    },
  ];

  const timeAgo = () => {
    const secs = Math.floor((Date.now() - lastRefreshed.getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ago`;
  };

  return (
    <motion.div
      className="space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-7 border-b border-sonic-850/80">
        <div className="space-y-1">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/25 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-[11px] font-bold text-brand-orange uppercase tracking-widest">Live Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Store{' '}
            <span className="text-gradient-orange">Performance</span>
          </h1>
          <p className="text-sm text-sonic-400 mt-1.5">
            Real-time audio inventory · transaction logs · fulfilment tracking
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Refresh */}
          <button
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-sonic-400 hover:text-white bg-sonic-900 border border-sonic-800 hover:border-sonic-700 px-3 py-2 rounded-xl transition-all"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{timeAgo()}</span>
          </button>
          <Link
            href="/admin/products"
            className="bg-brand-orange hover:bg-brand-orange-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Package size={13} /> Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="bg-sonic-850 hover:bg-sonic-800 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-sonic-750 hover:border-sonic-700 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag size={13} /> Orders
          </Link>
        </div>
      </motion.div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative p-5 rounded-3xl bg-sonic-900 border border-sonic-800 ${kpi.borderGlow} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-default`}
            >
              {/* Animated gradient top border */}
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${kpi.gradientBorder}`} />

              {/* Subtle background glow blob */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${kpi.iconBg} blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />

              {/* Icon + label */}
              <div className="flex items-center justify-between mb-4 relative">
                <span className="text-xs font-semibold text-sonic-400 tracking-wide">{kpi.label}</span>
                <div className={`w-10 h-10 rounded-2xl ${kpi.iconBg} flex items-center justify-center ${kpi.color} shadow-inner`}>
                  <Icon size={18} />
                </div>
              </div>

              {/* Value */}
              <div className="text-3xl font-black text-white tracking-tight tabular-nums relative">
                <AnimatedCounter target={kpi.value} prefix={kpi.prefix} duration={1200 + index * 100} />
              </div>

              {/* Sparkline + detail */}
              <div className="flex items-end justify-between mt-3 relative">
                <div className="space-y-0.5">
                  <p className="text-[11px] text-sonic-500">{kpi.detail}</p>
                </div>
                <Sparkline color={kpi.sparkColor} data={kpi.sparkData} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Quick Nav Cards ───────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Products', href: '/admin/products', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Orders',   href: '/admin/orders',   icon: ShoppingBag, color: 'text-brand-orange', bg: 'bg-brand-orange/10', border: 'border-brand-orange/20' },
          { label: 'Customers', href: '/admin/customers', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
          { label: 'Categories', href: '/admin/categories', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(nav => {
          const Icon = nav.icon;
          return (
            <motion.div key={nav.href} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={nav.href}
                className={`flex items-center gap-3 p-4 rounded-2xl bg-sonic-900 border ${nav.border} hover:border-opacity-60 transition-all group`}
              >
                <div className={`w-8 h-8 rounded-xl ${nav.bg} flex items-center justify-center ${nav.color} shrink-0`}>
                  <Icon size={15} />
                </div>
                <span className="text-sm font-semibold text-sonic-200 group-hover:text-white transition-colors">{nav.label}</span>
                <ChevronRight size={14} className="ml-auto text-sonic-600 group-hover:text-sonic-400 transition-colors" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders Table */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-sonic-900 border border-sonic-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-sonic-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
                <Clock size={16} className="text-brand-orange" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Recent Orders</h3>
                <p className="text-[11px] text-sonic-500">Latest purchase requests</p>
              </div>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors group"
            >
              View all <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Table */}
          {stats.recentOrders.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-sonic-500">
              <Activity size={32} className="text-sonic-700" />
              <p className="text-sm">No orders registered yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-sonic-500 border-b border-sonic-800/60">
                    <th className="px-6 py-3 font-semibold tracking-wide">Order</th>
                    <th className="px-4 py-3 font-semibold tracking-wide">Customer</th>
                    <th className="px-4 py-3 font-semibold tracking-wide">Total</th>
                    <th className="px-4 py-3 font-semibold tracking-wide">Payment</th>
                    <th className="px-4 py-3 font-semibold tracking-wide">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {stats.recentOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                        className="border-b border-sonic-800/40 hover:bg-sonic-850/70 transition-colors group"
                      >
                        <td className="px-6 py-3.5">
                          <span className="font-mono font-bold text-brand-orange text-[11px] tracking-wide">
                            {order.order_number}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-sonic-100 truncate max-w-[130px]">{order.customer_name}</p>
                          <p className="text-[10px] text-sonic-500 truncate max-w-[130px]">{order.customer_email}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-white font-mono">
                          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.total_amount)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${paymentBadge(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase border ${fulfillBadge(order.fulfillment_status)}`}>
                            {order.fulfillment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link href="/admin/orders" className="text-sonic-600 hover:text-sonic-300 transition-colors opacity-0 group-hover:opacity-100">
                            <ExternalLink size={13} />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          variants={itemVariants}
          className="bg-sonic-900 border border-sonic-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-sonic-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle size={16} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Low Stock</h3>
                <p className="text-[11px] text-sonic-500">Below 15 units</p>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
              stats.lowStockAlerts.length > 0
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              {stats.lowStockAlerts.length} alert{stats.lowStockAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
            {stats.lowStockAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center gap-3 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={26} className="text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-white">All stocked up!</p>
                <p className="text-xs text-sonic-500">All product variants have adequate inventory.</p>
              </motion.div>
            ) : (
              stats.lowStockAlerts.map((alert, i) => {
                const pct = Math.min(100, Math.round((alert.stock / 15) * 100));
                const barColor = alert.stock <= 5 ? 'bg-rose-500' : alert.stock <= 10 ? 'bg-amber-500' : 'bg-yellow-400';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-3.5 rounded-2xl bg-sonic-950 border border-sonic-800/70 hover:border-sonic-700 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{alert.product}</p>
                        <p className="text-[10px] text-sonic-500 mt-0.5">
                          <span className="text-sonic-400">{alert.variant}</span> · {alert.sku}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-black font-mono border ${
                        alert.stock <= 5
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {alert.stock} left
                      </span>
                    </div>
                    {/* Stock bar */}
                    <div className="h-1.5 rounded-full bg-sonic-800 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-5 py-4 border-t border-sonic-800/70">
            <Link
              href="/admin/products"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-sonic-300 hover:text-white transition-colors py-1.5 rounded-xl hover:bg-sonic-850 px-3"
            >
              <Zap size={12} className="text-brand-orange" />
              Update Inventory
              <ExternalLink size={11} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
