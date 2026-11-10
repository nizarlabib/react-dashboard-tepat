import { ApiError } from "../lib/api/errors";
import { mockResponse } from "../lib/api/mock";
import type { ErrorResponse } from "../types/api";
import type { GetOrdersParams } from "../types/order";
import type { Transaction } from "../types";
import { transactions } from "../mock/data";

const statuses: Transaction["status"][] = ["completed", "pending", "failed", "refunded"];

function notFound(message: string): never {
  const error: ErrorResponse = {
    message,
    code: 404,
    error_code: "ERR_RECORD_NOT_FOUND",
  };
  throw new ApiError(error, 404);
}

export const ordersMock = {
  getOrders: async (params?: GetOrdersParams): Promise<Transaction[]> => {
    let filtered = transactions;

    if (params?.search) {
      const query = params.search.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter(
          (order) =>
            order.id.toLowerCase().includes(query) ||
            order.customer.toLowerCase().includes(query) ||
            order.email.toLowerCase().includes(query) ||
            order.method.toLowerCase().includes(query),
        );
      }
    }

    if (
      params?.status &&
      statuses.includes(params.status as Transaction["status"])
    ) {
      filtered = filtered.filter((order) => order.status === params.status);
    }

    return mockResponse(filtered, 400);
  },

  getOrder: async (id: string): Promise<Transaction> => {
    const order = transactions.find((item) => item.id === id);

    if (!order) {
      notFound("Order not found");
    }

    return mockResponse(order, 300);
  },
};
