export const endpoints = {
  auth: {
    login: () => "/auth/login",
    register: () => "/auth/register",
    logout: () => "/auth/logout",
    me: () => "/auth/me",
    forgotPassword: () => "/auth/forgot-password",
    resetPassword: () => "/auth/reset-password",
  },
  dashboard: {
    overview: () => "/dashboard/overview",
    revenue: () => "/dashboard/revenue",
    activities: () => "/dashboard/activities",
    transactions: () => "/dashboard/transactions",
  },
  users: {
    list: () => "/users",
    detail: (id: string | number) => `/users/${id}`,
    create: () => "/users",
    update: (id: string | number) => `/users/${id}`,
    remove: (id: string | number) => `/users/${id}`,
  },
  products: {
    list: () => "/products",
    detail: (id: string | number) => `/products/${id}`,
    create: () => "/products",
    update: (id: string | number) => `/products/${id}`,
    remove: (id: string | number) => `/products/${id}`,
  },
  orders: {
    list: () => "/orders",
    detail: (id: string | number) => `/orders/${id}`,
  },
  settings: {
    get: () => "/settings",
    update: () => "/settings",
  },
} as const;
