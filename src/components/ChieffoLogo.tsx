import React from 'react';

interface ChieffoLogoProps {
  className?: string;
  showGlow?: boolean;
}

export const ChieffoLogo: React.FC<ChieffoLogoProps> = ({ 
  className = "w-8 h-8", 
  showGlow = true 
}) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md pointer-events-none" />
      )}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-emerald-400 relative z-10 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
      >
        {/* Central Solid Circle */}
        <circle cx="50" cy="50" r="7.5" fill="currentColor" />

        {/* Top Vertical Connecting Bar */}
        <line x1="50" y1="12" x2="50" y2="30" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />

        {/* Bottom Vertical Connecting Bar */}
        <line x1="50" y1="70" x2="50" y2="88" stroke="currentColor" strokeWidth="6.5" strokeLinecap="square" />

        {/* Inner C Arc */}
        <path
          d="M 70 36 A 24 24 0 1 0 70 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Outer C Arc */}
        <path
          d="M 86 31 A 42 42 0 1 0 85 71"
          fill="none"
          stroke="currentColor"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Top Right Connector Bridge */}
        <path
          d="M 86 31 L 70 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
