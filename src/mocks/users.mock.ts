import { ApiError } from "../lib/api/errors";
import { mockResponse } from "../lib/api/mock";
import type { ErrorResponse } from "../types/api";
import type { GetUsersParams } from "../types/user";
import type { User } from "../types";
import { users } from "../mock/data";

const statuses: User["status"][] = ["active", "invited", "inactive"];

function notFound(message: string): never {
  const error: ErrorResponse = {
    success: false,
    message,
    meta: { timestamp: new Date().toISOString(), code: "NOT_FOUND" },
  };
  throw new ApiError(error, 404);
}

export const usersMock = {
  getUsers: async (params?: GetUsersParams): Promise<User[]> => {
    let filtered = users;

    if (params?.search) {
      const query = params.search.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query),
        );
      }
    }

    if (
      params?.status &&
      statuses.includes(params.status as User["status"])
    ) {
      filtered = filtered.filter((user) => user.status === params.status);
    }

    if (params?.role) {
      filtered = filtered.filter((user) => user.role === params.role);
    }

    return mockResponse(filtered, 400);
  },

  getUser: async (id: string): Promise<User> => {
    const user = users.find((item) => item.id === id);

    if (!user) {
      notFound("User not found");
    }

    return mockResponse(user, 300);
  },
};
