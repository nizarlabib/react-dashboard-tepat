import { api, setAuthToken, setCsrfToken } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type {
  LoginResponse,
  MeResponse,
  CsrfTokenResponse,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth";
import { authMock } from "../mocks/auth.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return authMock.login(request);
    }

    const response = await api.post<LoginResponse>(endpoints.auth.login(), {
      body: request,
    });

    setAuthToken(response.access_token);
    return response;
  },

  register: async (): Promise<{ message: string }> => {
    if (USE_MOCK) {
      return authMock.register();
    }

    return api.post<{ message: string }>(endpoints.auth.register());
  },

  logout: async (): Promise<{ message: string }> => {
    if (USE_MOCK) {
      await authMock.logout();
      setAuthToken(null);
      setCsrfToken(null);
      return { message: "success logout" };
    }

    const response = await api.post<{ message: string }>(
      endpoints.auth.logout(),
    );
    setAuthToken(null);
    setCsrfToken(null);
    return response;
  },

  me: async (): Promise<MeResponse> => {
    if (USE_MOCK) {
      const user = await authMock.me();
      return {
        id: Number(String(user.id).replace("usr_", "")) || 0,
        fullname: user.name,
        email: user.email,
        role: user.role,
        role_id: "",
        permissions: "",
        permission_mask: "",
      };
    }

    const response = await api.get<{ me: MeResponse }>(endpoints.auth.me());
    return response.me;
  },

  forgotPassword: async (
    request: ForgotPasswordRequest,
  ): Promise<{ message: string }> => {
    if (USE_MOCK) {
      await authMock.forgotPassword(request);
      return { message: "email has been sent." };
    }

    return api.post<{ message: string }>(endpoints.auth.forgotPassword(), {
      body: request,
    });
  },

  resetPassword: async (
    request: ResetPasswordRequest,
  ): Promise<{ message: string }> => {
    if (USE_MOCK) {
      await authMock.resetPassword();
      return { message: "password berhasil di reset" };
    }

    return api.post<{ message: string }>(endpoints.auth.resetPassword(), {
      body: request,
    });
  },

  refreshToken: async (): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return authMock.refreshToken?.() ?? {
        access_token: "mock_refreshed_token",
        refresh_token: "mock_refreshed_refresh_token",
      };
    }

    return api.post<LoginResponse>(endpoints.auth.refreshToken());
  },

  csrfToken: async (): Promise<CsrfTokenResponse> => {
    if (USE_MOCK) {
      return { csrf_token: "mock_csrf_token" };
    }

    const response = await api.get<CsrfTokenResponse>(
      endpoints.auth.csrfToken?.() ?? "/auth/csrf_token",
      { skipAuth: true },
    );
    setCsrfToken(response.csrf_token);
    return response;
  },
};
