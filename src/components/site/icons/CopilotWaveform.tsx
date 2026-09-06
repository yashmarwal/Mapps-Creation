"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export type CopilotState = "idle" | "listening" | "thinking" | "speaking" | "happy" | "confused";

export type CopilotEmotion = {
  label: string;
  emoji: string;
  color: string;
  bgTint: string;
};

export const COPILOT_EMOTIONS: Record<CopilotState, CopilotEmotion> = {
  idle: {
    label: "Live Inspector",
    emoji: "👁️",
    color: "#F59E0B",
    bgTint: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
  listening: {
    label: "Listening...",
    emoji: "🎧",
    color: "#3B82F6",
    bgTint: "bg-blue-500/10 border-blue-500/30 text-blue-300",
  },
  thinking: {
    label: "Analyzing Specs...",
    emoji: "🧠",
    color: "#A855F7",
    bgTint: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  },
  speaking: {
    label: "Explaining",
    emoji: "⚡",
    color: "#10B981",
    bgTint: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  },
  happy: {
    label: "Optimal Match!",
    emoji: "✨",
    color: "#FBBF24",
    bgTint: "bg-amber-400/20 border-amber-400/40 text-amber-200",
  },
  confused: {
    label: "Seeking Details",
    emoji: "🤔",
    color: "#F97316",
    bgTint: "bg-orange-500/10 border-orange-500/30 text-orange-300",
  },
};

export function CopilotWaveform({
  state = "idle",
  size = 28,
  className = "",
}: {
  state?: CopilotState;
  size?: number;
  className?: string;
}) {
  const gradId = useId();
  const glowId = useId();
  const emotion = COPILOT_EMOTIONS[state] || COPILOT_EMOTIONS.idle;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.svg
        viewBox="0 0 36 36"
        width={size}
        height={size}
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={emotion.color} />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Neural Ring */}
        <motion.circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={emotion.color}
          strokeWidth="1.2"
          strokeDasharray={state === "thinking" ? "4 3" : "none"}
          opacity="0.4"
          animate={
            state === "thinking"
              ? { rotate: 360, scale: [1, 1.05, 1] }
              : state === "speaking"
                ? { scale: [1, 1.08, 1], opacity: [0.3, 0.7, 0.3] }
                : { scale: [1, 1.03, 1] }
          }
          transition={
            state === "thinking"
              ? {
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity },
                }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
        />

        {/* Inner Glowing Core */}
        <circle
          cx="18"
          cy="18"
          r="12"
          fill="#0A1628"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
        />

        {/* Dynamic Neural Equalizer Bars / Waveform */}
        {state === "thinking" ? (
          /* Spinning Neural Orbit Dots */
          <g>
            <motion.circle
              cx="18"
              cy="18"
              r="6"
              fill="none"
              stroke={emotion.color}
              strokeWidth="2"
              strokeDasharray="8 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <circle cx="18" cy="18" r="2.5" fill={emotion.color} />
          </g>
        ) : (
          /* Live Equalizer Frequency Bars */
          <g filter={`url(#${glowId})`}>
            {[-6, -2, 2, 6].map((offset, idx) => {
              const baseHeights = [8, 14, 10, 6];
              const targetHeight = baseHeights[idx];

              return (
                <motion.rect
                  key={idx}
                  x={17 + offset - 1}
                  y={18 - targetHeight / 2}
                  width="2"
                  height={targetHeight}
                  rx="1"
                  fill={emotion.color}
                  animate={
                    state === "speaking"
                      ? {
                          height: [4, 16, 6, 14, 8][idx % 5],
                          y: [16, 10, 15, 11, 14][idx % 5],
                        }
                      : state === "listening"
                        ? {
                            height: [6, 12, 16, 8][idx],
                            y: [15, 12, 10, 14][idx],
                          }
                        : {
                            height: [6, 10, 8, 5][idx],
                            y: [15, 13, 14, 15.5][idx],
                          }
                  }
                  transition={{
                    duration: state === "speaking" ? 0.35 + idx * 0.08 : 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </g>
        )}
      </motion.svg>
    </div>
  );
}
