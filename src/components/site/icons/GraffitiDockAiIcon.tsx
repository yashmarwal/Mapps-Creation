"use client";

import { motion } from "framer-motion";

/**
 * Responsive 2D Graffiti AI Animation Icon for Mobile Dock
 * Features 2D vector street-art spray paint particles, neon gradient aura,
 * dynamic drip ripples, and animated 2D graffiti sparkle rings.
 */
export function GraffitiDockAiIcon({ size = 26 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* 2D Rotating Neon Graffiti Aura */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF007F] via-[#FFB800] to-[#00F0FF] opacity-85 blur-[3px]"
        animate={{
          rotate: 360,
          scale: [0.95, 1.15, 0.95],
        }}
        transition={{
          rotate: { duration: 3.5, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* 2D Graffiti Paint Splatter Particles */}
      <motion.span
        className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-[#FF007F] shadow-[0_0_6px_#FF007F]"
        animate={{
          y: [-2, 2, -2],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.span
        className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]"
        animate={{
          x: [-2, 2, -2],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      {/* SVG 2D Graffiti Drip & Sparkle Vectors */}
      <svg
        viewBox="0 0 32 32"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 2D Graffiti Drip Path */}
        <motion.path
          d="M 16 2 C 24 2, 30 8, 30 16 C 30 24, 24 30, 16 30 C 8 30, 2 24, 2 16"
          stroke="url(#graffitiGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
          animate={{ strokeDashoffset: [0, -20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="graffitiGrad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#FF007F" />
            <stop offset="50%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Inner Central 2D AI Badge */}
      <div className="relative z-20 flex h-[78%] w-[78%] items-center justify-center rounded-full bg-[#070D19] border border-amber-400/50 shadow-inner">
        <span className="font-mono text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 tracking-tighter drop-shadow-[0_0_4px_rgba(255,184,0,0.8)]">
          AI
        </span>
      </div>
    </div>
  );
}
