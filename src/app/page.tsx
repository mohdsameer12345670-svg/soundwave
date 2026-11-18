import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { EarbudsShowcaseAnimation } from '@/components/home/EarbudsShowcaseAnimation';
import { CategorySection } from '@/components/home/CategorySection';
import { PromotionalBanner } from '@/components/home/PromotionalBanner';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ProductGrid } from '@/components/product/ProductGrid';
import { DataService } from '@/lib/data/store';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    DataService.getCategories(),
    DataService.getProducts(),
  ]);

  const featuredProducts = allProducts.filter(p => p.is_featured);
  const bestSellers = allProducts.filter(p => p.is_best_seller);
  const newArrivals = allProducts.filter(p => p.is_new_arrival);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Interactive Earbuds Showcase Animation */}
      <EarbudsShowcaseAnimation />

      {/* Featured Acoustic Collection */}
      <section className="py-24 bg-sonic-950 border-b border-sonic-850 relative overflow-hidden">
        {/* Section ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,85,0,0.04) 0%, transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-brand-orange rounded-full" />
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest flex items-center gap-1.5">
                   Curated Acoustic Systems
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Featured <span className="text-gradient-orange">Flagships</span>
              </h2>
            </div>
            <Link
              href="/shop?sort=featured"
              className="group text-xs font-semibold text-sonic-400 hover:text-white inline-flex items-center gap-2 mt-4 sm:mt-0 transition-all border border-sonic-800 hover:border-brand-orange/40 px-4 py-2 rounded-xl hover:bg-sonic-900/50"
            >
              <span>Explore All Featured</span>
              <ArrowRight size={14} className="text-brand-orange group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts.slice(0, 4)} />
        </div>
      </section>

      {/* Categories Grid */}
      <CategorySection categories={categories} />

      {/* Best Sellers Section */}
      <section className="py-24 bg-sonic-950 border-b border-sonic-850 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-amber-500 rounded-full" />
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Flame size={12} /> Trending Among Purists
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Best Sellers &{' '}
                <span className="text-gradient-orange">Studio Standards</span>
              </h2>
            </div>
            <Link
              href="/shop?sort=rating"
              className="group text-xs font-semibold text-sonic-400 hover:text-white inline-flex items-center gap-2 mt-4 sm:mt-0 transition-all border border-sonic-800 hover:border-amber-500/40 px-4 py-2 rounded-xl hover:bg-sonic-900/50"
            >
              <span>View Top Rated</span>
              <ArrowRight size={14} className="text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <ProductGrid products={bestSellers.length > 0 ? bestSellers.slice(0, 4) : newArrivals.slice(0, 4)} />
        </div>
      </section>

      {/* Cinematic Dolby Atmos Soundbar Promo Banner */}
      <PromotionalBanner />

      {/* Audiophile Customer Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
