import { lazy } from "react";

export const DashboardPage = lazy(() =>
  import("../pages/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

export const AnalyticsPage = lazy(() =>
  import("../pages/analytics/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  })),
);

export const UsersPage = lazy(() =>
  import("../pages/users/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);

export const ProductsPage = lazy(() =>
  import("../pages/products/ProductsPage").then((module) => ({
    default: module.ProductsPage,
  })),
);

export const OrdersPage = lazy(() =>
  import("../pages/orders/OrdersPage").then((module) => ({
    default: module.OrdersPage,
  })),
);

export const SettingsPage = lazy(() =>
  import("../pages/settings/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);

export const NotFoundPage = lazy(() =>
  import("../pages/not-found/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
