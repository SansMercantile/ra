import React from "react";

// Animated Snowflake SVG Icon replacing "â„ï¸"
export function AnimatedSnowflake({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-cyan-400`}
    >
      <style>{`
        @keyframes flakeRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseFlake {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .flake-anim-rotate {
          transform-origin: center;
          animation: flakeRotate 8s linear infinite;
        }
        .flake-anim-pulse {
          transform-origin: center;
          animation: pulseFlake 2s ease-in-out infinite;
        }
      `}</style>
      <g className="flake-anim-pulse">
        <g className="flake-anim-rotate">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
          <path d="M20 16l-4-4 4-4" />
          <path d="M4 8l4 4-4 4" />
          <path d="M16 4l-4 4-4-4" />
          <path d="M8 20l4-4 4 4" />
        </g>
      </g>
    </svg>
  );
}

// Animated Robot Head SVG Icon replacing "ðŸ¤–"
export function AnimatedRobot({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-yellow-500`}
    >
      <style>{`
        @keyframes antennaPulse {
          0%, 100% { opacity: 0.4; stroke-width: 1.5; }
          50% { opacity: 1; stroke-width: 3; filter: drop-shadow(0 0 3px #eab308); }
        }
        @keyframes eyesBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes robotBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.5px); }
        }
        .antenna-glow {
          animation: antennaPulse 1.5s infinite;
        }
        .robot-eyes {
          transform-origin: 12px 13px;
          animation: eyesBlink 4s infinite;
        }
        .robot-container {
          animation: robotBob 2.5s ease-in-out infinite;
        }
      `}</style>
      <g className="robot-container">
        {/* Antenna */}
        <circle cx="12" cy="3" r="1.5" className="antenna-glow font-bold fill-yellow-500 stroke-yellow-500" />
        <line x1="12" y1="4.5" x2="12" y2="8" />
        
        {/* Head */}
        <rect x="3" y="8" width="18" height="12" rx="3" />
        
        {/* Eyes with blinking frame */}
        <g className="robot-eyes fill-yellow-500">
          <circle cx="8" cy="13" r="1.5" />
          <circle cx="16" cy="13" r="1.5" />
        </g>
        
        {/* Mouth */}
        <line x1="8" y1="17" x2="16" y2="17" />
        
        {/* Ears */}
        <path d="M2.5 12.5v3M21.5 12.5v3" />
      </g>
    </svg>
  );
}

// Animated Warning Triangle SVG Icon replacing "âš ï¸"
export function AnimatedWarning({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-red-500`}
    >
      <style>{`
        @keyframes warningPulse {
          0%, 100% { filter: drop-shadow(0 0 1px rgba(239, 68, 68, 0.4)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.9)); transform: scale(1.05); }
        }
        @keyframes bangFlash {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .warn-glow {
          transform-origin: center;
          animation: warningPulse 3s ease-in-out infinite;
        }
        .warn-bang {
          animation: bangFlash 1s ease-in-out infinite;
        }
      `}</style>
      <g className="warn-glow">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <g className="warn-bang stroke-red-500">
          <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.5" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}

// Animated Energy/Lightning SVG Icon replacing "âš¡"
export function AnimatedLightning({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-yellow-500`}
    >
      <style>{`
        @keyframes lightningStrike {
          0%, 90%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 1px rgba(234, 179, 8, 0.4)); }
          93% { opacity: 0.8; transform: scale(0.95); }
          95% { opacity: 1; transform: scale(1.1) skewX(-2deg); filter: drop-shadow(0 0 6px rgba(234, 179, 8, 0.9)); }
          97% { opacity: 0.9; transform: scale(1.02); }
        }
        .lightning-bolt {
          transform-origin: center;
          animation: lightningStrike 3s infinite;
          fill: currentColor;
        }
      `}</style>
      <polygon 
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" 
        className="lightning-bolt"
      />
    </svg>
  );
}

// Animated Battery SVG Icon replacing "ðŸ”‹"
export function AnimatedBattery({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-emerald-400`}
    >
      <style>{`
        @keyframes batteryChargeAnim {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes batteryPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; filter: drop-shadow(0 0 2px #34d399); }
        }
        .battery-body {
          animation: batteryPulse 2s infinite;
        }
        .battery-fluid {
          stroke-dasharray: 24;
          animation: batteryChargeAnim 3s linear infinite;
        }
      `}</style>
      <g className="battery-body">
        <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
        <line x1="22" y1="11" x2="22" y2="13" strokeWidth="3" />
        <line x1="5" y1="12" x2="15" y2="12" stroke="#10b981" strokeWidth="4" className="battery-fluid" />
      </g>
    </svg>
  );
}

// Animated Gear SVG Icon replacing "âš™ï¸"
export function AnimatedGear({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-zinc-400`}
    >
      <style>{`
        @keyframes gearRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .gear-spinning {
          transform-origin: center;
          animation: gearRotate 5s linear infinite;
        }
      `}</style>
      <g className="gear-spinning">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    </svg>
  );
}

// Animated Sun SVG Icon replacing "â˜€ï¸"
export function AnimatedSun({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${className} text-yellow-500`}
    >
      <style>{`
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 1px #eab308); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 4px #facc15); }
        }
        @keyframes raySpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .sun-core {
          transform-origin: center;
          animation: sunPulse 3s ease-in-out infinite;
        }
        .sun-rays {
          transform-origin: center;
          animation: raySpin 12s linear infinite;
        }
      `}</style>
      <g className="sun-core">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </g>
      <g className="sun-rays">
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="4.93" x2="19.07" y2="6.34" />
      </g>
    </svg>
  );
}

// Utility component to dynamically replace raw emoticons/emojis with their high-fidelity animated SVG equivalents
export function TextWithAnimatedIcons({ text }: { text: string }) {
  if (!text) return null;
  // Match standard emoticons / emojis we support
  const regex = /(â„ï¸|â„|ðŸ¤–|âš ï¸|âš¡|ðŸ”‹|âš™ï¸|âš™|â˜€ï¸)/g;
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part === "â„ï¸" || part === "â„") {
          return <AnimatedSnowflake key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "ðŸ¤–") {
          return <AnimatedRobot key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "âš ï¸") {
          return <AnimatedWarning key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "âš¡") {
          return <AnimatedLightning key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "ðŸ”‹") {
          return <AnimatedBattery key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "âš™ï¸" || part === "âš™") {
          return <AnimatedGear key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        if (part === "â˜€ï¸") {
          return <AnimatedSun key={index} className="inline-block w-4 h-4 mx-0.5 align-middle" />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

