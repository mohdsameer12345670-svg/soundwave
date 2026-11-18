'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { ProductCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Headphones } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  columns?: 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = 'No audio gear found',
  emptyMessage = 'Try clearing your filters or search terms to see available acoustic devices.',
  columns = 4,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const gridClass = columns === 3
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-sonic-900/40 border border-sonic-850 rounded-2xl p-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-sonic-850 flex items-center justify-center mx-auto text-sonic-500 mb-4">
          <Headphones size={28} />
        </div>
        <h3 className="text-lg font-bold text-white">{emptyTitle}</h3>
        <p className="text-xs text-sonic-400 mt-1.5 leading-relaxed">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className={gridClass}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={prod => setQuickViewProduct(prod)}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
};
