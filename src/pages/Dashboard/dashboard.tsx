import { format } from "date-fns";
import { enUS, es as esLocale, ptBR } from "date-fns/locale";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, ArrowRight, CalendarClock } from "lucide-react";
import { SalesChartsFilter } from "../../components/charts/sales-charts-filter";
import { SalesChartsFilterByBuilding } from "../../components/charts/sales-charts-filter-by-building";
import { useEffect, useMemo, useState } from "react";
import { SalesBuildingList, SalesList } from "../../model/sales-model";
import { fetchSalesByBuilding, fetchSalesByYear } from "../../services/sales";
import { useTranslation } from "react-i18next";
import type { Locale } from "date-fns";

const localeMap: Record<string, Locale> = {
  br: ptBR,
  "pt-br": ptBR,
  pt: ptBR,
  en: enUS,
  "en-us": enUS,
  es: esLocale,
  "es-es": esLocale,
};

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const resolvedLanguage = (i18n.resolvedLanguage || i18n.language || "br").toLowerCase();
  const baseLang = resolvedLanguage.split("-")[0];
  const currentLocale =
    localeMap[resolvedLanguage] ?? localeMap[baseLang] ?? ptBR;

  const shortDayFormat = t("dashboard.date.shortDayFormat");
  const dayMonthYearFormat = t("dashboard.date.dayMonthYearFormat");
  const dateSeparator = t("dashboard.date.separator");

  const [salesData, setSalesData] = useState<SalesList[]>([]);
  const [yearSales, setYearSales] = useState(new Date().getFullYear());
  const [salesDataByBuilding, setSalesDataByBuilding] = useState<SalesBuildingList[]>([]);
  const [buildingSelect, setBuildingSelect] = useState("Edifício A");

  useEffect(() => {
    const loadSalesData = async () => {
      const salesDataResponse = await fetchSalesByYear(yearSales);
      setSalesData(salesDataResponse);
    };
    loadSalesData();
  }, [yearSales]);

  useEffect(() => {
    const loadSalesBuildingData = async () => {
      const salesBuildingDataResponse = await fetchSalesByBuilding(buildingSelect);
      setSalesDataByBuilding(salesBuildingDataResponse);
    };
    loadSalesBuildingData();
  }, [buildingSelect]);

  const formattedCurrentDate = useMemo(() => {
    const currentDate = new Date();
    const shortDay = format(currentDate, shortDayFormat, { locale: currentLocale });
    const dayMonthYear = format(currentDate, dayMonthYearFormat, { locale: currentLocale });
    return `${shortDay} ${dateSeparator} ${dayMonthYear}`;
  }, [currentLocale, shortDayFormat, dayMonthYearFormat, dateSeparator]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            {t("dashboard.title")}
          </span>
          <span className="text-sm text-indigo-600 dark:text-indigo-300">
            {formattedCurrentDate}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="bg-blue-50 p-3 rounded-full mr-4 text-blue-400">
                <ArrowRight />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {t("dashboard.summary.completed.title")}
                  <span className="text-xs"> {t("dashboard.summary.weekLabel")}</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">73</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                    +24%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t("dashboard.summary.completed.footer", { value: 35 })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="bg-amber-50 p-3 rounded-full mr-4 text-amber-500">
                <ArrowLeft />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {t("dashboard.summary.pending.title")}
                  <span className="text-xs"> {t("dashboard.summary.weekLabel")}</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">35</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                    -12%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t("dashboard.summary.pending.footer", { value: 97 })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="bg-cyan-50 p-3 rounded-full mr-4 text-cyan-500">
                <CalendarClock />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {t("dashboard.summary.reserved.title")}
                  <span className="text-xs"> {t("dashboard.summary.weekLabel")}</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">237</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                    +31%
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {t("dashboard.summary.reserved.footer", { value: 187 })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-2">{t("dashboard.topSales.title")}</p>
              <div className="flex justify-between mb-2">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>25</span>
                  </div>
                  <p className="text-xs">{t("dashboard.topSales.buildings.A")}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>20</span>
                  </div>
                  <p className="text-xs">{t("dashboard.topSales.buildings.B")}</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>15</span>
                  </div>
                  <p className="text-xs">{t("dashboard.topSales.buildings.C")}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500">{t("dashboard.topSales.totalLabel")}</p>
                <p className="text-lg font-bold">{t("dashboard.topSales.totalValue")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <SalesChartsFilter
            salesData={salesData}
            yearSales={yearSales}
            onYearChange={setYearSales}
          />
          <SalesChartsFilterByBuilding
            salesDataByBuilding={salesDataByBuilding}
            buildingSelect={buildingSelect}
            onBuildingChange={setBuildingSelect}
          />
        </div>
      </div>
    </div>
  );
}
