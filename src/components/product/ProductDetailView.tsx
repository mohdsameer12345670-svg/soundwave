'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant, Review } from '@/types';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { useCart } from '@/context/CartContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  CheckCircle2,
  Check,
  ChevronRight,
  Heart,
  Share2,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  relatedProducts,
  reviews,
}) => {
  const router = useRouter();
  const { addItem, toggleWishlist, isInWishlist } = useCart();

  const variants = product.variants || [];
  const defaultVariant = variants.find(v => v.stock_quantity > 0) || variants[0] || {
    id: `v-${product.id}`,
    product_id: product.id,
    color_name: 'Standard',
    color_hex: '#111111',
    sku: `SW-${product.id.slice(0, 5)}`,
    stock_quantity: 10,
    is_active: true,
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'reviews'>('specs');
  const [justAdded, setJustAdded] = useState(false);

  // Gallery array
  const gallery = [
    selectedVariant.image_url || product.main_image,
    ...(product.gallery_images || []),
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  const activeImage = gallery[selectedImageIndex] || product.main_image;
  const isOutOfStock = selectedVariant.stock_quantity <= 0;
  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant.price ?? product.sale_price ?? product.base_price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-sonic-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-sonic-400 mb-8 flex-wrap">
          <Link
            href="/"
            className="hover:text-brand-orange transition-colors font-medium py-1 px-1 -mx-1"
          >
            Home
          </Link>
          <ChevronRight size={12} className="text-sonic-600" />
          <Link
            href="/shop"
            className="hover:text-brand-orange transition-colors font-medium py-1 px-1 -mx-1"
          >
            Shop
          </Link>
          <ChevronRight size={12} className="text-sonic-600" />
          <Link
            href={`/shop?category=${product.category?.slug}`}
            className="hover:text-brand-orange transition-colors capitalize py-1 px-1 -mx-1"
          >
            {product.category?.name || 'Acoustic'}
          </Link>
          <ChevronRight size={12} className="text-sonic-600" />
          <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Gallery & Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/3] max-h-[460px] w-full rounded-3xl overflow-hidden bg-sonic-900 border border-sonic-800 shadow-2xl">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-300"
              />

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                    inWishlist
                      ? 'bg-brand-orange text-white shadow-lg'
                      : 'bg-sonic-950/70 text-sonic-300 hover:text-white hover:bg-sonic-900'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Current SKU & Color badge */}
              <div className="absolute bottom-4 left-4 bg-sonic-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sonic-750 text-xs font-mono text-sonic-200">
                <span>{selectedVariant.color_name}</span> • <span>SKU: {selectedVariant.sku}</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-sonic-900 border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-brand-orange scale-95 shadow-md'
                        : 'border-sonic-800 hover:border-sonic-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Color Palette Switcher directly under the 2 images */}
            {variants.length > 0 && (
              <div className="bg-sonic-900/80 border border-sonic-800/90 rounded-2xl p-4 mt-3 shadow-lg">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-sonic-400 font-medium">Available Colors:</span>
                  <span className="font-bold text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-sonic-700 shadow-sm"
                      style={{ backgroundColor: selectedVariant.color_hex }}
                    />
                    <span className="text-brand-orange">{selectedVariant.color_name}</span>
                    {selectedVariant.stock_quantity <= 0 ? (
                      <span className="text-red-400 text-[10px] font-normal">(Out of stock)</span>
                    ) : selectedVariant.stock_quantity <= 10 ? (
                      <span className="text-amber-400 text-[10px] font-normal">
                        ({selectedVariant.stock_quantity} left)
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {variants.map(variant => {
                    const isSelected = selectedVariant.id === variant.id;
                    const isOutOfStock = variant.stock_quantity <= 0;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(variant);
                          if (variant.image_url) {
                            setSelectedImageIndex(0);
                          }
                          setQuantity(1);
                        }}
                        className={`group/color relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sonic-850 border-brand-orange text-white shadow-md shadow-brand-orange/20 scale-105'
                            : 'bg-sonic-950/70 border-sonic-800 text-sonic-300 hover:text-white hover:border-sonic-700 hover:bg-sonic-900'
                        } ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border border-sonic-700 shrink-0 shadow-inner flex items-center justify-center transition-transform ${
                            isSelected ? 'ring-2 ring-brand-orange ring-offset-1 ring-offset-sonic-900' : ''
                          }`}
                          style={{ backgroundColor: variant.color_hex }}
                        >
                          {isSelected && (
                            <Check
                              size={10}
                              className={
                                variant.color_hex.toLowerCase() === '#ffffff' ||
                                variant.color_hex.toLowerCase() === '#f3f4f6' ||
                                variant.color_hex.toLowerCase() === '#fafafa'
                                  ? 'text-black'
                                  : 'text-white'
                              }
                            />
                          )}
                        </span>
                        <span>{variant.color_name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase Options */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-sonic-400 mb-2">
                <span className="text-brand-orange uppercase font-bold tracking-wider">
                  {product.category?.name}
                </span>
                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                          className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-sonic-700'}
                        />
                      ))}
                    </div>
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-sonic-500 font-normal">({product.review_count} reviews)</span>
                  </div>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="mt-4">
                <PriceDisplay
                  basePrice={product.base_price}
                  salePrice={product.sale_price}
                  size="xl"
                />
              </div>

              {/* Short description */}
              <p className="text-sm text-sonic-300 mt-4 leading-relaxed">
                {product.short_description || product.description}
              </p>
            </div>

            {/* Color Swatch Selector (Desktop sync) */}
            {variants.length > 0 && (
              <div className="pt-4 border-t border-sonic-850 hidden lg:block">
                <ColorSelector
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={variant => {
                    setSelectedVariant(variant);
                    setSelectedImageIndex(0);
                    setQuantity(1);
                  }}
                  size="md"
                  showLabels
                />
              </div>
            )}

            {/* Quantity & Stock Status */}
            <div className="pt-4 border-t border-sonic-850 flex items-center justify-between">
              <div>
                <span className="text-xs text-sonic-400 block mb-1">Select Quantity</span>
                <QuantitySelector
                  quantity={quantity}
                  max={selectedVariant.stock_quantity}
                  onChange={q => setQuantity(q)}
                />
              </div>

              <div className="text-right">
                <span className="text-xs text-sonic-400 block mb-1">Inventory Status</span>
                {selectedVariant.stock_quantity > 10 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={13} /> In Stock ({selectedVariant.stock_quantity} available)
                  </span>
                ) : selectedVariant.stock_quantity > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    Only {selectedVariant.stock_quantity} remaining
                  </span>
                ) : (
                  <span className="text-red-400 text-xs font-semibold">
                    Currently Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Purchase CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'bg-sonic-850 text-sonic-500 cursor-not-allowed border border-sonic-800'
                    : justAdded
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                    : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-xl shadow-brand-orange/25 hover:scale-[1.01]'
                }`}
              >
                {isOutOfStock ? (
                  <span>Variant Currently Unavailable</span>
                ) : justAdded ? (
                  <>
                    <Check size={17} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} />
                    <span>Add to Cart • ₹{(currentPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-sonic-100 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:hover:bg-white"
              >
                <Zap size={16} className="text-brand-orange fill-brand-orange" />
                <span>Instant Buy Now</span>
              </button>
            </div>

            {/* Delivery & Warranty Trust Points */}
            <div className="pt-4 border-t border-sonic-850 grid grid-cols-3 gap-3 text-center">
              <div className="bg-sonic-900/60 p-3 rounded-xl border border-sonic-800">
                <Truck size={18} className="mx-auto text-brand-orange mb-1" />
                <div className="text-[11px] font-bold text-white">Free Express</div>
                <div className="text-[10px] text-sonic-400">Over ₹999</div>
              </div>

              <div className="bg-sonic-900/60 p-3 rounded-xl border border-sonic-800">
                <RotateCcw size={18} className="mx-auto text-brand-orange mb-1" />
                <div className="text-[11px] font-bold text-white">30-Day Trial</div>
                <div className="text-[10px] text-sonic-400">Money Back</div>
              </div>

              <div className="bg-sonic-900/60 p-3 rounded-xl border border-sonic-800">
                <ShieldCheck size={18} className="mx-auto text-brand-orange mb-1" />
                <div className="text-[11px] font-bold text-white">2-Yr Warranty</div>
                <div className="text-[10px] text-sonic-400">Full Coverage</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications, Features, and Reviews Section */}
        <div className="mt-20 pt-10 border-t border-sonic-850">
          <div className="flex items-center gap-8 border-b border-sonic-850 pb-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-4 -mb-4 transition-colors ${
                activeTab === 'specs'
                  ? 'border-b-2 border-brand-orange text-white'
                  : 'text-sonic-400 hover:text-white'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-4 -mb-4 transition-colors ${
                activeTab === 'features'
                  ? 'border-b-2 border-brand-orange text-white'
                  : 'text-sonic-400 hover:text-white'
              }`}
            >
              Key Acoustic Highlights
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 -mb-4 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-brand-orange text-white'
                  : 'text-sonic-400 hover:text-white'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="text-xs bg-sonic-850 px-2 py-0.5 rounded-full text-sonic-300">
                {reviews.length}
              </span>
            </button>
          </div>

          <div className="py-8">
            {/* Tab: Specs */}
            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-sonic-900/60 border border-sonic-800 text-xs"
                    >
                      <span className="text-sonic-400 font-medium">{key}</span>
                      <span className="text-white font-mono font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Features */}
            {activeTab === 'features' && (
              <div className="max-w-3xl space-y-3">
                {(product.features || []).map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-sonic-900/40 border border-sonic-800">
                    <div className="w-5 h-5 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                    <span className="text-xs sm:text-sm text-sonic-200">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-sonic-900/30 rounded-2xl border border-sonic-850 p-6">
                    <p className="text-xs text-sonic-400">
                      No customer reviews submitted for this specific device yet. Genuine reviews appear here after customer verification.
                    </p>
                  </div>
                ) : (
                  reviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-sonic-900/60 border border-sonic-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-[11px] text-sonic-500 font-mono">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {rev.title && (
                        <h4 className="text-sm font-bold text-white">{rev.title}</h4>
                      )}

                      <p className="text-xs text-sonic-300 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center gap-1.5 text-[11px] text-sonic-400 pt-1">
                        <span className="font-semibold text-white">{rev.user_name}</span>
                        {rev.is_verified_purchase && (
                          <span className="flex items-center gap-0.5 text-emerald-400">
                            • <CheckCircle2 size={11} /> Verified Acoustic Owner
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Audio Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-sonic-850">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Related Sound Systems
              </h3>
              <Link href="/shop" className="text-xs font-semibold text-brand-orange hover:underline">
                View All Catalog
              </Link>
            </div>
            <ProductGrid products={relatedProducts.slice(0, 4)} />
          </div>
        )}
      </div>
    </div>
  );
};
