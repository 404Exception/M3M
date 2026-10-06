import React from 'react';

export const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading content...' }) => {
  return (
    <div className="min-h-[40vh] w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
};
