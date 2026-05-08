import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/app/providers/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthPage } from "@/pages/auth/AuthPage";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { ServerErrorPage } from "@/pages/errors/ServerErrorPage";
import { AccountSuspendedPage } from "@/pages/errors/AccountSuspendedPage";
import { ComingSoonPage } from "@/pages/errors/ComingSoonPage";
import { TransferPage } from "@/pages/transfer/TransferPage";
import { TransferSuccessPage } from "@/pages/transfer/TransferSuccessPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { EditProfilePage } from "@/pages/profile/EditProfilePage";
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
          { path: "transfer", element: <TransferPage /> },
          { path: "transfer/success", element: <TransferSuccessPage /> },
          { path: "history", element: <HistoryPage /> },
        //   { path: "notifications", element: <NotificationsPage /> },

          {
            path: "profile",
            children: [
              { index: true, element: <ProfilePage /> },
              { path: "edit", element: <EditProfilePage /> },
            //   { path: "settings", element: <SettingsPage /> },
            //   { path: "security", element: <SecurityPage /> },
            ],
          },
        ],
      },
    ],
  },

  // Public routes
  { path: "/auth", element: <AuthPage /> },

  // Error routes
  { path: "/suspended", element: <AccountSuspendedPage /> },
  { path: "/500", element: <ServerErrorPage /> },
  { path: "/coming-soon", element: <ComingSoonPage /> },
  { path: "*", element: <NotFoundPage /> },
]);