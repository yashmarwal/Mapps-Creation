"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

interface RemotionDockMotionVideoProps {
  videoUrl?: string;
  onClick?: () => void;
}

/**
 * Remotion-Style Motion Design Video Component for Mobile Dock
 * Emulates a Remotion-rendered kinetic motion design video with 60fps spring physics,
 * kinetic typography sequences, neon motion graphics, and audio-visualizer pulses.
 */
export function RemotionDockMotionVideo({ videoUrl, onClick }: RemotionDockMotionVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [seqIdx, setSeqIdx] = useState(0);

  const SEQUENCES = [
    {
      title: "ASK MAPPSY",
      subtitle: "Surat Fabric AI",
      color: "from-amber-300 via-pink-400 to-cyan-300",
    },
    {
      title: "500+ QUALITIES",
      subtitle: "Lycra & Spandex",
      color: "from-emerald-300 via-cyan-400 to-indigo-300",
    },
    {
      title: "REAL-TIME QUOTES",
      subtitle: "GSM • MOQ • Rates",
      color: "from-pink-300 via-purple-400 to-amber-300",
    },
  ];

  // Sequence switcher mimicking Remotion composition timeline
  useEffect(() => {
    const interval = setInterval(() => {
      setSeqIdx((prev) => (prev + 1) % SEQUENCES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [SEQUENCES.length]);

  // 60fps HTML5 Canvas Motion Graphics Renderer
  useEffect(() => {
    if (videoUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const render = () => {
      frame++;
      const width = (canvas.width = canvas.offsetWidth || 180);
      const height = (canvas.height = canvas.offsetHeight || 50);

      // Remotion Background Mesh
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0B071E");
      bgGrad.addColorStop(0.5, "#180A2A");
      bgGrad.addColorStop(1, "#071226");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Kinetic Geometric Motion Grid (Remotion motion design style)
      ctx.strokeStyle = "rgba(245, 158, 11, 0.12)";
      ctx.lineWidth = 1;
      const gridSize = 16;
      const offsetX = (frame * 0.5) % gridSize;
      for (let x = -gridSize + offsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Dynamic Laser Line Sweep
      const sweepX = (frame * 2.5) % (width * 1.5);
      const sweepGrad = ctx.createLinearGradient(sweepX - 30, 0, sweepX, 0);
      sweepGrad.addColorStop(0, "rgba(236, 72, 153, 0)");
      sweepGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.6)");
      sweepGrad.addColorStop(1, "rgba(245, 158, 11, 0.8)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(sweepX - 30, 0, 30, height);

      // Rotating Concentric HUD Circles on the left
      const cx = 24;
      const cy = height / 2;
      ctx.save();
      ctx.translate(cx, cy);

      // Ring 1
      ctx.rotate(frame * 0.04);
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();

      // Ring 2
      ctx.rotate(-frame * 0.08);
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "#06B6D4";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 2]);
      ctx.stroke();

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [videoUrl]);

  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-between overflow-hidden rounded-xl bg-[#090717] border border-amber-500/40 p-1.5 shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer active:scale-95 transition-all select-none w-full h-[48px]"
    >
      {/* Video / Remotion Motion Graphics Canvas */}
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block rounded-xl pointer-events-none"
        />
      )}

      {/* Remotion Motion Design Badge Overlay */}
      <div className="relative z-10 flex items-center gap-2 pl-1.5 pr-1">
        {/* Play indicator dot */}
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
          <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-400" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-pink-500 animate-ping" />
        </div>

        {/* Kinetic Animated Typography Sequence */}
        <div className="flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={seqIdx}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col"
            >
              <span
                className={`font-black text-[11px] tracking-wider uppercase bg-gradient-to-r ${SEQUENCES[seqIdx].color} bg-clip-text text-transparent truncate drop-shadow-[0_1px_6px_rgba(245,158,11,0.6)]`}
              >
                {SEQUENCES[seqIdx].title}
              </span>
              <span className="text-[9px] font-mono text-cyan-300/90 truncate font-semibold">
                {SEQUENCES[seqIdx].subtitle}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Action Badge */}
      <div className="relative z-10 shrink-0 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
        <span>CHAT</span>
        <Play className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
      </div>
    </div>
  );
}
