'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { ColorSelector } from '@/components/ui/ColorSelector';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { useCart } from '@/context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addItem } = useCart();

  if (!product) return null;

  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0] || {
      id: `v-${product.id}`,
      product_id: product.id,
      color_name: 'Standard',
      color_hex: '#111111',
      sku: `SW-${product.id.slice(0, 5)}`,
      stock_quantity: 10,
      is_active: true,
    }
  );
  const [quantity, setQuantity] = useState(1);

  const displayImage = selectedVariant.image_url || product.main_image;
  const isOutOfStock = selectedVariant.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-sonic-950 border border-sonic-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-sonic-900/80 text-sonic-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Product Image Gallery Preview */}
        <div className="md:w-1/2 relative bg-sonic-900 aspect-[4/3] md:aspect-auto min-h-[250px] max-h-[380px]">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute bottom-3 left-3 bg-sonic-950/80 px-2.5 py-1 rounded-md text-xs font-mono text-sonic-300 backdrop-blur-sm">
            {selectedVariant.color_name} • {selectedVariant.sku}
          </div>
        </div>

        {/* Product Info & Controls */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-sonic-400 mb-2">
              <span className="text-brand-orange uppercase font-semibold">{product.category?.name}</span>
              {product.rating > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Star size={13} fill="currentColor" /> {product.rating.toFixed(1)} ({product.review_count} reviews)
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-white">{product.name}</h3>

            <div className="mt-3">
              <PriceDisplay
                basePrice={product.base_price}
                salePrice={product.sale_price}
                size="lg"
              />
            </div>

            <p className="text-xs text-sonic-300 mt-3 leading-relaxed">
              {product.short_description || product.description}
            </p>

            {/* Colors */}
            {variants.length > 0 && (
              <div className="mt-4 pt-4 border-t border-sonic-850">
                <ColorSelector
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={v => {
                    setSelectedVariant(v);
                    setQuantity(1);
                  }}
                  showLabels
                />
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-sonic-400">Quantity:</span>
              <QuantitySelector
                quantity={quantity}
                max={selectedVariant.stock_quantity}
                onChange={q => setQuantity(q)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-sonic-850 space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isOutOfStock
                  ? 'bg-sonic-850 text-sonic-500 cursor-not-allowed'
                  : 'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-lg shadow-brand-orange/20'
              }`}
            >
              <ShoppingBag size={16} />
              {isOutOfStock ? 'Currently Unavailable' : `Add to Cart - ₹${((selectedVariant.price ?? product.sale_price ?? product.base_price) * quantity).toFixed(2)}`}
            </button>

            <div className="flex items-center justify-between text-xs text-sonic-400">
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="text-brand-orange hover:underline inline-flex items-center gap-1 font-medium"
              >
                View Full Specifications <ArrowRight size={13} />
              </Link>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <ShieldCheck size={13} /> 2-Yr Warranty
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
