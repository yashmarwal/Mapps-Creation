"use client";

import { LiquidGooOrb, type CopilotState } from "./LiquidGooOrb";

export type { CopilotState };

/**
 * Re-exports LiquidGooOrb for clean backwards compatibility
 */
export function SilkOrb(props: { state?: CopilotState; size?: number; className?: string }) {
  return <LiquidGooOrb {...props} />;
}
