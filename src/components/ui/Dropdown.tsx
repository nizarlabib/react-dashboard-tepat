import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

interface PanelPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  maxWidth?: number;
}

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  triggerClassName?: string;
  panelClassName?: string;
  ariaLabel?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "end",
  triggerClassName,
  panelClassName,
  ariaLabel,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  const toggle = () => {
    if (open) {
      close();
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const openUp =
      window.innerHeight - rect.bottom < 280 && rect.top > 280;
    const endOffset = Math.max(16, window.innerWidth - rect.right);
    const startOffset = Math.max(16, rect.left);

    setPosition({
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 8 }
        : { top: rect.bottom + 8 }),
      ...(align === "end"
        ? { right: endOffset }
        : { left: startOffset }),
      maxWidth:
        window.innerWidth -
        (align === "end" ? endOffset : startOffset) -
        16,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !containerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as Node | null;

      if (target && panelRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleResize = () => setOpen(false);

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          triggerClassName,
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {trigger}
      </button>
      {open && position
        ? createPortal(
            <DropdownContext.Provider value={{ close }}>
              <div
                ref={panelRef}
                role="menu"
                style={position}
                className={cn(
                  "fixed z-50 min-w-56 rounded-xl border border-border bg-surface p-1 shadow-lg",
                  panelClassName,
                )}
              >
                {children}
              </div>
            </DropdownContext.Provider>,
            document.body,
          )
        : null}
    </div>
  );
}

export interface DropdownItemProps {
  children: ReactNode;
  icon?: LucideIcon;
  onSelect?: () => void;
  variant?: "default" | "danger";
  className?: string;
  disabled?: boolean;
}

export function DropdownItem({
  children,
  icon: Icon,
  onSelect,
  variant = "default",
  className,
  disabled = false,
}: DropdownItemProps) {
  const context = useContext(DropdownContext);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => {
        onSelect?.();
        context?.close();
      }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-foreground hover:bg-subtle",
        className,
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "size-4 shrink-0",
            variant === "danger" ? "text-danger" : "text-muted-foreground",
          )}
          aria-hidden="true"
        />
      ) : null}
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 py-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-border" role="separator" />;
}
