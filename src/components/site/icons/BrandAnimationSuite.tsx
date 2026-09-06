"use client";

import { motion } from "framer-motion";

/**
 * 1. NeuralFabricGlowCore
 * Synthesizes Conic Gradient Light Trails (Ref 3) + Concentric Arc Rotations (Ref 2)
 * + Fluid Morphing Geometry (Ref 5) in Mapps Creation Luxury Palette (Gold, Emerald, Cyan, Amber).
 */
export function NeuralFabricGlowCore({ size = 56 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Conic Light Trail Layer 1 (Gold & Emerald) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 60%, #F59E0B 80%, #10B981 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />

      {/* Conic Light Trail Layer 2 (Cyan & Amber Opposing) */}
      <motion.div
        className="absolute inset-1 rounded-full"
        style={{
          background:
            "conic-gradient(from 180deg, transparent 0%, transparent 65%, #06B6D4 85%, #FBBF24 100%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />

      {/* SVG Multi-Ring Concentric Arcs (Ref 2) */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none p-1">
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="40 20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeDasharray="25 15"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray="15 10"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
      </svg>

      {/* Center Core Badge with Morphing Inner Blur (Ref 5) */}
      <motion.div
        className="relative z-10 flex h-[64%] w-[64%] items-center justify-center bg-[#070D19]/95 border border-amber-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        animate={{
          borderRadius: ["50%", "30%", "50%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="font-mono text-[10px] font-black tracking-wider text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
          AI
        </span>
      </motion.div>
    </div>
  );
}

/**
 * 2. WovenGelMeshLoader
 * Synthesizes Honeycomb/Gel Cascade Pulse (Ref 1) + Stepped Snap Rotations (Ref 4)
 * Represents Surat's woven thread grid and neural fabric lot analysis.
 */
export function WovenGelMeshLoader({ size = 48 }: { size?: number }) {
  // 6 radial dots + 1 center dot
  const dots = [
    { x: 0, y: 0, delay: 0 },
    { x: -14, y: -8, delay: 0.15 },
    { x: 0, y: -16, delay: 0.3 },
    { x: 14, y: -8, delay: 0.45 },
    { x: 14, y: 8, delay: 0.6 },
    { x: 0, y: 16, delay: 0.75 },
    { x: -14, y: 8, delay: 0.9 },
  ];

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{ rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
            style={{
              width: i === 0 ? 10 : 7,
              height: i === 0 ? 10 : 7,
              left: `calc(50% + ${d.x}px - ${i === 0 ? 5 : 3.5}px)`,
              top: `calc(50% + ${d.y}px - ${i === 0 ? 5 : 3.5}px)`,
            }}
            animate={{
              scale: [1, 0.2, 1],
              opacity: [0.9, 0.3, 0.9],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: d.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

/**
 * 3. ConicAuraBadge
 * Synthesizes Conic Light Trails & Morphing Glow into a responsive pill accent for buttons/docks.
 */
export function ConicAuraBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative p-[1.5px] rounded-2xl overflow-hidden group ${className}`}>
      {/* Rotating Conic Gradient Aura */}
      <motion.div
        className="absolute -inset-[100%] rounded-2xl bg-[conic-gradient(from_0deg,#F59E0B,#10B981,#06B6D4,#FBBF24,#F59E0B)] opacity-70 group-hover:opacity-100 transition-opacity"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner Glass Box */}
      <div className="relative rounded-[14px] bg-[#0A1628]/95 backdrop-blur-xl h-full w-full">
        {children}
      </div>
    </div>
  );
}
