import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "../feedback/ErrorBoundary";

export interface AuthLayoutProps {
  children?: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <a
        href="#auth-content"
        className="skip-link"
      >
        Skip to content
      </a>
      <div id="auth-content">
        <ErrorBoundary>{children ?? <Outlet />}</ErrorBoundary>
      </div>
    </div>
  );
}
