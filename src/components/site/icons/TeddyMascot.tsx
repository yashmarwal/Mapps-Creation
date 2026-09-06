"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export type MascotMood = "idle" | "thinking" | "answering" | "happy" | "confused";

/**
 * Teddy Bear AI Assistant Mascot — "Teddy Fabric Specialist"
 *
 * Features distinct expressive states:
 * - "idle": Gentle breathing bob, glossy eyes, warm welcoming smile.
 * - "thinking": Slight head tilt, eyes looking upward, ear wiggles softly while processing queries.
 * - "answering": Talking mouth animation with bright enthusiastic eye twinkle when delivering fabric answers.
 * - "happy": Joyful eye arcs (^ ^), blush cheeks, celebratory bounce for matched answers.
 * - "confused": Tilted brows, curious gaze, question mark indicator for fallbacks.
 */
export function TeddyMascot({
  mood = "idle",
  size = 32,
  animate = true,
  className = "",
}: {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const headGradId = useId();
  const earGradId = useId();
  const tapeGradId = useId();
  const ink = "#2B1706";

  const motionProps = animate
    ? mood === "thinking"
      ? {
          animate: { rotate: [-3, 4, -3], y: [0, -1, 0] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
        }
      : mood === "answering"
        ? {
            animate: { y: [0, -2, 0], scale: [1, 1.03, 1] },
            transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
          }
        : mood === "happy"
          ? {
              animate: { y: [0, -3.5, 0], rotate: [-2, 2, -2] },
              transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
            }
          : {
              animate: { y: [0, -1.5, 0] },
              transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
            }
    : {};

  return (
    <motion.svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...motionProps}
    >
      <defs>
        {/* Main Teddy Fur Gradient */}
        <linearGradient
          id={headGradId}
          x1="6"
          y1="4"
          x2="34"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E2A76F" />
          <stop offset="50%" stopColor="#C48446" />
          <stop offset="100%" stopColor="#9B5D23" />
        </linearGradient>

        {/* Inner Ear Soft Gradient */}
        <linearGradient id={earGradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE6D2" />
          <stop offset="100%" stopColor="#E4B48A" />
        </linearGradient>

        {/* Tailor Measuring Tape Gold Gradient */}
        <linearGradient id={tapeGradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* --- Teddy Ears --- */}
      {/* Outer Left Ear */}
      <circle
        cx="9"
        cy="9"
        r="6.5"
        fill={`url(#${headGradId})`}
        stroke="#6C3B11"
        strokeWidth="0.6"
      />
      {/* Inner Left Ear */}
      <circle cx="9.5" cy="9.5" r="3.8" fill={`url(#${earGradId})`} />

      {/* Outer Right Ear */}
      <circle
        cx="31"
        cy="9"
        r="6.5"
        fill={`url(#${headGradId})`}
        stroke="#6C3B11"
        strokeWidth="0.6"
      />
      {/* Inner Right Ear */}
      <circle cx="30.5" cy="9.5" r="3.8" fill={`url(#${earGradId})`} />

      {/* --- Teddy Head Body --- */}
      <circle
        cx="20"
        cy="21"
        r="14.5"
        fill={`url(#${headGradId})`}
        stroke="#6A3910"
        strokeWidth="0.7"
      />

      {/* Subtle Fur Shadow Highlight */}
      <ellipse cx="20" cy="10.5" rx="7" ry="2" fill="#FFFFFF" opacity="0.15" />

      {/* --- Cream Muzzle Area --- */}
      <ellipse
        cx="20"
        cy="24.5"
        rx="7.2"
        ry="5.5"
        fill="#FFF2E2"
        stroke="#D9A877"
        strokeWidth="0.5"
      />

      {/* --- Tailor Measuring Tape / Bow Tie Accent --- */}
      <path
        d="M14 34.5 C 17 33, 23 33, 26 34.5 C 24 37.5, 16 37.5, 14 34.5 Z"
        fill={`url(#${tapeGradId})`}
        stroke="#B45309"
        strokeWidth="0.5"
      />
      {/* Tape Tick Marks */}
      <line x1="17" y1="34" x2="17" y2="35.5" stroke="#78350F" strokeWidth="0.6" />
      <line x1="20" y1="33.8" x2="20" y2="35.5" stroke="#78350F" strokeWidth="0.7" />
      <line x1="23" y1="34" x2="23" y2="35.5" stroke="#78350F" strokeWidth="0.6" />

      {/* --- Eyebrows (Confused or Thinking) --- */}
      {mood === "confused" && (
        <g stroke={ink} strokeWidth="1.2" strokeLinecap="round">
          <line x1="11" y1="12" x2="15.5" y2="13.5" />
          <line x1="24.5" y1="13.5" x2="29" y2="11" />
        </g>
      )}
      {mood === "thinking" && (
        <g stroke={ink} strokeWidth="1.1" strokeLinecap="round" opacity="0.8">
          <path d="M12 12.5 Q14.5 11 17 12.5" />
          <path d="M23 12.5 Q25.5 11 28 12.5" />
        </g>
      )}

      {/* --- Eyes --- */}
      {mood === "happy" ? (
        /* Happy Arc Eyes (^ ^) */
        <g stroke={ink} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M11.5 16.5 Q15 12.5 18.5 16.5" />
          <path d="M21.5 16.5 Q25 12.5 28.5 16.5" />
        </g>
      ) : mood === "thinking" ? (
        /* Looking up in thought */
        <g fill={ink}>
          <circle cx="15" cy="14.8" r="1.9" />
          <circle cx="15.5" cy="14.2" r="0.7" fill="#FFFFFF" />
          <circle cx="25" cy="14.8" r="1.9" />
          <circle cx="25.5" cy="14.2" r="0.7" fill="#FFFFFF" />
        </g>
      ) : mood === "answering" ? (
        /* Bright twinkling eyes */
        <g fill={ink}>
          <circle cx="15" cy="16" r="2.1" />
          <circle cx="14.2" cy="15.2" r="0.85" fill="#FFFFFF" />
          <circle cx="15.8" cy="16.8" r="0.4" fill="#FFFFFF" />

          <circle cx="25" cy="16" r="2.1" />
          <circle cx="24.2" cy="15.2" r="0.85" fill="#FFFFFF" />
          <circle cx="25.8" cy="16.8" r="0.4" fill="#FFFFFF" />
        </g>
      ) : (
        /* Idle Glossy Teddy Eyes */
        <g fill={ink}>
          <circle cx="15" cy="16" r="2" />
          <circle cx="14.3" cy="15.3" r="0.75" fill="#FFFFFF" />

          <circle cx="25" cy="16" r="2" />
          <circle cx="24.3" cy="15.3" r="0.75" fill="#FFFFFF" />
        </g>
      )}

      {/* --- Cute Rosy Cheeks (Happy / Answering) --- */}
      {(mood === "happy" || mood === "answering") && (
        <g opacity="0.45">
          <circle cx="11.5" cy="19.5" r="2.2" fill="#F43F5E" />
          <circle cx="28.5" cy="19.5" r="2.2" fill="#F43F5E" />
        </g>
      )}

      {/* --- Nose --- */}
      {/* Heart-Button Teddy Nose */}
      <path
        d="M18 21.5 C18 20.8, 19 20.2, 20 20.2 C21 20.2, 22 20.8, 22 21.5 C22 22.5, 20 23.6, 20 23.6 C20 23.6, 18 22.5, 18 21.5 Z"
        fill="#3F200A"
      />
      <circle cx="19.3" cy="21" r="0.45" fill="#FFFFFF" opacity="0.8" />

      {/* --- Mouth & Expressions --- */}
      {mood === "answering" ? (
        /* Animated Talking Mouth */
        <motion.path
          d="M17.5 24.5 Q20 28 22.5 24.5 Z"
          fill="#5B1E1E"
          stroke={ink}
          strokeWidth="0.8"
          strokeLinecap="round"
          animate={{
            d: [
              "M17.5 24.5 Q20 27.5 22.5 24.5 Z",
              "M18 24.5 Q20 26 22 24.5 Z",
              "M17.5 24.5 Q20 27.5 22.5 24.5 Z",
            ],
          }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : mood === "happy" ? (
        /* Wide Open Smile */
        <path
          d="M16.5 24.2 Q20 28.5 23.5 24.2"
          stroke={ink}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
      ) : mood === "thinking" ? (
        /* Concentrating Small Mouth */
        <path
          d="M18 25 Q20 24 22 25"
          stroke={ink}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      ) : mood === "confused" ? (
        /* Wavy Curious Mouth */
        <path
          d="M16.5 25.5 Q18.5 24 20 25.5 T23.5 25.5"
          stroke={ink}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        /* Gentle Teddy Smile */
        <path
          d="M17 24.5 Q20 27 23 24.5"
          stroke={ink}
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* --- Question Mark Badge (Confused mode) --- */}
      {mood === "confused" && (
        <g transform="translate(28, 2)">
          <circle cx="4" cy="4" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="0.5" />
          <text x="4" y="6" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#000000">
            ?
          </text>
        </g>
      )}
    </motion.svg>
  );
}
