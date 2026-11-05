import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { LoginResponse } from "../types/auth";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "../types/auth";
import type { User } from "../types";
import { authMock } from "../mocks/auth.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const authService = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      return authMock.login(request);
    }
    return api.post<LoginResponse>(endpoints.auth.login(), {
      body: request,
    });
  },

  register: async (
    request: RegisterRequest,
  ): Promise<{ user: User }> => {
    if (USE_MOCK) {
      return authMock.register(request);
    }
    return api.post<{ user: User }>(endpoints.auth.register(), {
      body: request,
    });
  },

  logout: async (): Promise<null> => {
    if (USE_MOCK) {
      return authMock.logout();
    }
    return api.post<null>(endpoints.auth.logout());
  },

  me: async (): Promise<User> => {
    if (USE_MOCK) {
      return authMock.me();
    }
    return api.get<User>(endpoints.auth.me());
  },

  forgotPassword: async (
    request: ForgotPasswordRequest,
  ): Promise<null> => {
    if (USE_MOCK) {
      return authMock.forgotPassword(request);
    }
    return api.post<null>(endpoints.auth.forgotPassword(), {
      body: request,
    });
  },

  resetPassword: async (
    request: ResetPasswordRequest,
  ): Promise<null> => {
    if (USE_MOCK) {
      return authMock.resetPassword();
    }
    return api.post<null>(endpoints.auth.resetPassword(), {
      body: request,
    });
  },
};
