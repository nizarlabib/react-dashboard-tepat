import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { ChartRange } from "../types";
import type { Activity, RevenuePoint, Stat, Transaction } from "../types";
import { dashboardMock } from "../mocks/dashboard.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const dashboardService = {
  getOverview: async (): Promise<Stat[]> => {
    if (USE_MOCK) {
      return dashboardMock.getOverview();
    }
    return api.get<Stat[]>(endpoints.dashboard.overview());
  },

  getRevenue: async (range: ChartRange): Promise<RevenuePoint[]> => {
    if (USE_MOCK) {
      return dashboardMock.getRevenue(range);
    }
    return api.get<RevenuePoint[]>(endpoints.dashboard.revenue(), {
      query: { range },
    });
  },

  getGrowth: async (
    range: ChartRange,
  ): Promise<{ label: string; users: number; active: number }[]> => {
    if (USE_MOCK) {
      return dashboardMock.getGrowth(range);
    }
    return api.get<{ label: string; users: number; active: number }[]>(
      endpoints.dashboard.revenue(),
      { query: { range } },
    );
  },

  getActivities: async (): Promise<Activity[]> => {
    if (USE_MOCK) {
      return dashboardMock.getActivities();
    }
    return api.get<Activity[]>(endpoints.dashboard.activities());
  },

  getTransactions: async (): Promise<Transaction[]> => {
    if (USE_MOCK) {
      return dashboardMock.getTransactions();
    }
    return api.get<Transaction[]>(endpoints.dashboard.transactions());
  },
};
