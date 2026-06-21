import React from 'react';

export default function GridDivider({ title, children }) {
  return (
    <div 
      className="w-full h-24 relative border-y border-gray-300 flex items-center justify-center select-none overflow-hidden sm:overflow-visible" 
      style={{ 
        backgroundImage: 'linear-gradient(#dbdbdb 1px, transparent 1px), linear-gradient(90deg, #dbdbdb 1px, transparent 1px)', 
        backgroundSize: '16px 16px',
        backgroundColor: '#f8f9fa'
      }}
    >
      {/* Cute Mascot Left */}
      <div className="absolute left-2 sm:left-12 bottom-0 w-16 h-20 flex items-end justify-center pointer-events-none">
        <svg viewBox="0 0 100 120" className="w-11 h-15 sm:w-14 sm:h-18 drop-shadow-md">
          {/* Beanie Hat */}
          <path d="M20,40 Q50,0 80,40 Z" fill="#dfa112" stroke="#000" strokeWidth="3" />
          <rect x="15" y="40" width="70" height="12" rx="4" fill="#1c1c1c" stroke="#000" strokeWidth="3" />
          <circle cx="50" cy="12" r="8" fill="#e53935" stroke="#000" strokeWidth="3" />
          {/* Face */}
          <rect x="25" y="52" width="50" height="45" rx="10" fill="#ffe0b2" stroke="#000" strokeWidth="3" />
          {/* Eyes */}
          <circle cx="40" cy="70" r="4" fill="#000" />
          <circle cx="60" cy="70" r="4" fill="#000" />
          {/* Rosy Cheeks */}
          <circle cx="34" cy="76" r="3" fill="#ff8a80" opacity="0.7" />
          <circle cx="66" cy="76" r="3" fill="#ff8a80" opacity="0.7" />
          {/* Smile */}
          <path d="M45,80 Q50,85 55,80" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Clothes */}
          <path d="M28,97 L72,97 L80,120 L20,120 Z" fill="#0068ff" stroke="#000" strokeWidth="3" />
          {/* Striped shirt collar */}
          <rect x="40" y="97" width="20" height="8" fill="#ffeb3b" stroke="#000" strokeWidth="2" />
        </svg>
      </div>

      {/* Center Section: Either custom content/tabs, or the title box */}
      <div className="relative z-10 px-16 sm:px-0">
        {children ? children : (
          <div className="bg-white px-8 py-3.5 border-2 border-black rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2">
            {title}
          </div>
        )}
      </div>

      {/* Cute Mascot Right */}
      <div className="absolute right-2 sm:right-12 bottom-0 w-16 h-20 flex items-end justify-center pointer-events-none">
        <svg viewBox="0 0 100 120" className="w-11 h-15 sm:w-14 sm:h-18 drop-shadow-md">
          {/* Beanie Hat */}
          <path d="M20,40 Q50,0 80,40 Z" fill="#e53935" stroke="#000" strokeWidth="3" />
          <rect x="15" y="40" width="70" height="12" rx="4" fill="#ffeb3b" stroke="#000" strokeWidth="3" />
          <circle cx="50" cy="12" r="8" fill="#dfa112" stroke="#000" strokeWidth="3" />
          {/* Face */}
          <rect x="25" y="52" width="50" height="45" rx="10" fill="#fbe9e7" stroke="#000" strokeWidth="3" />
          {/* Eyes */}
          <circle cx="40" cy="70" r="4" fill="#000" />
          <circle cx="60" cy="70" r="4" fill="#000" />
          {/* Rosy Cheeks */}
          <circle cx="34" cy="76" r="3" fill="#ff8a80" opacity="0.7" />
          <circle cx="66" cy="76" r="3" fill="#ff8a80" opacity="0.7" />
          {/* Smile */}
          <path d="M45,80 Q50,85 55,80" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Clothes */}
          <path d="M28,97 L72,97 L80,120 L20,120 Z" fill="#00b0ff" stroke="#000" strokeWidth="3" />
          <rect x="38" y="97" width="24" height="23" rx="2" fill="#e53935" stroke="#000" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
