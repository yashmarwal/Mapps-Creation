"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { BrandGlowOrb, type CopilotState } from "./icons/BrandGlowOrb";

interface MobileGraffitiAiAnimationProps {
  state?: CopilotState;
  contextLabel?: string;
}

/**
 * Responsive Graffiti AI Animation Banner for Mobile Chat Box
 * Renders vibrant neon street-art spray paint blobs, dynamic fluid mesh vectors,
 * glowing splatters, and responsive gradient typography within the chat modal header on mobile.
 */
export function MobileGraffitiAiAnimation({
  state = "idle",
  contextLabel = "Surat Mill Fabric Specialist",
}: MobileGraffitiAiAnimationProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-[#090715] border border-amber-500/30 p-3 shadow-[0_0_30px_rgba(245,158,11,0.15)] my-1 select-none">
      {/* Dynamic Animated Graffiti Neon Blobs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
        {/* Neon Pink/Magenta Graffiti Spray Blob */}
        <motion.div
          className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-pink-600/40 blur-2xl"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Electric Cyan Spray Blob */}
        <motion.div
          className="absolute -bottom-8 -right-6 w-32 h-32 rounded-full bg-cyan-500/40 blur-2xl"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 15, -20, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Brand Gold Central Glow Splatter */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-20 rounded-full bg-amber-500/25 blur-xl"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Electric Violet Accent Blob */}
        <motion.div
          className="absolute top-2 right-12 w-20 h-20 rounded-full bg-purple-600/35 blur-xl"
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* SVG Graffiti Street Splatters & Grid Lines Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sprayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#EC4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Street Graffiti Spray Drips */}
          <circle cx="15%" cy="25%" r="3" fill="#EC4899" className="animate-ping" />
          <circle cx="82%" cy="75%" r="2.5" fill="#06B6D4" />
          <circle cx="90%" cy="20%" r="4" fill="#F59E0B" />
          <path
            d="M10 50 Q 50 10 90 50 T 170 50"
            fill="none"
            stroke="url(#sprayGrad)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Rotative Shadow AI Core Orb */}
          <div className="shrink-0">
            <BrandGlowOrb state={state} size={42} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {/* Graffiti Style Gradient Animated Title */}
              <span className="font-black text-sm tracking-wider uppercase bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                ASK MAPPSY
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-[9px] font-extrabold text-pink-300 uppercase tracking-widest animate-pulse">
                <Zap className="h-2.5 w-2.5 text-pink-400" /> NEURAL
              </span>
            </div>

            {/* Context Sensing Label */}
            <span className="text-[10px] font-mono text-cyan-300/90 mt-0.5 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-400 shrink-0" />
              <span className="truncate max-w-[190px]">{contextLabel}</span>
            </span>
          </div>
        </div>

        {/* Live Audio Waves / Pulse Visualizer */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 border border-amber-500/20 backdrop-blur-md">
          {[0.6, 1.2, 0.4, 0.9, 0.5].map((delay, idx) => (
            <motion.span
              key={idx}
              className="w-1 rounded-full bg-gradient-to-t from-pink-500 to-amber-400"
              animate={{
                height: state === "speaking" ? ["6px", "16px", "6px"] : ["4px", "10px", "4px"],
              }}
              transition={{
                duration: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
