'use client';

import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "The transient speed and soundstage on the Apex Pro ANC headphones rival high-end studio open-backs. The lambskin memory foam seals off ambient aircraft noise completely without pressure fatigue.",
    author: "David K.",
    role: "Studio Producer & Sound Engineer",
    rating: 5,
    product: "SoundWave Apex Pro ANC",
    avatar: "DK",
    verified: true,
    color: 'from-brand-orange/20 to-amber-600/10',
  },
  {
    id: 2,
    quote: "Finally, a Dolby Atmos soundbar that actually bounces audio off the ceiling convincingly. Watching Dune in 4K HDR was an acoustic revelation in my apartment.",
    author: "Elena Rostova",
    role: "Architect & Film Enthusiast",
    rating: 5,
    product: "SonicCinema 5.1.2",
    avatar: "ER",
    verified: true,
    color: 'from-indigo-500/15 to-purple-600/10',
  },
  {
    id: 3,
    quote: "The Pulse Earbuds Pro stay locked during my wet trail runs and the LDAC codec brings out guitar harmonics I simply never heard with previous standard earbuds.",
    author: "Marcus Vance",
    role: "Marathon Runner & Daily Commuter",
    rating: 5,
    product: "SoundWave Pulse Earbuds Pro",
    avatar: "MV",
    verified: true,
    color: 'from-emerald-500/15 to-teal-600/10',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  };

  return (
    <section className="py-24 bg-sonic-950 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(ellipse at top, rgba(255,85,0,0.07) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/25 mb-4">
            <Quote size={12} className="text-brand-orange" />
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
              Verified Acoustic Impressions
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loved By{' '}
            <span className="text-gradient-orange">Producers & Purists</span>
          </h2>
          <p className="text-sm text-sonic-500 mt-3">
            Curated reviews from audio engineers and everyday listeners.
          </p>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
              className="group relative"
            >
              <div className="h-full rounded-2xl border border-sonic-800/60 bg-sonic-900/50 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 group-hover:border-sonic-700/80 overflow-hidden"
                style={{ boxShadow: '0 4px 24px -4px rgba(0,0,0,0.4)' }}>
                
                {/* Gradient top glow */}
                <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${item.color.replace('/20','/60').replace('/10','/30').replace('/15','/50')}`} />
                <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${item.color} opacity-60 pointer-events-none`} />

                <div className="relative space-y-4">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.07, type: 'spring', stiffness: 500 }}
                      >
                        <Star size={14} fill="currentColor" className="text-amber-400" />
                      </motion.span>
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-amber-400/80">5.0</span>
                  </div>

                  {/* Quote */}
                  <div className="relative">
                    <Quote size={20} className="text-brand-orange/20 absolute -top-1 -left-1" />
                    <p className="text-sm text-sonic-300 leading-relaxed italic pl-4">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative pt-4 border-t border-sonic-850/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange/40 to-amber-600/20 border border-brand-orange/30 flex items-center justify-center text-xs font-black text-white shrink-0">
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1">
                        {item.author}
                        {item.verified && (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        )}
                      </h4>
                      <p className="text-[11px] text-sonic-500">{item.role}</p>
                    </div>
                  </div>
                  
                  <div className="text-[9px] font-bold font-mono text-brand-orange bg-brand-orange/10 border border-brand-orange/15 px-2 py-1 rounded-lg max-w-[90px] text-right leading-tight">
                    {item.product}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom trust bar */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { value: '4.9/5', label: 'Average Rating', sub: 'From 2,400+ reviews' },
            { value: '98%', label: 'Recommend Us', sub: 'Verified purchasers' },
            { value: '50K+', label: 'Happy Audiophiles', sub: 'Worldwide community' },
          ].map(({ value, label, sub }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs font-semibold text-sonic-300 mt-0.5">{label}</div>
              <div className="text-[10px] text-sonic-600 mt-0.5">{sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
