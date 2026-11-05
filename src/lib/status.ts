import type { BadgeVariant } from "../components/ui/Badge";
import type { ProductStatus, TransactionStatus, UserStatus } from "../types";

interface StatusMeta {
  label: string;
  variant: BadgeVariant;
}

export const transactionStatusMeta: Record<TransactionStatus, StatusMeta> = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "info" },
};

export const userStatusMeta: Record<UserStatus, StatusMeta> = {
  active: { label: "Active", variant: "success" },
  invited: { label: "Invited", variant: "warning" },
  inactive: { label: "Inactive", variant: "neutral" },
};

export const productStatusMeta: Record<ProductStatus, StatusMeta> = {
  in_stock: { label: "In stock", variant: "success" },
  low_stock: { label: "Low stock", variant: "warning" },
  out_of_stock: { label: "Out of stock", variant: "danger" },
};
