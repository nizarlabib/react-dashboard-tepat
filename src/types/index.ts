import type { LucideIcon } from "lucide-react";

export type TrendDirection = "up" | "down";

export interface Stat {
  label: string;
  value: string;
  change: number;
  period: string;
  trend: TrendDirection;
  icon: LucideIcon;
}

export type ChartRange = "7d" | "30d" | "90d" | "12m";

export interface RevenuePoint {
  label: string;
  revenue: number;
  expenses: number;
}

export interface GrowthPoint {
  label: string;
  users: number;
  active: number;
}

export type ActivityStatus = "success" | "warning" | "info";

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  status: ActivityStatus;
}

export type TransactionStatus = "completed" | "pending" | "failed" | "refunded";

export interface Transaction {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  method: string;
}

export type UserStatus = "active" | "invited" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Developer" | "Viewer";
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
}

export type ProductStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  share: number;
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SelectOption {
  label: string;
  value: string;
}
