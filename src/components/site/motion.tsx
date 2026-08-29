"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { useCounter } from "@/hooks/useCounter";

export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;
export const EASE_UI = [0.16, 1, 0.3, 1] as const;

/** Word-by-word fade/slide reveal, triggered on scroll into view. */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={`relative ${className ?? ""}`}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE_REVEAL, delay: i * 0.035 }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}

/** Fade/slide in on scroll, staggered by index. */
export function Reveal({
  children,
  index = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  index?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE_REVEAL, delay: (index % 6) * 0.05 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Line-by-line clipped "stamp up" reveal.
 *
 * `play` gates the animation without unmounting the heading — pass
 * `play={ready}` from a hero synced to an intro/preloader so the text is
 * still present in SSR output (held at its clipped `initial` state) instead
 * of not existing in the markup until the intro finishes. Defaults to
 * `true` for ordinary page headings that just play on mount.
 */
export function StampHeading({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h1",
  play = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  play?: boolean;
}) {
  const reduced = useReducedMotion();
  const animateProps = play ? { animate: reduced ? { opacity: 1 } : { y: "0%" } } : {};
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            {...animateProps}
            transition={{ duration: 0.9, ease: EASE_REVEAL, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** IntersectionObserver-gated count-up, fires once at ~40% visibility. */
export function CountUp({
  to,
  duration = 2000,
  suffix = "",
  prefix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}) {
  const { ref, value } = useCounter<HTMLSpanElement>(to, duration);

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

/** Magnetic pull on hover (pointer: fine only). */
export function MagneticButton({
  children,
  className,
  href,
  target,
  rel,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const fine = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={(e) => {
        if (reduced || !fine() || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setOffset({
          x: (e.clientX - (r.left + r.width / 2)) * 0.18,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      whileHover={{ boxShadow: "var(--shadow-gold)" }}
      transition={{ duration: 0.4, ease: EASE_UI }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
