"use client";

import { LiquidGooOrb, type CopilotState } from "./LiquidGooOrb";

export type { CopilotState };

/**
 * Re-exports LiquidGooOrb in NeuralOrb.tsx for backwards compatibility
 */
export function NeuralOrb(props: { state?: CopilotState; size?: number; className?: string }) {
  return <LiquidGooOrb {...props} />;
}
