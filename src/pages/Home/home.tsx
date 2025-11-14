import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SalesCharts } from "../../components/charts/sales-charts";
import { SalesComparisonCharts } from "../../components/charts/sales-comparison-charts";
import {
  type ComparisonData,
  dashboardService,
  type MonthlySalesData,
} from "../../services/dashboard";
import { translateMonthLabel } from "../../utils/translate-month";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HomePage() {
  const { t } = useTranslation();
  const [salesData, setSalesData] = useState<MonthlySalesData[]>([]);
  const [comparisonsData, setComparisonsData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearSales, setYearSales] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados das APIs
        const [salesResponse, comparisonResponse] = await Promise.all([
          dashboardService.getSalesMonthly(yearSales),
          dashboardService.getSalesComparison(yearSales),
        ]);

        setSalesData(salesResponse);
        setComparisonsData(comparisonResponse);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("home.error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [yearSales]);

  const translatedSalesData = useMemo(
    () =>
      salesData.map((item) => ({
        ...item,
        name: translateMonthLabel(item.name, t),
      })),
    [salesData, t]
  );

  const translatedComparisonsData = useMemo(
    () =>
      comparisonsData.map((item) => ({
        ...item,
        name: translateMonthLabel(item.name, t),
      })),
    [comparisonsData, t]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
        <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              {t("home.loading")}
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
            {t("home.title")}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                {yearSales} <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setYearSales(2025)}>
                2025
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setYearSales(2024)}>
                2024
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {t(error)}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6">
          <SalesCharts salesData={translatedSalesData} />
          <SalesComparisonCharts comparisonsData={translatedComparisonsData} />
        </div>
      </div>
    </div>
  );
}
