'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toastMessage, clearToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 bg-sonic-900 border border-brand-orange/40 text-sonic-100 px-4 py-3.5 rounded-xl shadow-2xl backdrop-blur-md max-w-md">
        <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
        <span className="text-sm font-medium pr-2">{toastMessage}</span>
        <button
          onClick={clearToast}
          className="text-sonic-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
