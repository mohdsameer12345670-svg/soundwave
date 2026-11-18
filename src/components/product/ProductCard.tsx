'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Heart, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addItem, toggleWishlist, isInWishlist } = useCart();

  // Find first available variant or default to first
  const variants = product.variants || [];
  const defaultVariant = variants.find(v => v.stock_quantity > 0) || variants[0] || {
    id: `v-default-${product.id}`,
    product_id: product.id,
    color_name: 'Standard Black',
    color_hex: '#111111',
    sku: `SW-${product.id.slice(0, 6)}`,
    stock_quantity: 10,
    is_active: true,
  };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Variant image takes precedence if present, otherwise main image
  const displayImage = selectedVariant.image_url || product.main_image;
  const isOutOfStock = selectedVariant.stock_quantity <= 0;
  const inWishlist = isInWishlist(product.id);

  // Alternate hover image discovery:
  // 1. Gallery images that are different from the primary display image
  const galleryAlternate = product.gallery_images?.find(
    img => img && typeof img === 'string' && img.trim() !== '' && img !== displayImage
  );

  // 2. Variant image from another variant if different
  const variantAlternate = variants.find(
    v => v.image_url && typeof v.image_url === 'string' && v.image_url.trim() !== '' && v.image_url !== displayImage
  )?.image_url;

  // 3. Category contextual acoustic fallback if only single image exists
  const getCategoryFallback = () => {
    const slug = product.category?.slug || '';
    const name = product.name.toLowerCase();
    if (name.includes('earbud') || slug.includes('earbud') || slug.includes('earphone')) {
      return 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80';
    }
    if (name.includes('soundbar') || name.includes('speaker') || slug.includes('speaker') || slug.includes('soundbar')) {
      return 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=1000&q=80';
    }
    if (name.includes('stand') || slug.includes('accessories')) {
      return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80';
    }
    return 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80';
  };

  const candidateFallback = getCategoryFallback();
  const hoverImage = galleryAlternate || variantAlternate || (candidateFallback !== displayImage ? candidateFallback : null);

  // Price calculation
  const currentPrice = selectedVariant.price ?? product.sale_price ?? product.base_price;
  const isDiscounted = (product.sale_price !== null && product.sale_price !== undefined) || (selectedVariant.price && selectedVariant.price < product.base_price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, selectedVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-sonic-900/60 rounded-2xl border border-sonic-800/80 hover:border-sonic-700 hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Badges Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.is_new_arrival && (
          <span className="bg-brand-orange text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            New Arrival
          </span>
        )}
        {product.is_best_seller && (
          <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Best Seller
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Sold Out
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          inWishlist
            ? 'bg-brand-orange text-white'
            : 'bg-sonic-950/70 text-sonic-400 hover:text-white hover:bg-sonic-900'
        }`}
        aria-label="Add to wishlist"
      >
        <Heart size={15} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Image Container with Link */}
      <Link href={`/product/${product.slug}`} className="relative block w-full aspect-[4/3] bg-sonic-950 overflow-hidden">
        {/* Primary Cover Image */}
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover object-center transition-all duration-500 ease-out ${
            hoverImage
              ? 'group-hover:opacity-0 group-hover:scale-105'
              : 'group-hover:scale-105'
          }`}
        />

        {/* Alternate Hover Image (Smooth Cross-fade & Zoom Effect) */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
          />
        )}

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 bg-sonic-900/90 hover:bg-sonic-850 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-sonic-700 backdrop-blur-sm transition-all duration-200 flex items-center gap-1.5 shadow-lg ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-sonic-400 mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-brand-orange">
              {product.category?.name || 'Acoustic Audio'}
            </span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star size={12} fill="currentColor" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-sonic-500 text-[11px]">({product.review_count})</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="text-sm font-bold text-white hover:text-brand-orange line-clamp-2 transition-colors leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-sonic-800/80 flex items-center justify-between gap-2">
          <div>
            <PriceDisplay
              basePrice={product.base_price}
              salePrice={product.sale_price}
              size="sm"
            />
            <div className="text-[10px] text-sonic-500 font-mono mt-0.5">
              SKU: {selectedVariant.sku}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 ${
              isOutOfStock
                ? 'bg-sonic-850 text-sonic-500 cursor-not-allowed border border-sonic-800'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-lg shadow-brand-orange/20 hover:scale-[1.02]'
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
