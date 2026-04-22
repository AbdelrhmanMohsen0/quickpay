import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { ThemeProvider } from "@/app/providers/theme-provider.tsx";
import { AuthProvider } from "./app/providers/AuthProvider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
