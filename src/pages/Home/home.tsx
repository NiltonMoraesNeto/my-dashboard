import { useEffect, useState } from "react";
import { SalesCharts } from "../../components/charts/sales-charts";
import { SalesComparisonCharts } from "../../components/charts/sales-comparison-charts";
import {
  dashboardService,
  MonthlySalesData,
  ComparisonData,
} from "../../services/dashboard";

export function HomePage() {
  const [salesData, setSalesData] = useState<MonthlySalesData[]>([]);
  const [comparisonsData, setComparisonsData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados das APIs
        const [salesResponse, comparisonResponse] = await Promise.all([
          dashboardService.getSalesMonthly(),
          dashboardService.getSalesComparison(),
        ]);

        setSalesData(salesResponse);
        setComparisonsData(comparisonResponse);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
        <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              Carregando dados do dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Bem Vindo - Home
          </h1>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6">
          <SalesCharts salesData={salesData} />
          <SalesComparisonCharts comparisonsData={comparisonsData} />
        </div>
      </div>
    </div>
  );
}
