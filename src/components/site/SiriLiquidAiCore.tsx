"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AIVisualState = "idle" | "typing" | "sending" | "thinking" | "streaming" | "complete";

interface SiriLiquidAiCoreProps {
  state?: AIVisualState;
  size?: number;
  className?: string;
  onClick?: () => void;
}

interface TargetParams {
  speed: number;
  glow: number;
  turbulence: number;
  scale: number;
  colors: string[];
}

const STATE_CONFIGS: Record<AIVisualState, TargetParams> = {
  idle: {
    speed: 0.4,
    glow: 0.35,
    turbulence: 0.1,
    scale: 1.0,
    colors: ["#F59E0B", "#10B981", "#06B6D4"],
  },
  typing: {
    speed: 0.75,
    glow: 0.55,
    turbulence: 0.22,
    scale: 1.04,
    colors: ["#06B6D4", "#F59E0B", "#10B981"],
  },
  sending: {
    speed: 2.2,
    glow: 0.95,
    turbulence: 0.65,
    scale: 0.9, // Gentle compression burst
    colors: ["#FFFFFF", "#F59E0B", "#EC4899"],
  },
  thinking: {
    speed: 1.8,
    glow: 0.85,
    turbulence: 0.55,
    scale: 1.06,
    colors: ["#8B5CF6", "#EC4899", "#F59E0B"],
  },
  streaming: {
    speed: 1.2,
    glow: 0.65,
    turbulence: 0.3,
    scale: 1.02,
    colors: ["#10B981", "#F59E0B", "#34D399"],
  },
  complete: {
    speed: 0.5,
    glow: 0.45,
    turbulence: 0.15,
    scale: 1.0,
    colors: ["#FDE047", "#10B981", "#F59E0B"],
  },
};

// RGB Color Lerp Helpers for Butter-Smooth Color Transitions
function hexToRgb(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const num = parseInt(c, 16) || 0;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function lerpColor(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number },
  factor: number,
) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * factor),
    g: Math.round(c1.g + (c2.g - c1.g) * factor),
    b: Math.round(c1.b + (c2.b - c1.b) * factor),
  };
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
}

/**
 * Siri-Inspired Living Liquid-Energy Intelligence Core
 * Features butter-smooth RGB color morphing, refined ultra-subtle physics lerp,
 * stable zero-jitter mouse attraction, and slightly enlarged presence.
 */
export function SiriLiquidAiCore({
  state = "idle",
  size = 68,
  className = "",
  onClick,
}: SiriLiquidAiCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-performance Ref mouse tracking
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  // Ref, not state: read inside the render loop below without needing it in
  // that effect's dependency array — as state, every hover in/out restarted
  // the whole 60fps RAF loop (fresh random blob positions, reset timer),
  // which is unnecessary main-thread churn for something mounted on every
  // page (the floating trigger button never unmounts).
  const isHoveredRef = useRef(false);
  const [clickRipple, setClickRipple] = useState(false);

  // Current interpolated physics values & color state
  const currentPhysics = useRef({
    speed: 0.4,
    glow: 0.4,
    turbulence: 0.12,
    scale: 1.05,
    hoverScale: 1.0,
  });

  const currentColor1 = useRef(hexToRgb("#F59E0B"));
  const currentColor2 = useRef(hexToRgb("#10B981"));
  const currentColor3 = useRef(hexToRgb("#06B6D4"));

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current.targetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    mousePosRef.current.targetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    mousePosRef.current.targetX = 0;
    mousePosRef.current.targetY = 0;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickRipple(true);
    setTimeout(() => setClickRipple(false), 600);
    if (onClick) onClick();
  };

  // 60fps Canvas Liquid Energy Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Liquid Blobs Simulation
    const blobs = Array.from({ length: 5 }).map((_, i) => ({
      angle: (i * Math.PI * 2) / 5,
      dist: 8 + Math.random() * 5,
      speedMult: 0.7 + Math.random() * 0.3,
      radius: 11 + Math.random() * 4,
    }));

    const render = () => {
      const target = STATE_CONFIGS[state] || STATE_CONFIGS.idle;
      const physics = currentPhysics.current;

      // Ultra-smooth, gradual physics parameter lerp (0.03 factor for butter-smooth state shifts)
      const lerpFactor = state === "sending" ? 0.08 : 0.03;
      physics.speed += (target.speed - physics.speed) * lerpFactor;
      physics.glow += (target.glow - physics.glow) * lerpFactor;
      physics.turbulence += (target.turbulence - physics.turbulence) * lerpFactor;
      physics.scale += (target.scale - physics.scale) * lerpFactor;

      // Smooth hover scale inflation lerp
      const targetHoverScale = isHoveredRef.current ? 1.08 : 1.0;
      physics.hoverScale += (targetHoverScale - physics.hoverScale) * 0.05;

      // Smooth RGB color lerp (0.025 factor for subtle fluid color morphing)
      const targetC1 = hexToRgb(target.colors[0] || "#F59E0B");
      const targetC2 = hexToRgb(target.colors[1] || "#10B981");
      const targetC3 = hexToRgb(target.colors[2] || "#06B6D4");

      const colorLerpRate = 0.025;
      currentColor1.current = lerpColor(currentColor1.current, targetC1, colorLerpRate);
      currentColor2.current = lerpColor(currentColor2.current, targetC2, colorLerpRate);
      currentColor3.current = lerpColor(currentColor3.current, targetC3, colorLerpRate);

      const mainColor = rgbToHex(currentColor1.current);
      const secondaryColor = rgbToHex(currentColor2.current);
      const accentColor = rgbToHex(currentColor3.current);

      // Lerp mouse positions for responsive, jitter-free parallax
      const mouse = mousePosRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      time += prefersReducedMotion ? 0.003 : 0.012 * physics.speed;

      const width = (canvas.width = size * 2);
      const height = (canvas.height = size * 2);
      const cx = width / 2;
      const cy = height / 2;
      const r = size * 0.46 * physics.scale * physics.hoverScale;

      ctx.clearRect(0, 0, width, height);

      // Mouse attraction displacement
      const mouseOffsetX = mouse.x * 4.5;
      const mouseOffsetY = mouse.y * 4.5;

      // 1. Ambient Volumetric Glow Background
      const glowGrad = ctx.createRadialGradient(
        cx + mouseOffsetX,
        cy + mouseOffsetY,
        r * 0.15,
        cx,
        cy,
        r * 2.3,
      );

      glowGrad.addColorStop(0, `${mainColor}77`);
      glowGrad.addColorStop(0.5, `${secondaryColor}33`);
      glowGrad.addColorStop(1, "rgba(7, 13, 25, 0)");

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Liquid Energy Field
      ctx.save();
      ctx.translate(cx + mouseOffsetX * 0.5, cy + mouseOffsetY * 0.5);

      // Organic Liquid Perimeter
      ctx.beginPath();
      const points = 16;
      for (let i = 0; i <= points; i++) {
        const theta = (i * Math.PI * 2) / points;
        const wave1 = Math.sin(theta * 3 + time * 1.2) * 2.0 * physics.turbulence;
        const wave2 = Math.cos(theta * 4 - time * 1.4) * 1.4 * physics.turbulence;
        const currentR = r + wave1 + wave2;
        const px = Math.cos(theta) * currentR;
        const py = Math.sin(theta) * currentR;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Liquid Gradient Fill
      const liquidGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.2);
      liquidGrad.addColorStop(0, mainColor);
      liquidGrad.addColorStop(0.5, secondaryColor);
      liquidGrad.addColorStop(0.85, accentColor);
      liquidGrad.addColorStop(1, "#070D19");

      ctx.fillStyle = liquidGrad;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 14 * physics.glow;
      ctx.fill();

      // Inner Liquid Swirling Blobs
      blobs.forEach((blob, i) => {
        const curAngle = blob.angle + time * blob.speedMult;
        const curDist = blob.dist * physics.turbulence * 0.9;
        const bx = Math.cos(curAngle) * curDist;
        const by = Math.sin(curAngle) * curDist;

        ctx.beginPath();
        ctx.arc(bx, by, blob.radius * (r / 25), 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? `${mainColor}aa` : `${accentColor}99`;
        ctx.fill();
      });

      // Glass Edge Rim Light
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.restore();

      // 3. Central Deep Core Light Pulse
      ctx.save();
      ctx.translate(cx, cy);
      const corePulse = Math.sin(time * 2.0) * 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(2, r * 0.22 + corePulse), 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#FFFFFF";
      ctx.shadowBlur = 10 * physics.glow;
      ctx.fill();
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [state, size]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative flex items-center justify-center select-none cursor-pointer overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic 60fps Liquid Energy Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none rounded-full" />

      {/* Glassmorphic Depth Highlight Overlay */}
      <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none bg-gradient-to-b from-white/15 via-transparent to-black/30 shadow-inner" />

      {/* Click Ripple Effect */}
      <AnimatePresence>
        {clickRipple && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
