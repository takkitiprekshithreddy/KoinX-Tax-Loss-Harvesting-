import React from 'react';

export default function Header() {
  return (
    <header className="bg-white dark:bg-[#050A15] border-b border-gray-200 dark:border-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* KoinX Logo */}
        <div className="flex items-center cursor-pointer">
          <span className="text-[28px] font-bold tracking-tight flex items-center">
            <span className="text-blue-600">Koin</span>
            <span className="text-amber-500">X</span>
            <span className="text-gray-400 text-xs font-normal align-top ml-1 mt-2">™</span>
          </span>
        </div>
      </div>
    </header>
  );
}