import type { GetOrdersParams } from "../types/order";
import type { Transaction } from "../types";
import { ordersMock } from "../mocks/orders.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const orderService = {
  getOrders: async (params?: GetOrdersParams): Promise<Transaction[]> => {
    if (USE_MOCK) {
      return ordersMock.getOrders(params);
    }

    throw new Error(
      "GET /orders is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getOrder: async (id: string): Promise<Transaction> => {
    if (USE_MOCK) {
      return ordersMock.getOrder(id);
    }

    throw new Error(
      "GET /orders/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },
};
