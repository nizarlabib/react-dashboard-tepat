import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { routeLabels } from "../../constants/navigation";

export function Breadcrumb() {
  const { pathname } = useLocation();
  const currentLabel = routeLabels[pathname] ?? "Page";
  const isDashboard = pathname === "/dashboard";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Home"
          >
            <Home className="size-3.5" aria-hidden="true" />
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-3.5 text-muted-foreground/60" />
        </li>
        <li>
          <span
            className="font-medium text-foreground"
            aria-current={isDashboard ? "page" : undefined}
          >
            {isDashboard ? "Overview" : currentLabel}
          </span>
        </li>
      </ol>
    </nav>
  );
}
