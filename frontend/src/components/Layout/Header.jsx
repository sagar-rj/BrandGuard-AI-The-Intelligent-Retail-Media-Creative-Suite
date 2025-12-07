import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-3">
        {/* Simple Logo Placeholder */}
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">Retail Media Tool</h1>
          <p className="text-xs text-gray-500">AI-Powered Creative Compliance</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">v1.0.0 Prototype</span>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-300">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;