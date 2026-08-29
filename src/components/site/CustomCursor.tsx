"use client";

import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, label, summary";

/** Magnetic dot + lagging ring cursor. Desktop (fine pointer) only. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mql.matches);
    const onChange = () => setEnabled(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-active", enabled);
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest?.(HOVER_SELECTOR)));
    };

    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const tick = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.18;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.18;
      if (ringRef.current) {
        const size = hovering ? 64 : 40;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.transform = `translate(${pos.current.rx - size / 2}px, ${
          pos.current.ry - size / 2
        }px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, hovering]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="bg-primary pointer-events-none fixed top-0 left-0 z-[210] h-3 w-3 rounded-full mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="border-primary pointer-events-none fixed top-0 left-0 z-[210] rounded-full border transition-[width,height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </>
  );
}
