'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { DataService, ProductFilters } from '@/lib/data/store';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  ChevronDown,
  Filter,
  Sparkles,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<ProductFilters['sort']>((searchParams.get('sort') as ProductFilters['sort']) || 'featured');
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load initial categories and products
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [cats, prods] = await Promise.all([
        DataService.getCategories(),
        DataService.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Update URL parameters dynamically when filters change
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    setSelectedCategory(cat);
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        p => p.category?.slug === selectedCategory || p.category_id === selectedCategory
      );
    }

    // Search query with multi-term & typo resilient matching
    if (searchQuery.trim()) {
      // Normalize common variations and typos (e.g., 'wirless' -> 'wireless')
      const normalized = searchQuery.toLowerCase().trim().replace(/\bwirless\b/g, 'wireless');
      const terms = normalized.split(/\s+/).filter(Boolean);

      result = result.filter(p => {
        const searchableText = [
          p.name || '',
          p.short_description || '',
          p.description || '',
          p.category?.name || '',
          p.category?.slug || '',
          ...(p.variants?.map(v => `${v.color_name || ''} ${v.sku || ''}`) || []),
        ]
          .join(' ')
          .toLowerCase();

        // Match if all search terms appear in the searchable text
        return terms.every(term => searchableText.includes(term));
      });
    }

    // Price range
    result = result.filter(p => (p.sale_price ?? p.base_price) <= priceRange);

    // In-stock only
    if (inStockOnly) {
      result = result.filter(p => p.variants?.some(v => v.stock_quantity > 0));
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.is_new_arrival ? 1 : 0) - (a.is_new_arrival ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange(100000);
    setInStockOnly(false);
    router.push('/shop');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange < 100000 ||
    inStockOnly ||
    sortBy !== 'featured';

  return (
    <div className="bg-sonic-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-sonic-400 mb-2 flex-wrap">
            <Link
              href="/"
              className="hover:text-brand-orange transition-colors cursor-pointer py-1 font-medium"
            >
              Home
            </Link>
            <span className="text-sonic-600">/</span>
            <Link
              href="/shop"
              className={`${
                selectedCategory === 'all'
                  ? 'text-white font-semibold'
                  : 'hover:text-brand-orange transition-colors'
              } cursor-pointer py-1`}
            >
              Shop
            </Link>
            {selectedCategory !== 'all' && (
              <>
                <span className="text-sonic-600">/</span>
                <span className="text-brand-orange font-semibold capitalize py-1">
                  {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Acoustic Collection
          </h1>
          <p className="text-xs sm:text-sm text-sonic-400 mt-1 max-w-2xl">
            Explore studio-tuned headphones, true wireless earbuds, soundbars, and audiophile gear.
          </p>
        </div>

        {/* Toolbar: Search & Sort & Mobile Filter Toggle */}
        <div className="bg-sonic-900/70 border border-sonic-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sonic-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search acoustic gear by model, SKU..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-sonic-950 border border-sonic-750 text-white placeholder-sonic-500 pl-10 pr-9 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sonic-400 hover:text-white"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 bg-sonic-850 hover:bg-sonic-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-sonic-750"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
              )}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sonic-400 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as ProductFilters['sort'])}
                  className="bg-sonic-950 border border-sonic-750 text-white py-2 pl-3 pr-8 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-orange appearance-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sonic-400 pointer-events-none" />
              </div>
            </div>

            {/* Product count */}
            <div className="text-xs text-sonic-400 hidden lg:block">
              Showing <strong className="text-white">{filteredProducts.length}</strong> devices
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block space-y-6">
            <div className="bg-sonic-900/60 border border-sonic-800 rounded-2xl p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-sonic-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Filter size={16} className="text-brand-orange" />
                  <span>Refine Audio</span>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-brand-orange hover:underline flex items-center gap-1 font-medium"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Categories
                </h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-brand-orange text-white font-bold'
                        : 'text-sonic-300 hover:text-white hover:bg-sonic-850'
                    }`}
                  >
                    <span>All Acoustic Devices</span>
                    <span className="text-[11px] opacity-70">{products.length}</span>
                  </button>
                  {categories.map(cat => {
                    const count = products.filter(p => p.category_id === cat.id || p.category?.slug === cat.slug).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                          selectedCategory === cat.slug
                            ? 'bg-brand-orange text-white font-bold'
                            : 'text-sonic-300 hover:text-white hover:bg-sonic-850'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[11px] opacity-70 ml-2">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-sonic-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white uppercase tracking-wider">Max Price</span>
                  <span className="font-mono text-brand-orange font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-brand-orange cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-sonic-500 font-mono mt-1">
                  <span>₹500</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* In-Stock Filter */}
              <div className="pt-4 border-t border-sonic-800">
                <label className="flex items-center gap-2.5 text-xs text-sonic-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-sonic-700 bg-sonic-950 text-brand-orange focus:ring-brand-orange"
                  />
                  <span>In-stock inventory only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="md:col-span-3">
            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-xs text-sonic-400">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-sonic-900 border border-sonic-750 text-white text-xs px-2.5 py-1 rounded-full">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-brand-orange">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-sonic-900 border border-sonic-750 text-white text-xs px-2.5 py-1 rounded-full">
                    Search: &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery('')} className="hover:text-brand-orange">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceRange < 1000 && (
                  <span className="inline-flex items-center gap-1 bg-sonic-900 border border-sonic-750 text-white text-xs px-2.5 py-1 rounded-full">
                    Max: ₹{priceRange}
                    <button onClick={() => setPriceRange(1000)} className="hover:text-brand-orange">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-sonic-900 border border-sonic-750 text-white text-xs px-2.5 py-1 rounded-full">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="hover:text-brand-orange">
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              columns={3}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-sonic-950 border-l border-sonic-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sonic-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-brand-orange" /> Filter Audio
                  </h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-sonic-400 hover:text-white p-1">
                    <X size={20} />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Category</h4>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => { setSelectedCategory('all'); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-medium ${selectedCategory === 'all' ? 'bg-brand-orange text-white' : 'text-sonic-300'}`}
                    >
                      All Audio Devices
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.slug); setMobileFiltersOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium ${selectedCategory === cat.slug ? 'bg-brand-orange text-white' : 'text-sonic-300'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-white uppercase tracking-wider">Max Price</span>
                    <span className="font-mono text-brand-orange">₹{priceRange.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full accent-brand-orange cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-sonic-500 font-mono mt-1">
                    <span>₹500</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* In Stock */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-sonic-200">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-orange"
                    />
                    <span>In-Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-sonic-800 flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 rounded-xl border border-sonic-700 text-xs font-semibold text-sonic-300"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sonic-950 p-12 text-center text-sonic-400">Loading audio catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
