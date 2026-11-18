'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, Shield, Waves } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// Animated counter component
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const inViewRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inViewRef.current) {
          inViewRef.current = true;
          const controls = animate(0, target, {
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setCount(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-0.5 font-mono tabular-nums">
      {count}
      <span className="text-brand-orange text-sm font-sans font-bold ml-0.5">{suffix}</span>
    </div>
  );
}

// Floating particle component
function FloatingOrb({ delay, x, y, size }: { delay: number; x: string; y: string; size: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: 'radial-gradient(circle, rgba(255,85,0,0.15) 0%, transparent 70%)' }}
      animate={{ y: [-12, 12, -12], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

export const HeroSection: React.FC = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMouseX(((e.clientX - rect.left) / rect.width - 0.5) * 20);
      setMouseY(((e.clientY - rect.top) / rect.height - 0.5) * 12);
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  const stats = [
    { value: 45, suffix: 'dB', label: 'Adaptive ANC', icon: Shield },
    { value: 60, suffix: 'Hrs', label: 'Playback Time', icon: Zap },
    { value: 24, suffix: 'Bit', label: 'Lossless LDAC', icon: Waves },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-sonic-950 pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-sonic-850"
    >
      {/* Multi-layer ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary orange nebula */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,85,0,0.12) 0%, rgba(255,85,0,0.04) 40%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Amber accent top-right */}
        <motion.div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        {/* Bottom-left cool shadow */}
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
        
        {/* Grid overlay for tech feel */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating orbs */}
        <FloatingOrb delay={0} x="10%" y="20%" size="200px" />
        <FloatingOrb delay={1.5} x="75%" y="60%" size="150px" />
        <FloatingOrb delay={3} x="50%" y="80%" size="100px" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── LEFT: Hero Copy ── */}
          <motion.div
            className="lg:col-span-7 space-y-7 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 backdrop-blur-sm">
                {/* Soundwave bars */}
                <div className="flex items-end gap-0.5 h-5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="soundwave-bar" style={{ animationDelay: `${(i-1)*0.15}s` }} />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
                  High Fidelity Audio
                </span>
                <Sparkles size={12} className="text-brand-orange" />
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]"
            >
              <span className="text-white block">Acoustic</span>
              <span className="text-gradient-orange block">Mastery.</span>
              <span className="text-white block text-4xl sm:text-5xl lg:text-6xl mt-1 font-extrabold opacity-90">
                Engineered Without
              </span>
              <span className="text-sonic-300 block text-4xl sm:text-5xl lg:text-6xl font-extrabold">
                Compromise.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-sonic-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Step into an acoustic sanctuary. SoundWave marries{' '}
              <span className="text-sonic-200 font-medium">handcrafted bio-cellulose diaphragms</span>,{' '}
              lossless LDAC wireless protocols, and whisper-quiet{' '}
              <span className="text-brand-orange font-semibold">45dB hybrid noise cancellation</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1"
            >
              <Link href="/shop">
                <motion.span
                  className="group inline-flex items-center gap-2.5 bg-brand-orange text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl shadow-brand-orange/30 cursor-pointer select-none"
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 60px -10px rgba(255,85,0,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span>Explore All Audio</span>  
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight size={17} />
                  </motion.span>
                </motion.span>
              </Link>

              <Link href="/product/soundwave-apex-pro-anc">
                <motion.span
                  className="group inline-flex items-center gap-2 bg-sonic-900/80 backdrop-blur-sm text-sonic-100 hover:text-white px-7 py-4 rounded-2xl font-semibold text-sm border border-sonic-750 hover:border-brand-orange/40 cursor-pointer select-none"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(20,20,26,0.95)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  >
                  
                  </motion.span>
                  <span>Meet Apex Pro ANC</span>
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={itemVariants}
              className="pt-8 border-t border-sonic-850/60 grid grid-cols-3 gap-6 text-left"
            >
              {stats.map(({ value, suffix, label, icon: Icon }) => (
                <div key={suffix} className="group">
                  <AnimatedCounter target={value} suffix={suffix} />
                  <div className="flex items-center gap-1 mt-1">
                    <Icon size={11} className="text-brand-orange opacity-70" />
                    <div className="text-[11px] text-sonic-500 font-medium">{label}</div>
                    
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Product Image Card ── */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center"
            initial={{ opacity: 0, x: 60, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              style={{ rotateX: mouseY * -0.4, rotateY: mouseX * 0.4 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="w-full max-w-lg"
            >
              {/* Main image card */}
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-sonic-800/80 shadow-2xl group" style={{ boxShadow: '0 30px 80px -10px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,85,0,0.08)' }}>
              <Image
  src="/hero-headphones.jpg"
  alt="Premium headphones"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>

                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-sonic-950/80 via-transparent to-sonic-950/20" />

                {/* Top-left badge */}
                <motion.div
                  className="absolute top-4 left-4 flex items-center gap-2 bg-sonic-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sonic-800/60"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold text-sonic-200">In Stock · Ships Today</span>
                </motion.div>

                {/* Top-right rating badge */}
                <motion.div
                  className="absolute top-4 right-4 bg-amber-500/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-1">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-amber-400 text-[11px]">{s}</span>
                    ))}
                    <span className="text-amber-300 text-[10px] font-bold ml-0.5">4.9</span>
                  </div>
                </motion.div>

                {/* Bottom product card */}
                <motion.div
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ backdropFilter: 'blur(20px) saturate(160%)' }}
                >
                  <div>
                    <div className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-0.5">
                      Editor&apos;s Audiophile Choice
                    </div>
                    <div className="text-sm font-bold text-white">SoundWave Apex Pro ANC</div>
                    <div className="text-xs text-sonic-300 font-mono mt-0.5">
                      <span className="text-white font-bold">₹24,999</span>{' '}
                      <span className="line-through text-sonic-500 text-[11px]">₹29,999</span>
                      <span className="ml-2 text-emerald-400 font-bold text-[10px] bg-emerald-400/10 px-1.5 py-0.5 rounded">SAVE ₹5,000</span>
                    </div>
                  </div>

                  <Link href="/product/soundwave-apex-pro-anc" aria-label="View Apex Pro Details">
                    <motion.span
                      className="bg-brand-orange text-white p-3 rounded-xl flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1, boxShadow: '0 8px 24px rgba(255,85,0,0.5)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight size={17} />
                    </motion.span>
                  </Link>
                </motion.div>
              </div>

              {/* Floating side cards */}
              <motion.div
                className="absolute -left-6 top-1/3 bg-sonic-900/90 backdrop-blur-xl border border-sonic-800 rounded-2xl p-3 shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-orange/15 border border-brand-orange/20 flex items-center justify-center">
                    <Waves size={14} className="text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-[10px] text-sonic-400 font-medium">ANC Level</div>
                    <div className="text-xs font-bold text-white">Adaptive · 45dB</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-4 bottom-1/4 bg-sonic-900/90 backdrop-blur-xl border border-sonic-800 rounded-2xl p-3 shadow-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                    <Zap size={14} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-sonic-400 font-medium">Battery Life</div>
                    <div className="text-xs font-bold text-white">60 Hours</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Acoustic Engineering Pillars Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-sonic-850/80"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { label: 'Spatial 360° Theater', desc: 'Dynamic head-tracking DSP engine' },
              { label: '45dB Hybrid ANC', desc: 'Quad-mic inverse acoustic cancellation' },
              { label: '24-Bit / 96kHz LDAC', desc: 'Lossless Hi-Res certified wireless' },
              { label: 'Bio-Cellulose Diaphragm', desc: 'Ultra-low 0.05% harmonic distortion' },
              { label: '15ms Ultra-Low Latency', desc: 'Flawless binaural gaming sync' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-sonic-900/50 hover:bg-sonic-900/90 border border-sonic-800/60 hover:border-brand-orange/40 p-3.5 rounded-2xl transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                    {feat.label}
                  </span>
                </div>
                <p className="text-[11px] text-sonic-400 leading-snug">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
