import React, { useState } from 'react';

export default function HowItWorks() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer underline decoration-blue-500/30 underline-offset-4">
        How it works?
      </span>

      {showTooltip && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl z-50">
          <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-900 transform rotate-45"></div>
          <p className="relative z-10">
            Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh semper mattis scelerisque tellus. Vel mattis diam duis morbi tellus dui consectetur. <a href="#" className="text-blue-400 underline">Know More</a>
          </p>
        </div>
      )}
    </div>
  );
}