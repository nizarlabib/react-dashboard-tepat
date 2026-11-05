import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { GetUsersParams } from "../types/user";
import type { User } from "../types";
import { usersMock } from "../mocks/users.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const userService = {
  getUsers: async (params?: GetUsersParams): Promise<User[]> => {
    if (USE_MOCK) {
      return usersMock.getUsers(params);
    }
    return api.get<User[]>(endpoints.users.list(), {
      query: params as Record<string, unknown>,
    });
  },

  getUser: async (id: string): Promise<User> => {
    if (USE_MOCK) {
      return usersMock.getUser(id);
    }
    return api.get<User>(endpoints.users.detail(id));
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK) {
      throw new Error("Create not implemented in mock");
    }
    return api.post<User>(endpoints.users.create(), {
      body: data,
    });
  },

  updateUser: async (
    id: string,
    data: Partial<User>,
  ): Promise<User> => {
    if (USE_MOCK) {
      throw new Error("Update not implemented in mock");
    }
    return api.put<User>(endpoints.users.update(id), {
      body: data,
    });
  },

  deleteUser: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      throw new Error("Delete not implemented in mock");
    }
    return api.delete<null>(endpoints.users.remove(id));
  },
};
