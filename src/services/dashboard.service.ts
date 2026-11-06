import type { ChartRange } from "../types";
import type { Activity, RevenuePoint, Stat, Transaction } from "../types";
import { dashboardMock } from "../mocks/dashboard.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const dashboardService = {
  getOverview: async (): Promise<Stat[]> => {
    if (USE_MOCK) {
      return dashboardMock.getOverview();
    }

    throw new Error(
      "GET /dashboard/overview is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getRevenue: async (range: ChartRange): Promise<RevenuePoint[]> => {
    if (USE_MOCK) {
      return dashboardMock.getRevenue(range);
    }

    throw new Error(
      "GET /dashboard/revenue is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getGrowth: async (
    range: ChartRange,
  ): Promise<{ label: string; users: number; active: number }[]> => {
    if (USE_MOCK) {
      return dashboardMock.getGrowth(range);
    }

    throw new Error(
      "GET /dashboard/growth is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getActivities: async (): Promise<Activity[]> => {
    if (USE_MOCK) {
      return dashboardMock.getActivities();
    }

    throw new Error(
      "GET /dashboard/activities is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getTransactions: async (): Promise<Transaction[]> => {
    if (USE_MOCK) {
      return dashboardMock.getTransactions();
    }

    throw new Error(
      "GET /dashboard/transactions is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },
};
