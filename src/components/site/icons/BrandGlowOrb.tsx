"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CopilotState = "idle" | "listening" | "thinking" | "speaking" | "happy" | "confused";

/**
 * Brand-styled Rotating Multi-Glow AI Core
 * Inspired by Uiverse rotative shadow loader, tailored to Mapps Creation's luxury palette:
 * - Luxury Gold (#F59E0B), Emerald (#10B981), Royal Navy (#1E3A8A), Warm Amber (#FBBF24).
 * - Multi-layer rotating 4-corner box-shadow aura (external-shadow + central).
 * - Dynamic state-based rotation speed, shadow intensity & live percentage / status counter.
 */
export function BrandGlowOrb({
  state = "idle",
  size = 56,
  className = "",
}: {
  state?: CopilotState;
  size?: number;
  className?: string;
}) {
  const [percent, setPercent] = useState(100);

  // Dynamic percentage counter animation when thinking
  useEffect(() => {
    if (state === "thinking") {
      setPercent(0);
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 99) return 99;
          return prev + Math.floor(Math.random() * 18) + 5;
        });
      }, 70);
      return () => clearInterval(interval);
    } else if (state === "speaking" || state === "happy") {
      setPercent(100);
    } else {
      setPercent(100);
    }
  }, [state]);

  // Rotation duration based on AI state
  const getRotationDuration = () => {
    switch (state) {
      case "thinking":
        return 1.2; // Rapid rotation when analyzing
      case "speaking":
        return 2.0; // Dynamic active rotation when streaming text
      case "listening":
        return 2.5; // Perked-up rotation
      case "happy":
        return 1.8; // Celebratory rotation
      default:
        return 6.0; // Calm ambient idle rotation
    }
  };

  // Brand-Tailored 4-Corner Box-Shadow Color Palettes
  const getShadowStyle = () => {
    switch (state) {
      case "thinking":
        // Purple & Gold High-Energy Analysis
        return {
          inner:
            "0.4em 0.8em 1em #A855F7, -0.4em 0.4em 1em #EC4899, 0.4em -0.4em 1em #F59E0B, -0.4em -0.4em 1em #3B82F6",
          outer:
            "0.5em 0.5em 2.5em #A855F7, -0.5em 0.5em 2.5em #EC4899, 0.5em -0.5em 2.5em #F59E0B, -0.5em -0.5em 2.5em #3B82F6",
        };
      case "speaking":
        // Emerald & Gold Active Answering
        return {
          inner:
            "0.4em 0.8em 1em #10B981, -0.4em 0.4em 1em #F59E0B, 0.4em -0.4em 1em #34D399, -0.4em -0.4em 1em #FBBF24",
          outer:
            "0.5em 0.5em 2.5em #10B981, -0.5em 0.5em 2.5em #F59E0B, 0.5em -0.5em 2.5em #34D399, -0.5em -0.5em 2.5em #FBBF24",
        };
      case "listening":
        // Electric Cyan & Royal Blue Focus
        return {
          inner:
            "0.4em 0.8em 1em #3B82F6, -0.4em 0.4em 1em #06B6D4, 0.4em -0.4em 1em #6366F1, -0.4em -0.4em 1em #38BDF8",
          outer:
            "0.5em 0.5em 2.5em #3B82F6, -0.5em 0.5em 2.5em #06B6D4, 0.5em -0.5em 2.5em #6366F1, -0.5em -0.5em 2.5em #38BDF8",
        };
      case "happy":
        // Gold Celebration
        return {
          inner:
            "0.4em 0.8em 1.2em #FBBF24, -0.4em 0.4em 1.2em #F59E0B, 0.4em -0.4em 1.2em #34D399, -0.4em -0.4em 1.2em #FDE047",
          outer:
            "0.6em 0.6em 3em #FBBF24, -0.6em 0.6em 3em #F59E0B, 0.6em -0.6em 3em #34D399, -0.6em -0.6em 3em #FDE047",
        };
      default:
        // Idle Luxury Mapps Creation Brand Shadows (Gold, Emerald, Cyan, Amber)
        return {
          inner:
            "0.4em 0.8em 1em #F59E0B, -0.4em 0.4em 1em #10B981, 0.4em -0.4em 1em #06B6D4, -0.4em -0.4em 1em #FBBF24",
          outer:
            "0.5em 0.5em 2.5em #F59E0B, -0.5em 0.5em 2.5em #10B981, 0.5em -0.5em 2.5em #06B6D4, -0.5em -0.5em 2.5em #FBBF24",
        };
    }
  };

  const shadows = getShadowStyle();
  const rotationDuration = getRotationDuration();

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Rotating Shadow Core Container */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* External Rotating Multi-Color Box-Shadow Core */}
        <motion.div
          className="relative flex items-center justify-center rounded-full w-full h-full bg-[#0A1424]"
          style={{
            boxShadow: shadows.outer,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: rotationDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Inner Central Glow Ring */}
          <div
            className="flex items-center justify-center rounded-full w-[82%] h-[82%] bg-[#070D19]/90 border border-white/20 backdrop-blur-md"
            style={{
              boxShadow: shadows.inner,
            }}
          />
        </motion.div>

        {/* Center Status / Percentage Indicator Text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {state === "thinking" ? (
              <motion.span
                key="thinking"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className="font-mono text-[10px] sm:text-xs font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              >
                {percent}%
              </motion.span>
            ) : state === "speaking" ? (
              <motion.span
                key="speaking"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="font-mono text-[9px] font-bold tracking-widest text-emerald-300 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              >
                LIVE
              </motion.span>
            ) : state === "happy" ? (
              <motion.span
                key="happy"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono text-[10px] font-bold text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
              >
                100%
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-mono text-[10px] font-bold tracking-wider text-amber-400/90 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              >
                AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
