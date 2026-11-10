import {
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { NavGroup, SelectOption } from "../types";

export const navigationGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", to: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Users", to: "/users", icon: Users },
      { label: "Products", to: "/products", icon: Package },
      { label: "Orders", to: "/orders", icon: ShoppingBag, badge: "12" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Help & Support", to: "/settings?tab=general", icon: HelpCircle },
    ],
  },
];

export const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/analytics": "Analytics",
  "/users": "Users",
  "/products": "Products",
  "/orders": "Orders",
  "/settings": "Settings",
};

export const chartRangeOptions: SelectOption[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Last 12 months", value: "12m" },
];
