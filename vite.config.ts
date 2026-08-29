// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only — see the nitro.preset note below), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Deploy target: Vercel. NOTE — inside this Claude Code / Lovable sandbox,
  // the shared config forces the Cloudflare preset regardless of this setting
  // (sandbox builds always target cloudflare-module), so a build run in this
  // environment will NOT reflect this. This preset only takes effect when
  // Vercel's own build infrastructure runs `npm run build` after the repo is
  // connected there — that's the expected, normal path to production.
  nitro: {
    preset: "vercel",
  },
});
