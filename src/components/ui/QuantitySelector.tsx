'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  max: number;
  onChange: (qty: number) => void;
  size?: 'sm' | 'md';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  max,
  onChange,
  size = 'md',
}) => {
  const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const textClass = size === 'sm' ? 'text-xs w-8' : 'text-sm w-10';

  return (
    <div className="flex items-center rounded-lg border border-sonic-700 bg-sonic-900 p-0.5 select-none">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className={`${btnSize} flex items-center justify-center rounded text-sonic-400 hover:text-white hover:bg-sonic-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>
      <span className={`${textClass} text-center font-medium text-sonic-100`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={`${btnSize} flex items-center justify-center rounded text-sonic-400 hover:text-white hover:bg-sonic-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
};
