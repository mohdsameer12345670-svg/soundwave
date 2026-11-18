import React from 'react';

interface PriceDisplayProps {
  basePrice: number;
  salePrice?: number | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  basePrice,
  salePrice,
  className = '',
  size = 'md',
}) => {
  const isDiscounted = salePrice !== null && salePrice !== undefined && salePrice < basePrice;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-3xl font-extrabold',
  }[size];

  const strikeSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-lg',
  }[size];

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      {isDiscounted ? (
        <>
          <span className={`text-brand-orange ${sizeClasses}`}>
            ₹{salePrice.toFixed(2)}
          </span>
          <span className={`line-through text-sonic-400 font-normal ${strikeSizeClasses}`}>
            ₹{basePrice.toFixed(2)}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            Save {Math.round(((basePrice - salePrice) / basePrice) * 100)}%
          </span>
        </>
      ) : (
        <span className={`text-sonic-100 ${sizeClasses}`}>
          ₹{basePrice.toFixed(2)}
        </span>
      )}
    </div>
  );
};
