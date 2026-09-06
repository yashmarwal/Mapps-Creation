"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Video } from "lucide-react";

interface Ai2dAnimationVideoProps {
  videoUrl?: string;
  contextLabel?: string;
  className?: string;
}

/**
 * HTML 2D AI Animation Video Component
 * Renders an HTML <video> element with fallback to a real-time HTML5 2D Canvas vector loop.
 * Plays a cool 2D AI animation video in real-time inside the chat box.
 */
export function Ai2dAnimationVideo({
  videoUrl,
  contextLabel = "Sensing: Surat Fabric Hub",
  className = "",
}: Ai2dAnimationVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // HTML5 Canvas 2D Real-time Animation Loop (Fallback when no MP4 video provided)
  useEffect(() => {
    if (videoUrl) return; // Use native HTML video if URL is supplied

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particles for 2D graffiti/cyberpunk animation
    const particles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * 300,
      y: Math.random() * 100,
      radius: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: ["#EC4899", "#F59E0B", "#06B6D4", "#10B981", "#A855F7"][Math.floor(Math.random() * 5)],
    }));

    const render = () => {
      time += 0.03;
      const width = (canvas.width = canvas.offsetWidth || 300);
      const height = (canvas.height = canvas.offsetHeight || 100);

      // Deep Cyberpunk Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#080614");
      bgGrad.addColorStop(0.5, "#0D0A24");
      bgGrad.addColorStop(1, "#07101E");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw 2D Animated Waveform / Energy Lines
      ctx.beginPath();
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin(x * 0.03 + time * 2) * 12 + Math.cos(x * 0.015 - time) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad.addColorStop(0, "#EC4899");
      waveGrad.addColorStop(0.5, "#F59E0B");
      waveGrad.addColorStop(1, "#06B6D4");
      ctx.strokeStyle = waveGrad;
      ctx.shadowColor = "#F59E0B";
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

      // Draw 2D Rotating Central Energy Rings
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.8);

      // Outer 2D Ring
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.setLineDash([6, 4]);
      ctx.stroke();

      // Inner 2D Ring
      ctx.rotate(-time * 1.6);
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.8)";
      ctx.setLineDash([4, 2]);
      ctx.stroke();

      ctx.restore();

      // Draw 2D Particles with Drip Motion
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2D AI Core Pulse Text in Center
      ctx.font = "900 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FDE047";
      ctx.fillText("ASK MAPPSY 2D AI", centerX, centerY);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [videoUrl]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-amber-500/30 bg-[#070B18] shadow-[0_0_20px_rgba(245,158,11,0.2)] ${className}`}
    >
      {/* HTML <video> player element if URL provided */}
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-24 object-cover rounded-2xl"
        />
      ) : (
        /* Real-time HTML5 2D Canvas Video Stream Animation */
        <canvas ref={canvasRef} className="w-full h-24 block rounded-2xl pointer-events-none" />
      )}

      {/* Overlay HUD info badge */}
      <div className="absolute top-2 left-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md">
        <Video className="h-3 w-3 text-pink-400 animate-pulse" />
        <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest">
          HTML 2D AI VIDEO
        </span>
      </div>

      <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-cyan-500/20 backdrop-blur-md truncate max-w-[210px]">
          <Sparkles className="h-2.5 w-2.5 text-amber-400 shrink-0" />
          <span className="truncate">{contextLabel}</span>
        </span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
      </div>
    </div>
  );
}
