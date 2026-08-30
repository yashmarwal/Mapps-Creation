"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EASE_REVEAL, EASE_UI } from "./motion";
import { LogoMark } from "./LogoMark";

const IntroContext = createContext({ ready: false, base: 0 });

/** Hero and above-the-fold animations time themselves off this. */
export function useIntro() {
  return useContext(IntroContext);
}

const HOLD_MS = 1000;

export function IntroProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  // IMPORTANT: show starts as TRUE so there is NO initial blank frame or hero flash
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShow(false);
      setReady(true);
      return;
    }

    // Step 1: At HOLD_MS (1000ms), preloader split curtain exit begins (show: false)
    const exitTimer = window.setTimeout(() => {
      setShow(false);
    }, HOLD_MS);

    // Step 2: 120ms into split exit, trigger hero text reveal (ready: true)
    const readyTimer = window.setTimeout(() => {
      setReady(true);
    }, HOLD_MS + 120);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(readyTimer);
    };
  }, [reduced]);

  return (
    <IntroContext.Provider value={{ ready, base: 0.1 }}>
      <AnimatePresence>
        {show && (
          <motion.div
            key="preloader-wrapper"
            className="fixed inset-0 z-[200] overflow-hidden pointer-events-none select-none"
          >
            {/* Top Half Shutter Panel — Splits UPWARDS */}
            <motion.div
              key="top-shutter"
              className="absolute top-0 inset-x-0 h-1/2 bg-[#0F2038] z-[200] border-b border-[var(--gold)]/20"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: EASE_REVEAL }}
            >
              <div className="absolute inset-0 silk opacity-40" />
              <div className="grain absolute inset-0 opacity-30" />
            </motion.div>

            {/* Bottom Half Shutter Panel — Splits DOWNWARDS */}
            <motion.div
              key="bottom-shutter"
              className="absolute bottom-0 inset-x-0 h-1/2 bg-[#0F2038] z-[200] border-t border-[var(--gold)]/20"
              initial={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.7, ease: EASE_REVEAL }}
            >
              <div className="absolute inset-0 silk opacity-40" />
              <div className="grain absolute inset-0 opacity-30" />
            </motion.div>

            {/* Pure Minimalist Centralized Brand Emblem */}
            <motion.div
              className="relative z-[205] flex h-full items-center justify-center"
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: EASE_UI }}
            >
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
                {/* Rotating Dashed Halo */}
                <motion.div
                  className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-dashed border-[var(--gold)]/35"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                />
                {/* Breathing Ambient Ring */}
                <motion.div
                  className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-[var(--gold)]/15"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                />
                {/* Central Gold Monogram Glass Badge */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE_REVEAL }}
                  className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#0F2038]/85 backdrop-blur-md border border-[var(--gold)]/40 shadow-[0_0_30px_rgba(201,166,107,0.25)]"
                >
                  <LogoMark size={48} className="sm:h-14" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </IntroContext.Provider>
  );
}
