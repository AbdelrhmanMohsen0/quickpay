import { createBrowserRouter, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/app/providers/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { UserManagementPage } from "@/pages/admin/UserManagementPage";
import { TransactionsPage } from "@/pages/admin/TransactionsPage";
import { SystemConfigurationPage } from "@/pages/admin/SystemConfigurationPage";
import { AuthPage } from "@/pages/auth/AuthPage";
import { NotFoundPage } from "@/pages/errors/NotFoundPage";
import { ServerErrorPage } from "@/pages/errors/ServerErrorPage";
import { AccountSuspendedPage } from "@/pages/errors/AccountSuspendedPage";
// import { TransferPage } from "@/pages/transfer/TransferPage";
// import { TransferSuccessPage } from "@/pages/transfer/TransferSuccessPage";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/admin/",
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "users", element: <UserManagementPage /> },
          { path: "transactions", element: <TransactionsPage /> },
          { path: "settings", element: <SystemConfigurationPage /> },
          // { path: "transfer", element: <TransferPage /> },
          // { path: "transfer/success", element: <TransferSuccessPage /> },
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
  { path: "/admin/auth", element: <AuthPage /> },

  // Error routes
  { path: "/admin/suspended", element: <AccountSuspendedPage /> },
  { path: "/admin/500", element: <ServerErrorPage /> },
  { path: "*", element: <NotFoundPage /> },
]);