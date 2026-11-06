export const appConfig = {
  name: "React Dashboard Starter",
  description: "A reusable React dashboard foundation for admin dashboards and SaaS applications.",
  shortName: "Dashboard",
  version: "0.0.0",
} as const;

export type AppName = typeof appConfig.name;
