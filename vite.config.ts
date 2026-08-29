import { defineConfig, loadEnv, type UserConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Plain Vite + TanStack Start config — no external build-tooling wrapper.
// Deploy target: Vercel, via nitro's "vercel" preset (produces the Build
// Output API v3 structure Vercel picks up automatically — no vercel.json
// needed for routing).
export default defineConfig(({ mode, command }) => {
  // Expose VITE_-prefixed env vars to import.meta.env in both the client
  // bundle and nitro's server bundle (Vite does this natively for the client
  // already; this `define` makes the same true for code nitro bundles for
  // the server, e.g. anything read inside a route's `head()`).
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  // Only relevant for the rarely-used `build:dev` script.
  const isDevBuild = command === "build" && mode === "development";
  const devBuildOverrides: UserConfig = isDevBuild
    ? {
        environments: {
          client: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
        },
      }
    : {};

  return {
    define: envDefine,
    ...devBuildOverrides,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      // Prevents duplicate React/TanStack Query instances across the
      // dependency tree (would otherwise break hooks in subtle ways).
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
      // Debounce rapid successive file-system events into one reload.
      watch: { awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 } },
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Redirect TanStack Start's bundled server entry to src/server.ts
        // (our SSR error wrapper) — nitro/vite builds from this.
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      // nitro only matters for `vite build` — no-op during `vite dev`.
      ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
      viteReact(),
    ],
  };
});
