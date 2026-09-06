"use client";

import { TeddyMascot, type MascotMood } from "./TeddyMascot";

export type { MascotMood };

/**
 * Legacy export wrapper — redirects YarnMascot to the new plush TeddyMascot component
 * for smooth backward compatibility across the application.
 */
export function YarnMascot(props: {
  mood?: MascotMood;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  return <TeddyMascot {...props} />;
}
