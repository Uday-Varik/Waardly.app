import React from 'react';

const BrandMonogram = ({ size = 24, color = 'var(--accent-gold)' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Outer solid brand ring */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2.5" />
      {/* Inner dotted accent ring */}
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
      {/* Editorial dual-W brand crest */}
      <path 
        d="M26 35 L38 72 L50 48 L62 72 L74 35" 
        stroke={color} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M32 35 L42 62 L50 45 L58 62 L68 35" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.85"
      />
    </svg>
  );
};

export default BrandMonogram;
