import { mockResponse } from "../lib/api/mock";
import type { ChartRange } from "../types";
import type { Activity, RevenuePoint, Stat, Transaction } from "../types";
import {
  growthByRange,
  overviewStats,
  recentActivities,
  revenueByRange,
  transactions,
} from "../mock/data";

export const dashboardMock = {
  getOverview: async (): Promise<Stat[]> => {
    return mockResponse(overviewStats, 400);
  },

  getRevenue: async (range: ChartRange): Promise<RevenuePoint[]> => {
    return mockResponse(revenueByRange[range], 400);
  },

  getGrowth: async (
    range: ChartRange,
  ): Promise<{ label: string; users: number; active: number }[]> => {
    return mockResponse(growthByRange[range], 400);
  },

  getActivities: async (): Promise<Activity[]> => {
    return mockResponse(recentActivities, 400);
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return mockResponse(transactions, 400);
  },
};
