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
    async (username: string, password: string) => {
      if (!username || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (!password || password.length < 6) {
        return {
          ok: false,
          error: "Password must be at least 6 characters.",
        };
      }

      try {
        const response = await authService.login({ username, password });

        setToken(response.access_token);

        try {
          const me = await authService.me();

          const uiUser: User = {
            id: String(me.id),
            name: me.fullname,
            email: me.email,
            role: me.role,
          };

          setUser(uiUser);

          try {
            window.localStorage.setItem(
              AUTH_STORAGE_KEY,
              JSON.stringify({ user: uiUser, token: response.access_token }),
            );
          } catch {
            // localStorage unavailable in some environments; auth still works
            // in memory for the current session.
          }

          return { ok: true };
        } catch (meError) {
          setToken(null);
          let message = "Login succeeded but failed to load user profile.";

          if (meError instanceof ApiError) {
            message = meError.response.message;
          }

          return { ok: false, error: message };
        }
      } catch (error) {
        let message = "Login failed. Please try again.";

        if (error instanceof ApiError) {
          message =
            error.firstFieldError ??
            error.response.message ??
            message;
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
