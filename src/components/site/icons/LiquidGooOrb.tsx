"use client";

import { BrandGlowOrb, type CopilotState } from "./BrandGlowOrb";

export type { CopilotState };

/**
 * Re-exports BrandGlowOrb for seamless backwards compatibility
 */
export function LiquidGooOrb(props: { state?: CopilotState; size?: number; className?: string }) {
  return <BrandGlowOrb {...props} />;
}
