import { Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoadingState } from "../components/feedback/LoadingState";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AuthLayout } from "../components/auth/AuthLayout";
import { RequireAuth, GuestRoute, RootRedirect } from "./guards";
import {
  AnalyticsPage,
  DashboardPage,
  NotFoundPage,
  OrdersPage,
  ProductsPage,
  SettingsPage,
  UsersPage,
} from "./lazy-pages";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <GuestRoute><LoginPage /></GuestRoute> },
      {
        path: "register",
        element: <GuestRoute><RegisterPage /></GuestRoute>,
      },
      {
        path: "forgot-password",
        element: <GuestRoute><ForgotPasswordPage /></GuestRoute>,
      },
    ],
  },
  {
    element: <RequireAuth><DashboardLayout /></RequireAuth>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: withSuspense(<DashboardPage />) },
      { path: "analytics", element: withSuspense(<AnalyticsPage />) },
      { path: "users", element: withSuspense(<UsersPage />) },
      { path: "products", element: withSuspense(<ProductsPage />) },
      { path: "orders", element: withSuspense(<OrdersPage />) },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      { path: "*", element: withSuspense(<NotFoundPage />) },
    ],
  },
]);
