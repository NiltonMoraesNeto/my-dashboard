import axios from "./api";

export interface MonthlySalesData {
  name: string;
  value: number;
}

export interface ComparisonData {
  name: string;
  occupied: number;
  booked: number;
  available: number;
}

export const dashboardService = {
  getSalesMonthly: async (year?: number): Promise<MonthlySalesData[]> => {
    const params = year ? { year } : {};
    const response = await axios.get("/dashboard/sales-monthly", { params });
    return response.data;
  },

  getSalesComparison: async (year?: number): Promise<ComparisonData[]> => {
    const params = year ? { year } : {};
    const response = await axios.get("/dashboard/sales-comparison", { params });
    return response.data;
  },

  seedData: async (year?: number): Promise<void> => {
    const params = year ? { year } : {};
    await axios.post("/dashboard/seed-data", {}, { params });
  },
};
