'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Shield,
  Waves,
  Check,
  ShoppingBag,
  ArrowRight,
  Radio,
  Wind,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

const pulseEarbudsProduct: Product = {
  id: 'p0000000-0000-0000-0000-000000000002',
  category_id: 'c0000000-0000-0000-0000-000000000002',
  name: 'SoundWave Pulse Earbuds Pro',
  slug: 'soundwave-pulse-earbuds-pro',
  short_description: 'Compact true wireless earbuds with dynamic head tracking, IPX7 waterproof rating, and Qi wireless charging.',
  description: 'Experience sound that moves with you. The SoundWave Pulse Earbuds Pro deliver spatial 360-degree theater audio in a compact, ergonomic in-ear footprint.',
  base_price: 199.99,
  sale_price: 169.99,
  main_image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
  gallery_images: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80',
  ],
  is_active: true,
  is_featured: true,
  is_new_arrival: true,
  is_best_seller: false,
  rating: 4.8,
  review_count: 89,
  features: [
    'Spatial 360-degree Dynamic Audio with Head Tracking',
    'Dual 11mm Beryllium Dynamic Drivers',
    'IPX7 Sweat and Water Resistance',
    'Wireless Qi Fast Charging Aluminum Case',
  ],
  specifications: {
    Driver: '11mm Beryllium Dynamic',
    'Frequency Response': '15Hz - 28,000Hz',
    Battery: '9h earbuds + 27h case',
    'Waterproof Rating': 'IPX7',
  },
  variants: [
    {
      id: 'v-pulse-black',
      product_id: 'p0000000-0000-0000-0000-000000000002',
      color_name: 'Matte Obsidian',
      color_hex: '#111111',
      sku: 'SW-PLS-BLK',
      stock_quantity: 25,
      is_active: true,
      price: 169.99,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'v-pulse-white',
      product_id: 'p0000000-0000-0000-0000-000000000002',
      color_name: 'Arctic Pearl',
      color_hex: '#F3F4F6',
      sku: 'SW-PLS-WHT',
      stock_quantity: 18,
      is_active: true,
      price: 169.99,
      image_url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'v-pulse-orange',
      product_id: 'p0000000-0000-0000-0000-000000000002',
      color_name: 'Cyber Orange',
      color_hex: '#FF5500',
      sku: 'SW-PLS-ORG',
      stock_quantity: 12,
      is_active: true,
      price: 169.99,
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    },
  ],
};

const COLORWAYS = [
  {
    id: 'black',
    name: 'Matte Obsidian',
    hex: '#111111',
    accent: '#FF5500',
    glow: 'rgba(255, 85, 0, 0.3)',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'white',
    name: 'Arctic Pearl',
    hex: '#F3F4F6',
    accent: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.3)',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'orange',
    name: 'Cyber Orange',
    hex: '#FF5500',
    accent: '#FF5500',
    glow: 'rgba(255, 85, 0, 0.45)',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  },
];

const AUDIO_MODES = [
  {
    id: 'spatial',
    name: 'Spatial 360° Theater',
    desc: 'Dynamic Gyro Head-Tracking for immersive soundstage',
    icon: Radio,
    eqSpeed: [1.2, 0.7, 1.4, 0.9, 1.6, 1.1, 1.5, 0.8],
  },
  {
    id: 'anc',
    name: 'Silent ANC 45dB',
    desc: 'Inverse acoustic wave cancels 99.4% ambient noise',
    icon: Shield,
    eqSpeed: [0.4, 0.3, 0.5, 0.2, 0.4, 0.3, 0.4, 0.2],
  },
  {
    id: 'transparency',
    name: 'Crystal Transparency',
    desc: 'Binaural microphones pass ambient voices naturally',
    icon: Wind,
    eqSpeed: [0.9, 1.3, 0.8, 1.5, 1.0, 1.4, 0.9, 1.2],
  },
];

export const EarbudsShowcaseAnimation: React.FC = () => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState(COLORWAYS[0]);
  const [activeMode, setActiveMode] = useState(AUDIO_MODES[0]);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [isEjected, setIsEjected] = useState(true);

  const handleAddToCart = () => {
    const variant =
      pulseEarbudsProduct.variants?.find(
        (v) => v.color_name.toLowerCase() === selectedColor.name.toLowerCase()
      ) || pulseEarbudsProduct.variants?.[0]!;

    addItem(pulseEarbudsProduct, variant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const hotspots = [
    {
      id: 1,
      title: '11mm Bio-Carbon Driver',
      desc: 'Deep 10Hz sub-bass and glistening 40kHz acoustic clarity',
      pos: 'top-10 left-6 lg:left-14',
      tag: 'Acoustic Core',
    },
    {
      id: 2,
      title: 'AI Quad-Mic Array',
      desc: 'Wind-resistant beamforming suppresses 40km/h wind noise',
      pos: 'top-10 right-6 lg:right-14',
      tag: 'Voice Clarity',
    },
    {
      id: 3,
      title: 'Capacitive Precision Touch',
      desc: 'Tap for volume, gesture-slide for tracks, long press for ANC',
      pos: 'bottom-16 left-6 lg:left-14',
      tag: 'Smart Control',
    },
    {
      id: 4,
      title: 'IPX7 Waterproof & Qi Charge',
      desc: 'Submersible sweatproof design with 36hr wireless case backup',
      pos: 'bottom-16 right-6 lg:right-14',
      tag: 'Endurance',
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-sonic-950 via-sonic-900/40 to-sonic-950 border-b border-sonic-850 overflow-hidden">
      {/* Background Ambient Lighting and Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full blur-3xl opacity-25 transition-all duration-700"
          style={{ background: selectedColor.glow }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-[11px] font-bold text-brand-orange uppercase tracking-widest shadow-sm"
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>Next-Gen True Wireless · Acoustic Emergence</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
          >
            Acoustic Emergence.{' '}
            <span className="text-gradient-orange">Floating Architecture.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-sonic-400 leading-relaxed"
          >
            Watch the SoundWave Pulse Pro levitate seamlessly from its charging dock. Tap to interact
            with its magnetic emergence animation and acoustic resonance.
          </motion.p>
        </div>

        {/* ── SHOWCASE ARENA ── */}
        <div className="relative bg-sonic-950/85 border border-sonic-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top Control Bar: Colorway & Live Mode selector & Eject Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6 border-b border-sonic-850/80">
            {/* Color Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-sonic-400 uppercase tracking-wider">
                Finish:
              </span>
              <div className="flex items-center gap-2 bg-sonic-900/90 border border-sonic-800 px-3 py-1.5 rounded-2xl">
                {COLORWAYS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`relative w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      selectedColor.id === c.id
                        ? 'scale-110 ring-2 ring-brand-orange ring-offset-2 ring-offset-sonic-950'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`Select ${c.name} color`}
                  >
                    {selectedColor.id === c.id && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
                <span className="text-xs font-semibold text-white ml-2">
                  {selectedColor.name}
                </span>
              </div>
            </div>

            {/* Audio Modes Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0">
              {AUDIO_MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode.id === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25 scale-105'
                        : 'bg-sonic-900/70 text-sonic-400 hover:text-white hover:bg-sonic-850 border border-sonic-800'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{mode.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CENTRAL FLOATING EARBUD EMERGING FROM CASE STAGE ── */}
          <div className="relative min-h-[460px] sm:min-h-[500px] flex flex-col items-center justify-center my-4 select-none">
            {/* Concentric Sonic Wave Ripple Rings radiating from the dock */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border border-brand-orange/25"
                  style={{ width: `${ring * 240}px`, height: `${ring * 240}px` }}
                  animate={{
                    scale: [0.92, 1.18, 0.92],
                    opacity: [0.35, 0.08, 0.35],
                  }}
                  transition={{
                    duration: 3.5 + ring,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: ring * 0.4,
                  }}
                />
              ))}
            </div>

            {/* Magnetic Levitation Beam from Dock to Earbud */}
            <div className="absolute w-24 h-48 bottom-28 bg-gradient-to-t from-brand-orange/30 via-brand-orange/15 to-transparent blur-xl pointer-events-none" />

            {/* ── THE SINGLE LEVITATING EARBUD (EMERGING FROM THE CASE) ── */}
            <motion.div
              className="relative z-20 cursor-pointer"
              animate={
                isEjected
                  ? {
                      y: [-45, -75, -45], // High levitation in air out of case
                      scale: [1, 1.06, 1], // Expands toward camera
                      rotate: [-3, 3, -3],
                    }
                  : {
                      y: [0, 8, 0], // Settled into dock
                      scale: [0.88, 0.88, 0.88],
                      rotate: [0, 0, 0],
                    }
              }
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.12 }}
              onClick={() => setIsEjected(!isEjected)}
              title="Click to Dock or Eject Earbud"
            >
              <div className="relative w-48 sm:w-56 aspect-[4/3] rounded-3xl overflow-hidden border border-brand-orange/50 shadow-2xl bg-sonic-950 group backdrop-blur-md">
                <Image
                  src={selectedColor.image}
                  alt="SoundWave Pulse Pro Emerging Earbud"
                  fill
                  sizes="240px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sonic-950 via-transparent to-transparent opacity-85" />

                {/* Floating Status Pill */}
                <div className="absolute bottom-3 left-3 bg-sonic-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-brand-orange/40 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                  <span>{isEjected ? 'Levitating in Air' : 'Docked in Case'}</span>
                </div>

                {/* Dynamic Soundwave Frequency Indicator */}
                <div className="absolute top-3 right-3 flex items-end gap-1 h-5 bg-sonic-950/85 px-2.5 py-1 rounded-lg border border-sonic-800">
                  {activeMode.eqSpeed.map((speed, idx) => (
                    <motion.span
                      key={idx}
                      className="w-1 bg-brand-orange rounded-full"
                      animate={{ height: ['4px', '16px', '4px'] }}
                      transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic Drop Shadow beneath floating earbud */}
              <motion.div
                className="w-36 h-5 mx-auto bg-black/60 rounded-full blur-md mt-3"
                animate={
                  isEjected
                    ? { scale: [0.65, 0.45, 0.65], opacity: [0.4, 0.2, 0.4] }
                    : { scale: [1, 1, 1], opacity: [0.8, 0.8, 0.8] }
                }
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* ── CHARGING DOCK / SHOWCASE BASE ── */}
            <div className="relative z-10 -mt-2 flex flex-col items-center">
              <div className="relative w-64 sm:w-80 h-16 rounded-full bg-gradient-to-b from-sonic-850 via-sonic-900 to-sonic-950 border-2 border-sonic-750/90 shadow-2xl flex items-center justify-between px-6">
                {/* Glowing Magnetic Docking Chamber */}
                <div className="absolute inset-x-8 top-1 h-2 bg-gradient-to-r from-transparent via-brand-orange to-transparent blur-xs opacity-75" />

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-sonic-300 uppercase font-mono">
                    Chamber Open
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEjected(!isEjected)}
                  className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange hover:text-white bg-sonic-950/90 border border-brand-orange/40 px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                  {isEjected ? 'Dock in Case ↓' : 'Eject Earbud ↑'}
                </button>

                <div className="flex items-center gap-1 text-[10px] text-sonic-400 font-mono">
                  <Zap size={11} className="text-amber-400" />
                  <span>100% Qi Fast</span>
                </div>
              </div>

              {/* Base Pedestal Glow */}
              <div className="w-56 h-4 bg-brand-orange/20 blur-xl rounded-full mt-1" />
            </div>

            {/* ── Desktop Interactive Acoustic Hotspots (Floating around central dock) ── */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                className={`hidden md:block absolute z-30 ${spot.pos}`}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                <div className="relative group">
                  <button
                    onClick={() =>
                      setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
                    }
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sonic-900/90 hover:bg-brand-orange border border-sonic-750 hover:border-brand-orange text-white text-xs font-bold transition-all shadow-xl backdrop-blur-md cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-brand-orange group-hover:bg-white animate-ping" />
                    <span>{spot.title}</span>
                  </button>

                  {/* Popover Card */}
                  <AnimatePresence>
                    {activeHotspot === spot.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className={`absolute ${
                          spot.pos.includes('right') ? 'right-0' : 'left-0'
                        } mt-2 w-64 p-3.5 rounded-2xl bg-sonic-900/95 border border-brand-orange/40 text-left shadow-2xl backdrop-blur-xl z-50 pointer-events-none`}
                      >
                        <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider block mb-1">
                          {spot.tag}
                        </span>
                        <p className="text-xs text-sonic-200 leading-relaxed font-medium">
                          {spot.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile Acoustic Feature Grid (Zero Overlap on phone screens) ── */}
          <div className="md:hidden mt-6 pt-6 border-t border-sonic-850/60">
            <div className="text-[11px] font-extrabold text-brand-orange uppercase tracking-wider text-center mb-3">
              Acoustic Architecture
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className="p-3 rounded-2xl bg-sonic-900/80 border border-sonic-800 text-left"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    <span className="text-[9px] font-extrabold text-brand-orange uppercase tracking-wider">
                      {spot.tag}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {spot.title}
                  </div>
                  <p className="text-[10px] text-sonic-400 mt-1 line-clamp-2 leading-relaxed">
                    {spot.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM LIVE SPECS & ADD TO CART BAR ── */}
          <div className="pt-6 border-t border-sonic-850/80 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div>
                <span className="text-[10px] font-bold text-sonic-500 uppercase tracking-wider block">
                  Current Audio Mode
                </span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  {activeMode.name}
                </span>
                <p className="text-xs text-sonic-400 mt-0.5">{activeMode.desc}</p>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="text-center sm:text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">₹16,999</span>
                  <span className="text-sm text-sonic-500 line-through">₹19,999</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    SAVE 15%
                  </span>
                </div>
                <span className="text-[10px] text-sonic-400 block font-mono">
                  Includes Qi Wireless Charging Aluminum Case
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={justAdded}
                  className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-lg shadow-brand-orange/30 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={15} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      <span>Add Pulse Pro (₹16,999)</span>
                    </>
                  )}
                </button>

                <Link
                  href="/product/soundwave-pulse-earbuds-pro"
                  className="px-4 py-3 rounded-xl font-bold text-xs bg-sonic-900 hover:bg-sonic-850 text-sonic-200 hover:text-white border border-sonic-750 hover:border-brand-orange/40 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Specs</span>
                  <ArrowRight size={14} className="text-brand-orange" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
