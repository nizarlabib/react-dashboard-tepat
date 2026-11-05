import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ApiError } from "../lib/api/errors";
import { authService } from "../services/auth.service";
import {
  AuthContext,
  type Session,
  type User,
  AUTH_STORAGE_KEY,
} from "./auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

        if (raw) {
          const session = JSON.parse(raw) as Session | null;

          if (session?.user && session?.token && mounted) {
            setUser(session.user);
            setToken(session.token);
          }
        }
      } catch {
        // Ignore malformed stored session.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (!password || password.length < 6) {
        return {
          ok: false,
          error: "Password must be at least 6 characters.",
        };
      }

      try {
        // Frontend-only mock authentication. This is a demonstration, not real
        // security. The same service interface is used when a real backend is
        // connected (see src/services/auth.service.ts).
        const response = await authService.login({ email, password });
        const { user: loggedInUser, token } = response;

        setUser(loggedInUser);
        setToken(token);

        try {
          window.localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: loggedInUser, token }),
          );
        } catch {
          // localStorage unavailable in some environments; auth still works
          // in memory for the current session.
        }

        return { ok: true };
      } catch (error) {
        let message = "Login failed. Please try again.";

        if (error instanceof ApiError) {
          const firstError = Object.values(
            error.response.errors ?? {},
          ).flat()[0];
          message = firstError ?? error.response.message;
        }

        return { ok: false, error: message };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);

    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore localStorage errors during logout.
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
