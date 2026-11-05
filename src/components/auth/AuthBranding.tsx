import { Command } from "lucide-react";
import { cn } from "../../lib/utils";

export interface AuthBrandingProps {
  compact?: boolean;
}

export function AuthBranding({ compact = false }: AuthBrandingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 items-start",
        compact ? "gap-3" : "gap-5",
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground",
          compact ? "size-9" : "size-10",
        )}
      >
        <Command
          className={cn("size-5", compact ? "size-4" : "size-5")}
          aria-hidden="true"
        />
      </span>
      <div>
        <span
          className={cn(
            "block text-xl font-semibold tracking-tight text-foreground",
            compact ? "text-lg" : "text-xl",
          )}
        >
          Admin Starter
        </span>
        <p
          className={cn(
            "block text-sm text-muted-foreground leading-relaxed max-w-xs",
            compact ? "mt-1" : "mt-2",
          )}
        >
          Manage your workspace with clarity.
        </p>
        {!compact ? (
          <p className="mt-2 text-xs text-muted-foreground/70 max-w-xs">
            The dashboard starter for modern SaaS applications — analytics,
            users, products, orders, and settings. Connect your own API to go
            live.
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "flex w-full flex-col gap-2 text-muted-foreground/40 border-t border-border pt-4",
          compact ? "hidden lg:flex" : "lg:flex",
        )}
      >
        <div className="flex h-1 w-1/3 shrink-0 rounded-full bg-border" />
        <div className="flex h-1 w-1/4 shrink-0 rounded-full bg-border" />
        <div className="flex h-1 w-1/6 shrink-0 rounded-full bg-border" />
        <div className="flex h-1 w-full shrink-0 rounded-full bg-border" />
      </div>
    </div>
  );
}
