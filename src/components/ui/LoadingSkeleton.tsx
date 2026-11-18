import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-sonic-800 animate-pulse flex flex-col space-y-4">
      <div className="w-full aspect-[4/3] bg-sonic-800 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-sonic-800 rounded w-3/4" />
        <div className="h-3 bg-sonic-800/60 rounded w-1/2" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-sonic-850">
        <div className="h-6 bg-sonic-800 rounded w-20" />
        <div className="h-9 bg-sonic-800 rounded-lg w-24" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-sonic-900 border border-sonic-800 rounded-lg w-full flex items-center px-4 justify-between">
          <div className="h-4 bg-sonic-800 rounded w-1/4" />
          <div className="h-4 bg-sonic-800 rounded w-1/6" />
          <div className="h-4 bg-sonic-800 rounded w-1/6" />
          <div className="h-4 bg-sonic-800 rounded w-1/12" />
        </div>
      ))}
    </div>
  );
};
