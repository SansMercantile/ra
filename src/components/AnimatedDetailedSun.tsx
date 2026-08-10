import React, { useEffect } from "react";

// The HTML/SVG definition of our beautiful, animated, detailed Sun logo
const detailedSunSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
  <style>
    @keyframes spinClockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spinCounterClockwise {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes sunPulse {
      0%, 100% { transform: scale(0.97); filter: drop-shadow(0 0 2px rgba(234, 179, 8, 0.6)); }
      50% { transform: scale(1.03); filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.9)); }
    }
    @keyframes flarePulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.95; }
    }
    .sun-core {
      transform-origin: center;
      animation: sunPulse 4s ease-in-out infinite;
    }
    .rays-outer {
      transform-origin: center;
      animation: spinClockwise 28s linear infinite;
    }
    .rays-inner {
      transform-origin: center;
      animation: spinCounterClockwise 36s linear infinite;
    }
    .corona {
      transform-origin: center;
      animation: flarePulse 3.5s ease-in-out infinite;
    }
  </style>
  <defs>
    <radialGradient id="solarGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="30%" stop-color="#fef08a" />
      <stop offset="70%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </radialGradient>
    <radialGradient id="coronaGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#eab308" stop-opacity="0.7" />
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0" />
    </radialGradient>
  </defs>
  
  <!-- Outer Solar Corona (Pulsing Ambient) -->
  <circle cx="50" cy="50" r="46" fill="url(#coronaGlow)" class="corona" />

  <!-- Outer Sharp Diamond Rays (Spinning Clockwise) -->
  <g class="rays-outer" stroke="#eab308" fill="#eab308" stroke-width="1" stroke-linecap="round">
    <!-- Star-like diamond geometric points -->
    <polygon points="50,4 53,23 47,23" />
    <polygon points="50,96 53,77 47,77" />
    <polygon points="4,50 23,53 23,47" />
    <polygon points="96,50 77,53 77,47" />
    
    <!-- Diagonal rays -->
    <polygon points="17,17 32,28 28,32" />
    <polygon points="83,83 68,72 72,68" />
    <polygon points="17,83 32,72 28,68" />
    <polygon points="83,17 68,28 72,32" />
  </g>

  <!-- Middle Wave-like Flares (Spinning Counter-Clockwise) -->
  <g class="rays-inner" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round">
    <path d="M50,22 C47,30 53,30 50,38" />
    <path d="M50,78 C53,70 47,70 50,62" />
    <path d="M22,50 C30,47 30,53 38,50" />
    <path d="M78,50 C70,53 70,47 62,50" />
    
    <path d="M30,30 C36,38 42,32 38,42" />
    <path d="M70,70 C64,62 58,68 62,58" />
    <path d="M30,70 C38,64 32,58 42,62" />
    <path d="M70,30 C62,36 68,42 58,38" />
  </g>

  <!-- Glowing Outer Orbit Ring representing high utility alignment -->
  <circle cx="50" cy="50" r="26" fill="none" stroke="#ca8a04" stroke-width="0.75" stroke-dasharray="3 3" class="rays-outer" />

  <!-- Central Burning Sun Core -->
  <circle cx="50" cy="50" r="17" fill="url(#solarGlow)" class="sun-core" />
  <circle cx="50" cy="50" r="12" fill="none" stroke="#d97706" stroke-width="0.5" stroke-dasharray="2 1" class="sun-core" />
</svg>`;

// Hook to dynamically apply the animated detailed Sun logo as the favicon.
export function useDetailedSunFavicon() {
  useEffect(() => {
    // We clean up specific special characters to make safe as URI
    const svgEncoded = encodeURIComponent(detailedSunSvgString);
    const dataUrl = `data:image/svg+xml;utf8,${svgEncoded}`;
    
    // Select existing favicon links or create a new one
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    if (existingLinks.length > 0) {
      existingLinks.forEach(link => {
        (link as HTMLLinkElement).href = dataUrl;
        (link as HTMLLinkElement).type = "image/svg+xml";
      });
    } else {
      const link = document.createElement("link");
      link.rel = "shortcut icon";
      link.type = "image/svg+xml";
      link.href = dataUrl;
      document.head.appendChild(link);
    }
  }, []);
}

interface AnimatedDetailedSunProps {
  className?: string;
  size?: number; // fallback numeric size in pixels if needed
}

export default function AnimatedDetailedSun({ className = "w-8 h-8", size }: AnimatedDetailedSunProps) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`} 
      style={size ? { width: size, height: size } : {}}
    >
      {/* Outer ambient glow ring via CSS class */}
      <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-md opacity-75 animate-pulse" />
      
      {/* Inline detailed animated Sun SVG */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10"
      >
        <defs>
          <radialGradient id="componentSolarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="componentCoronaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity={0.8} />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity={0} />
          </radialGradient>
        </defs>
        
        <circle cx="50" cy="50" r="46" fill="url(#componentCoronaGlow)" className="animate-[pulse_3.5s_ease-in-out_infinite]" />

        {/* Sharp Star Geometrics (Clockwise rotation) */}
        <g className="animate-[spin_28s_linear_infinite] origin-center" stroke="#eab308" fill="#eab308" strokeWidth="1">
          <polygon points="50,4 53,23 47,23" />
          <polygon points="50,96 53,77 47,77" />
          <polygon points="4,50 23,53 23,47" />
          <polygon points="96,50 77,53 77,47" />
          
          <polygon points="17,17 32,28 28,32" />
          <polygon points="83,83 68,72 72,68" />
          <polygon points="17,83 32,72 28,68" />
          <polygon points="83,17 68,28 72,32" />
        </g>

        {/* Wavy Inner Flare Curves (Counter-Clockwise rotation) */}
        <g className="animate-[spin_36s_linear_infinite_reverse] origin-center" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
          <path d="M50,22 C47,30 53,30 50,38" />
          <path d="M50,78 C53,70 47,70 50,62" />
          <path d="M22,50 C30,47 30,53 38,50" />
          <path d="M78,50 C70,53 70,47 62,50" />
          
          <path d="M30,30 C36,38 42,32 38,42" />
          <path d="M70,70 C64,62 58,68 62,58" />
          <path d="M30,70 C38,64 32,58 42,62" />
          <path d="M70,30 C62,36 68,42 58,38" />
        </g>

        {/* Scientific alignment/utility orbit ring overlay */}
        <circle cx="50" cy="50" r="26" fill="none" stroke="#ca8a04" strokeWidth="0.75" strokeDasharray="3 3" className="animate-[spin_10s_linear_infinite] origin-center" />

        {/* Core Solar Node (Pulsing and rotating) */}
        <circle cx="50" cy="50" r="17" fill="url(#componentSolarGlow)" className="animate-[pulse_1.5s_ease-in-out_infinite] origin-center" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2 1" className="animate-[spin_6s_linear_infinite_reverse] origin-center" />
      </svg>
    </div>
  );
}
