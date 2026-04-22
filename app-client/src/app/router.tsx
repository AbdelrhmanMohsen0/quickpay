import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/app/providers/ProtectedRoute";

// Auth
import { AuthPage } from "@/pages/auth/AuthPage";

// Errors
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { ServerErrorPage } from "@/pages/errors/ServerErrorPage";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <App /> },
    //   { path: "transfer", element: <TransferPage /> },
    //   { path: "history", element: <HistoryPage /> },
    //   { path: "notifications", element: <NotificationsPage /> },

    //   {
    //     path: "profile",
    //     children: [
    //       { index: true, element: <ProfilePage /> },
    //       { path: "settings", element: <SettingsPage /> },
    //       { path: "security", element: <SecurityPage /> },
    //     ],
    //   },
    ],
  },

  // Public routes
  { path: "/auth", element: <AuthPage /> },

  // Error routes
  { path: "/500", element: <ServerErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
]);