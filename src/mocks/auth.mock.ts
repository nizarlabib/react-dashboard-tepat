import { ApiError } from "../lib/api/errors";
import { mockResponse } from "../lib/api/mock";
import type { ErrorResponse } from "../types/api";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
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
    success: false,
    message,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      code: "VALIDATION_ERROR",
    },
  };
  throw new ApiError(error, status);
}

export const authMock = {
  login: async (request: LoginRequest): Promise<LoginResponse> => {
    if (
      !request.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)
    ) {
      validationError("Validation failed", {
        email: ["Enter a valid email address."],
      });
    }

    if (!request.password || request.password.length < 6) {
      validationError("Validation failed", {
        password: ["Password must be at least 6 characters."],
      });
    }

    return mockResponse({ user: DEMO_USER, token: DEMO_TOKEN }, 700);
  },

  register: async (
    request: RegisterRequest,
  ): Promise<{ user: User }> => {
    return mockResponse(
      {
        user: {
          id: `usr_${Date.now()}`,
          name: request.name,
          email: request.email,
          role: "Viewer",
          status: "invited",
          joinedAt: new Date().toISOString().slice(0, 10),
          lastActive: "Invitation sent",
        },
      },
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
};
