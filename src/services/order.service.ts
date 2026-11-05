import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { GetOrdersParams } from "../types/order";
import type { Transaction } from "../types";
import { ordersMock } from "../mocks/orders.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const orderService = {
  getOrders: async (params?: GetOrdersParams): Promise<Transaction[]> => {
    if (USE_MOCK) {
      return ordersMock.getOrders(params);
    }
    return api.get<Transaction[]>(endpoints.orders.list(), {
      query: params as Record<string, unknown>,
    });
  },

  getOrder: async (id: string): Promise<Transaction> => {
    if (USE_MOCK) {
      return ordersMock.getOrder(id);
    }
    return api.get<Transaction>(endpoints.orders.detail(id));
  },
};
