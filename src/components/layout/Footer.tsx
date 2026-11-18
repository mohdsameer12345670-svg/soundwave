'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Volume2, ShieldCheck, Truck, Headphones, RotateCcw, Send, CheckCircle2 } from 'lucide-react';
import { DataService } from '@/lib/data/store';
import { useAuth } from '@/context/AuthContext';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { isSupabaseLive } = useAuth();
  const [email, setEmail] = useState('');
  const [subMessage, setSubMessage] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Do not render storefront footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    const res = await DataService.subscribeNewsletter(email);
    setSubSuccess(res.success);
    setSubMessage(res.message);
    if (res.success) setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-sonic-950 border-t border-sonic-850 pt-16 pb-12 text-sonic-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Props Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-sonic-850">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Delivery</h4>
              <p className="text-xs text-sonic-400 mt-0.5">Complimentary express dispatch on orders over ₹999.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">2-Year Official Warranty</h4>
              <p className="text-xs text-sonic-400 mt-0.5">Comprehensive coverage against component defects.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Acoustic Trial</h4>
              <p className="text-xs text-sonic-400 mt-0.5">Listen in your own space. Hassle-free returns.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/25 flex items-center justify-center text-brand-orange shrink-0">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Acoustic Specialist Support</h4>
              <p className="text-xs text-sonic-400 mt-0.5">Direct consultation with sound design engineers.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-sonic-850">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-white">
                <Volume2 size={20} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                SONIC<span className="text-brand-orange">WAVE</span>
              </span>
            </Link>
            <p className="text-xs text-sonic-400 leading-relaxed max-w-sm">
              SoundWave creates reference-grade acoustic electronics. Every driver, voice coil, and acoustic chamber is tuned for uncompromising fidelity, spatial realism, and enduring luxury.
            </p>
            <div className="pt-2 text-xs text-sonic-400">
              <div>Email: <a href="mailto:support@soundwave.audio" className="text-white hover:text-brand-orange">support@soundwave.audio</a></div>
              <div>Acoustic Lab: San Francisco, CA & Stockholm, Sweden</div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Acoustic Gear</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop?category=headphones" className="hover:text-white transition-colors">Over-Ear ANC Headphones</Link></li>
              <li><Link href="/shop?category=wireless-earbuds" className="hover:text-white transition-colors">True Wireless Earbuds</Link></li>
              <li><Link href="/shop?category=soundbars" className="hover:text-white transition-colors">Dolby Atmos Soundbars</Link></li>
              <li><Link href="/shop?category=bluetooth-speakers" className="hover:text-white transition-colors">Bluetooth Outdoor Speakers</Link></li>
              <li><Link href="/shop?category=gaming-headsets" className="hover:text-white transition-colors">Lossless Gaming Headsets</Link></li>
              <li><Link href="/shop?category=earphones" className="hover:text-white transition-colors">Audiophile IEMs</Link></li>
            </ul>
          </div>

          {/* Store & Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/account" className="hover:text-white transition-colors">Order Tracking & History</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Acoustic Philosophy</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Warranty Registration</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Store Admin Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Soundwave Insiders</h4>
            <p className="text-xs text-sonic-400">
              Receive private audio drop notifications, firmware updates, and 10% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-sonic-900 border border-sonic-750 text-white placeholder-sonic-500 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 bg-brand-orange hover:bg-brand-orange-hover text-white px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <Send size={12} />
                </button>
              </div>
              {subMessage && (
                <p className={`text-[11px] flex items-center gap-1 ${subSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                  {subSuccess && <CheckCircle2 size={12} />} {subMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom copyright & database mode verification */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sonic-500">
          <p>© 2026 SoundWave Audio Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            
          </div>
        </div>
      </div>
    </footer>
  );
};
