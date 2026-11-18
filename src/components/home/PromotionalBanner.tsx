'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Volume2, Film, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const PromotionalBanner: React.FC = () => {
  const features = [
    { icon: Volume2, label: 'Dolby Atmos & DTS:X' },
    { icon: Zap, label: '200W Wireless Sub' },
    { icon: Star, label: 'Height Channels' },
  ];

  return (
    <section className="py-24 bg-sonic-950 border-b border-sonic-850 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,85,0,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,85,0,0.12)' }}
        >
          {/* Card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sonic-900 via-sonic-900 to-sonic-850" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(255,85,0,0.06) 0%, transparent 50%, rgba(245,158,11,0.04) 100%)' }} />
          
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl border border-brand-orange/20"
            animate={{ borderColor: ['rgba(255,85,0,0.2)', 'rgba(255,85,0,0.45)', 'rgba(255,85,0,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left: Content */}
            <motion.div
              className="max-w-xl space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/15 border border-brand-orange/30">
                <Film size={13} className="text-brand-orange" />
                <span className="text-brand-orange text-xs font-bold uppercase tracking-widest">
                  Cinematic Audio Special
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
                Bring Dolby Atmos{' '}
                <span className="text-gradient-orange">Direct to Your</span>{' '}
                Living Room.
              </h2>

              <p className="text-sm sm:text-base text-sonic-400 leading-relaxed">
                Experience the{' '}
                <span className="text-white font-semibold">SonicCinema 5.1.2</span>{' '}
                soundbar with wireless 8-inch 200W subwoofer and discrete upward-firing ceiling height drivers.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sonic-800/60 border border-sonic-700/60 text-xs text-sonic-300">
                    <Icon size={12} className="text-brand-orange" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">₹39,999</span>
                    <span className="line-through text-sonic-500 text-base font-normal">₹49,999</span>
                    <span className="bg-emerald-400/15 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-lg border border-emerald-400/20">
                      SAVE ₹10,000
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck size={11} />
                    <span>Includes Free Room Calibration Kit</span>
                  </div>
                </div>

                <Link href="/product/soniccinema-dolby-atmos-soundbar">
                  <motion.span
                    className="inline-flex items-center gap-2.5 bg-brand-orange text-white px-7 py-3.5 rounded-xl font-bold text-sm cursor-pointer select-none"
                    whileHover={{ scale: 1.04, boxShadow: '0 16px 40px -8px rgba(255,85,0,0.5)' }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <span>Claim Offer</span>
                    <ArrowRight size={16} />
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            {/* Right: Soundbar Visual */}
            <motion.div
              className="relative w-full max-w-md shrink-0"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="aspect-[4/3] rounded-2xl overflow-hidden border border-sonic-700/60 relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ boxShadow: '0 30px 60px -10px rgba(0,0,0,0.8)' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80"
                  alt="SonicCinema 5.1.2 Dolby Atmos Soundbar"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sonic-950/60 via-transparent to-transparent" />

                {/* Tech label */}
                <div className="absolute top-4 right-4 bg-sonic-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-sonic-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[11px] font-bold text-white tracking-wide">Dolby Atmos · DTS:X</span>
                </div>

                {/* Bottom spec overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {[['5.1.2', 'Channels'], ['200W', 'RMS Power'], ['8"', 'Subwoofer']].map(([val, lbl]) => (
                    <div key={lbl} className="flex-1 bg-sonic-950/80 backdrop-blur-md rounded-xl p-2 border border-sonic-800/60 text-center">
                      <div className="text-xs font-black text-white">{val}</div>
                      <div className="text-[9px] text-sonic-500 mt-0.5">{lbl}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating accent card */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-sonic-900/95 backdrop-blur-xl border border-sonic-800 rounded-xl p-3 shadow-2xl"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/15 border border-brand-orange/20 flex items-center justify-center">
                    <Volume2 size={14} className="text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-[10px] text-sonic-400">Room Calibration</div>
                    <div className="text-xs font-bold text-white">Auto-Tune Mode</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
