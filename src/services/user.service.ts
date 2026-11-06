import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { PaginatedResponse } from "../types/api";
import type { GetUsersParams } from "../types/user";
import type { User } from "../types";
import { usersMock } from "../mocks/users.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

type GoUser = {
  id: number;
  fullname: string;
  email: string;
  role?: { name?: string } | string | null;
};

function mapGoUserToUi(item: GoUser): User {
  return {
    id: String(item.id),
    name: item.fullname,
    email: item.email,
    role: ((typeof item.role === "string" ? item.role : item.role?.name) ??
      "Viewer") as User["role"],
    status: "active",
    joinedAt: "",
    lastActive: "",
  };
}

export const userService = {
  getUsers: async (params?: GetUsersParams): Promise<User[]> => {
    if (USE_MOCK) {
      return usersMock.getUsers(params);
    }

    const response = await api.get<PaginatedResponse<{ users: GoUser[] }>>(
      endpoints.users.list(),
      {
        query: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          name: params?.search,
          email: params?.email,
          phone: params?.phone,
          status: params?.status,
          role_id: params?.role_id,
          order_by: params?.order_by,
        },
      },
    );

    const users = response.data?.users ?? [];
    return users.map(mapGoUserToUi);
  },

  getUser: async (id: string): Promise<User> => {
    if (USE_MOCK) {
      return usersMock.getUser(id);
    }

    throw new Error(
      "GET /users/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  createUser: async (): Promise<User> => {
    if (USE_MOCK) {
      throw new Error("Create not implemented in mock");
    }

    throw new Error(
      "POST /users is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  updateUser: async (): Promise<User> => {
    if (USE_MOCK) {
      throw new Error("Update not implemented in mock");
    }

    throw new Error(
      "PUT /users/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  deleteUser: async (): Promise<null> => {
    if (USE_MOCK) {
      throw new Error("Delete not implemented in mock");
    }

    throw new Error(
      "DELETE /users/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },
};
