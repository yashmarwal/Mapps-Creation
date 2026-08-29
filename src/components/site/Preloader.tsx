"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EASE_REVEAL } from "./motion";

const IntroContext = createContext({ ready: false, base: 0 });

/** Hero and above-the-fold animations time themselves off this. */
export function useIntro() {
  return useContext(IntroContext);
}

const HOLD_MS = 1500;

function KineticText({
  text,
  delay,
  charDelay = 0.02,
  className,
}: {
  text: string;
  delay: number;
  charDelay?: number;
  className?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_REVEAL, delay: delay + i * charDelay }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<{ show: boolean; ready: boolean; base: number }>({
    show: false,
    ready: false,
    base: 0,
  });

  useEffect(() => {
    if (reduced) {
      setState({ show: false, ready: true, base: 0 });
      return;
    }
    setState({ show: true, ready: false, base: 0.15 });
    const t = window.setTimeout(() => setState({ show: false, ready: true, base: 0.15 }), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <IntroContext.Provider value={{ ready: state.ready, base: state.base }}>
      <AnimatePresence>
        {state.show && (
          <motion.div
            key="preloader"
            // pointer-events-none: it's a solid full-screen backdrop with no
            // interactive content of its own, so this only matters during
            // its 0.5s exit fade — without it, the invisible-but-still-
            // mounted div swallows any tap/click made right after the site
            // finishes loading, before the fade visually completes.
            className="bg-background pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_REVEAL }}
          >
            <div className="text-center">
              <KineticText
                text="MAPPS CREATION"
                delay={0.15}
                charDelay={0.025}
                className="font-display text-foreground block text-[clamp(1.6rem,5vw,2.6rem)] tracking-[0.1em]"
              />

              <motion.div
                className="bg-primary mx-auto mt-5 h-px"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.5, ease: EASE_REVEAL, delay: 0.6 }}
              />

              <div className="mt-5">
                <KineticText
                  text="KNITTING DREAMS INTO REALITY"
                  delay={0.8}
                  charDelay={0.012}
                  className="label-caps text-muted-foreground block text-[10px] md:text-xs"
                />
              </div>
            </div>

            {/* Loading bar */}
            <motion.div
              className="bg-primary absolute bottom-0 left-0 h-[2px]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}
