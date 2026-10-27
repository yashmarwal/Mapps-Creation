import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Restores the previous scroll offset on back/forward and scrolls to
    // top on a fresh Link navigation — native TanStack behavior. __root.tsx
    // resyncs Lenis (our smooth-scroll lib) to whatever position this
    // leaves `window.scrollY` at, rather than re-deciding the position
    // itself.
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
