'use client';

import React from 'react';
import { ProductVariant } from '@/types';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  size = 'md',
  showLabels = false,
}) => {
  if (!variants || variants.length <= 1) {
    if (showLabels && variants && variants[0]) {
      return (
        <div className="flex items-center gap-2 text-xs text-sonic-400">
          <span className="w-3.5 h-3.5 rounded-full border border-sonic-700" style={{ backgroundColor: variants[0].color_hex }} />
          <span>{variants[0].color_name}</span>
        </div>
      );
    }
    return null;
  }

  const swatchSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  }[size];

  return (
    <div className="space-y-1.5">
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-sonic-400">Color:</span>
          <span className="font-semibold text-sonic-100 flex items-center gap-1.5">
            {selectedVariant.color_name}
            {selectedVariant.stock_quantity <= 0 ? (
              <span className="text-red-400 font-normal">(Out of stock)</span>
            ) : selectedVariant.stock_quantity <= 10 ? (
              <span className="text-amber-400 font-normal">({selectedVariant.stock_quantity} left)</span>
            ) : null}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Product color choices">
        {variants.map(variant => {
          const isSelected = selectedVariant.id === variant.id;
          const isOutOfStock = variant.stock_quantity <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onSelectVariant(variant);
              }}
              title={`${variant.color_name}${isOutOfStock ? ' (Out of stock)' : ` - ${variant.stock_quantity} in stock`}`}
              aria-label={`Select color ${variant.color_name}`}
              className={`
                relative rounded-full transition-all duration-200 flex items-center justify-center p-0.5
                ${isSelected ? 'ring-2 ring-brand-orange ring-offset-2 ring-offset-sonic-950 scale-105' : 'hover:ring-1 hover:ring-sonic-600'}
                ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span
                className={`${swatchSizes} rounded-full border border-sonic-700 flex items-center justify-center shadow-inner`}
                style={{ backgroundColor: variant.color_hex }}
              >
                {isSelected && (
                  <Check
                    size={size === 'sm' ? 10 : 13}
                    className={variant.color_hex.toLowerCase() === '#f4f4f6' || variant.color_hex.toLowerCase() === '#ffffff' || variant.color_hex.toLowerCase() === '#fafafa' ? 'text-black' : 'text-white'}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
