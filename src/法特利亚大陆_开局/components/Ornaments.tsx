import React from 'react';

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center w-full py-4 opacity-80 ${className}`}>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
    <div className="mx-4 text-amber-600">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15 12L22 12L16 16L19 22L12 18L5 22L8 16L2 12L9 12L12 2Z" />
      </svg>
    </div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
  </div>
);

export const CornerDecoration: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const classes = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
  };

  return <div className={`absolute w-8 h-8 border-amber-600/50 pointer-events-none ${classes[position]}`} />;
};

export const Frame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative p-1 ${className}`}>
    <div className="absolute inset-0 border border-amber-900/30 pointer-events-none"></div>
    <div className="absolute inset-1 border border-amber-600/20 pointer-events-none"></div>
    <CornerDecoration position="tl" />
    <CornerDecoration position="tr" />
    <CornerDecoration position="bl" />
    <CornerDecoration position="br" />
    {children}
  </div>
);
