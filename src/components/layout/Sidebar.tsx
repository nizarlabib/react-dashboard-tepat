import { useEffect } from "react";
import { ChevronRight, Command, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { navigationGroups } from "../../constants/navigation";
import { currentUser } from "../../mock/data";
import { cn } from "../../lib/utils";
import { Avatar } from "../ui/Avatar";

export interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
}

export function Sidebar({
  mobileOpen,
  onClose,
  collapsed = false,
}: SidebarProps) {
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:translate-x-0",
          collapsed ? "w-[64px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Command className="size-4" aria-hidden="true" />
            </span>
            <span
              className={cn(
                "leading-tight",
                collapsed ? "hidden" : "visible",
              )}
            >
              <span className="block text-sm font-semibold tracking-tight text-foreground">
                Acme
              </span>
              <span className="block text-xs text-muted-foreground">
                Dashboard Starter
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-5">
          <nav aria-label="Primary" className="space-y-6">
            {navigationGroups.map((group, index) => (
              <div key={group.title}>
                {index > 0 ? (
                  <div
                    role="separator"
                    className="my-3 border-t border-border mx-2"
                    aria-orientation="horizontal"
                  />
                ) : null}
                {!collapsed ? (
                  <p className="mb-1.5 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    {group.title}
                  </p>
                ) : null}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              "flex rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                              collapsed ? "items-center justify-center" : "items-center gap-2.5",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-subtle hover:text-foreground",
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={cn(
                                  "size-4 shrink-0",
                                  isActive
                                    ? "text-primary"
                                    : "text-muted-foreground",
                                )}
                                aria-hidden="true"
                              />
                              {!collapsed ? (
                                <>
                                  <span className="min-w-0 flex-1 truncate">
                                    {item.label}
                                  </span>
                                  {item.badge ? (
                                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                      {item.badge}
                                    </span>
                                  ) : null}
                                </>
                              ) : null}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-border p-3">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-subtle"
          >
            <Avatar name={currentUser.name} size="md" />
            <div
              className={cn(
                "min-w-0 flex-1",
                collapsed ? "hidden" : "visible",
              )}
            >
              <p className="truncate text-xs font-medium text-foreground">
                {currentUser.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.plan}
              </p>
            </div>
            <ChevronRight
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        </div>
      </aside>
    </>
  );
}
