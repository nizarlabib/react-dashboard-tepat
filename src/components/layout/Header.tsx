import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { navigationGroups } from "../../constants/navigation";
import {
  currentUser,
  notifications as initialNotifications,
} from "../../mock/data";
import { cn } from "../../lib/utils";
import { useToast } from "../../contexts/toast";
import { Avatar } from "../ui/Avatar";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "../ui/Dropdown";
import { Input } from "../ui/Input";
import { Breadcrumb } from "./Breadcrumb";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const pages = useMemo(
    () => navigationGroups.flatMap((group) => group.items),
    [],
  );

  const debouncedQuery = useDebounce(query, 300);

  const results = useMemo(() => {
    const search = debouncedQuery.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return pages.filter(
      (page) =>
        page.label.toLowerCase().includes(search) ||
        page.to.toLowerCase().includes(search),
    );
  }, [pages, debouncedQuery]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const goToPage = (to: string) => {
    navigate(to);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative hidden w-64 md:block">
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results[0]) {
            goToPage(results[0].to);
          }

          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder="Search pages..."
        leadingIcon={Search}
        aria-label="Search pages"
      />
      {open && query.trim() ? (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-xl border border-border bg-surface p-1 shadow-lg">
          {results.length > 0 ? (
            results.map((page) => {
              const Icon = page.icon;

              return (
                <button
                  key={page.to}
                  type="button"
                  onClick={() => goToPage(page.to)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-subtle"
                >
                  <Icon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {page.label}
                </button>
              );
            })
          ) : (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              No pages match “{debouncedQuery}”.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export interface HeaderProps {
  onMenuClick: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function Header({
  onMenuClick,
  collapsed = false,
  onCollapseToggle,
}: HeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );
    toast({
      title: "All caught up",
      description: "Every notification has been marked as read.",
      variant: "success",
    });
  };

  const markRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  };

  const signOut = () => {
    toast({
      title: "Signed out",
      description: "Authentication is not connected in this starter template.",
      variant: "info",
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </button>

        {onCollapseToggle ? (
          <button
            type="button"
            onClick={onCollapseToggle}
            className="hidden lg:flex items-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4" aria-hidden="true" />
            )}
          </button>
        ) : null}

        <div className="hidden sm:block">
          <Breadcrumb />
        </div>

        <div className="flex-1" />

        <GlobalSearch />

        <Dropdown
          ariaLabel={`Notifications (${unreadCount} unread)`}
          triggerClassName="p-2 text-muted-foreground hover:bg-subtle hover:text-foreground"
          panelClassName="w-80 p-0"
          trigger={
            <span className="relative flex">
              <Bell className="size-4" aria-hidden="true" />
              {unreadCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-danger ring-2 ring-surface" />
              ) : null}
            </span>
          }
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread
              </p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-1">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markRead(notification.id)}
                className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-subtle"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    notification.read ? "bg-border" : "bg-primary",
                  )}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-xs text-foreground",
                      notification.read ? "font-medium" : "font-semibold",
                    )}
                  >
                    {notification.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {notification.description}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground/80">
                    {notification.time}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-border p-1">
            <DropdownItem
              onSelect={() => navigate("/dashboard")}
              className="justify-center text-xs"
            >
              <span className="font-medium text-primary">
                Back to dashboard
              </span>
            </DropdownItem>
          </div>
        </Dropdown>

        <div className="hidden h-6 w-px bg-border sm:block" />

        <Dropdown
          ariaLabel="Open account menu"
          triggerClassName="rounded-lg p-1 pr-2 hover:bg-subtle"
          trigger={
            <span className="flex items-center gap-2">
              <Avatar name={currentUser.name} size="sm" />
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-xs font-medium text-foreground">
                  {currentUser.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {currentUser.role}
                </span>
              </span>
              <ChevronDown
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
          }
        >
          <DropdownLabel>{currentUser.email}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem
            icon={User}
            onSelect={() => navigate("/settings?tab=account")}
          >
            Account settings
          </DropdownItem>
          <DropdownItem
            icon={Settings}
            onSelect={() => navigate("/settings?tab=notifications")}
          >
            Notification preferences
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={LogOut} variant="danger" onSelect={signOut}>
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
