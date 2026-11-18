'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fallbackCategoryImages: Record<string, string> = {
  headphones: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
  speakers: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  earphones: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  accessories: 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=800&q=80',
  soundbars: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
  'wireless-earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
  'bluetooth-speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
};

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    },
  };

  return (
    <section className="py-24 bg-sonic-950 border-b border-sonic-850 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(255,85,0,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-brand-orange rounded-full" />
              <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">
                Acoustic Categories
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Engineered For{' '}
              <span className="text-gradient-orange">Every Soundstage</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group text-xs font-semibold text-sonic-400 hover:text-white inline-flex items-center gap-2 mt-4 md:mt-0 transition-all duration-300 border border-sonic-800 hover:border-brand-orange/40 px-4 py-2 rounded-xl hover:bg-sonic-900/50"
          >
            <span>Browse Full Catalog</span>
            <ArrowUpRight size={14} className="text-brand-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {categories.map((cat, idx) => (
            <motion.div key={cat.id} variants={cardVariants}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden border border-sonic-800/80 bg-sonic-900 block aspect-square"
                style={{ display: 'block' }}
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={cat.image_url?.trim() || fallbackCategoryImages[cat.slug.toLowerCase()] || fallbackCategoryImages.headphones}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={idx < 2}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sonic-950/95 via-sonic-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Hover shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,85,0,0.08) 0%, transparent 60%)' }} />

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-orange/30 transition-all duration-400" />

                  {/* Text Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex items-end justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-orange transition-colors duration-300 leading-tight">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-sonic-400 line-clamp-1 mt-0.5 group-hover:text-sonic-300 transition-colors">
                          {cat.description}
                        </p>
                      </div>

                      {/* Arrow button */}
                      <div className="ml-3 shrink-0 w-9 h-9 rounded-full bg-sonic-900/80 border border-sonic-700 flex items-center justify-center text-sonic-400 group-hover:text-white group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-orange/30">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
