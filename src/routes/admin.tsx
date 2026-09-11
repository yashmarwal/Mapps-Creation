import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  ),
});
