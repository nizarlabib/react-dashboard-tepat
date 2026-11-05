import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  badge?: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sections"
      className={cn(
        "no-scrollbar flex gap-1 overflow-x-auto border-b border-border",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        const Icon = item.icon;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
            {item.label}
            {item.badge ? (
              <span className="rounded-full bg-subtle px-1.5 py-0.5 text-xs text-muted-foreground">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
