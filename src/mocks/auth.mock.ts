import { ApiError } from "../lib/api/errors";
import { mockResponse } from "../lib/api/mock";
import type { ErrorResponse } from "../types/api";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
} from "../types/auth";
import type { User } from "../types";

const DEMO_USER: User = {
  id: "usr_01",
  name: "Alex Morgan",
  email: "admin@demo.com",
  role: "Admin",
  status: "active",
  joinedAt: new Date().toISOString().slice(0, 10),
  lastActive: "Just now",
};

const DEMO_TOKEN = "mock_session_demo";

function validationError(
  message: string,
  errors: Record<string, string[]>,
  status = 400,
): never {
  const error: ErrorResponse = {
    message,
    code: status,
    error_code: "ERR_VALIDATION_ERROR",
    data: { error: errors },
  };
  throw new ApiError(error, status);
}

export const authMock = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    if (
      !request.username ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.username)
    ) {
      validationError("Validation failed", {
        username: ["Enter a valid email address."],
      });
    }

    if (!request.password || request.password.length < 6) {
      validationError("Validation failed", {
        password: ["Password must be at least 6 characters."],
      });
    }

    return mockResponse(
      {
        access_token: DEMO_TOKEN,
        refresh_token: `${DEMO_TOKEN}_refresh`,
      },
      700,
    );
  },

  register: async (): Promise<{ message: string }> => {
    return mockResponse(
      { message: "user successfuly registered" },
      800,
    );
  },

  logout: async (): Promise<null> => {
    return mockResponse(null, 300);
  },

  me: async (): Promise<User> => {
    return mockResponse(DEMO_USER, 300);
  },

  forgotPassword: async (
    request: ForgotPasswordRequest,
  ): Promise<null> => {
    if (
      !request.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)
    ) {
      validationError("Validation failed", {
        email: ["Enter a valid email address."],
      });
    }

    return mockResponse(null, 700);
  },

  resetPassword: async (): Promise<null> => {
    return mockResponse(null, 700);
  },

  refreshToken: async (): Promise<{
    access_token: string;
    refresh_token: string;
  }> => {
    return mockResponse(
      {
        access_token: "mock_refreshed_access_token",
        refresh_token: "mock_refreshed_refresh_token",
      },
      700,
    );
  },

  csrfToken: async (): Promise<{ csrf_token: string }> => {
    return mockResponse({ csrf_token: "mock_csrf_token" }, 300);
  },
};
