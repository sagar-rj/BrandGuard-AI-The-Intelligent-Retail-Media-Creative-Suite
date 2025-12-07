import React from 'react';

const SafeZoneOverlay = ({ width, height, scale }) => {
  const topHeight = 200 * scale; // Rule: 200px from top
  const bottomHeight = 250 * scale; // Rule: 250px from bottom

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      {/* Top Warning Zone */}
      <div 
        style={{ height: topHeight }} 
        className="w-full bg-red-500/10 border-b border-red-500/50 flex items-end justify-center pb-1"
      >
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">
          Safe Zone (No Logos)
        </span>
      </div>

      {/* Bottom Warning Zone */}
      <div 
        style={{ height: bottomHeight }} 
        className="w-full bg-red-500/10 border-t border-red-500/50 flex items-start justify-center pt-1"
      >
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">
          Safe Zone (No Text)
        </span>
      </div>
    </div>
  );
};

export default SafeZoneOverlay;