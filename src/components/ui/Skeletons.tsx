import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
          </div>
          <div className="pt-4 flex justify-between items-center border-t border-slate-100">
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-8 bg-slate-200 rounded-lg w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-white border border-slate-100 rounded-xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 w-1/4">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="h-3.5 bg-slate-200 rounded w-28" />
          </div>
          <div className="h-3.5 bg-slate-100 rounded w-28" />
          <div className="h-3.5 bg-slate-100 rounded w-24" />
          <div className="h-3.5 bg-slate-100 rounded w-20" />
          <div className="h-8 bg-slate-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-7 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};
