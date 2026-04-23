import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/app/providers/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

// Auth
import { AuthPage } from "@/pages/auth/AuthPage";

// Errors
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { ServerErrorPage } from "@/pages/errors/ServerErrorPage";
import { AccountSuspendedPage } from "@/pages/errors/AccountSuspendedPage";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
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
    ],
  },

  // Public routes
  { path: "/auth", element: <AuthPage /> },

  // Error routes
  { path: "/suspended", element: <AccountSuspendedPage /> },
  { path: "/500", element: <ServerErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
]);