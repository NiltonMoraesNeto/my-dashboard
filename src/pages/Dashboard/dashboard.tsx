import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, ArrowRight, CalendarClock } from "lucide-react";
import { SalesChartsFilter } from "../../components/charts/sales-charts-filter";
import { SalesChartsFilterByBuilding } from "../../components/charts/sales-charts-filter-by-building";

export function Dashboard() {
  function getShortDayOfWeek(date: Date) {
    return format(date, "eee", { locale: ptBR });
  }

  // Função para obter o dia do mês e o mês em formato curto
  function getDayMonthYear(date: Date) {
    return format(date, "dd 'de' MMM, yyyy", { locale: ptBR });
  }

  function formatCurrentDate() {
    const currentDate = new Date();
    const formattedDate = `${getShortDayOfWeek(
      currentDate
    )} // ${getDayMonthYear(currentDate)}`;
    return formattedDate;
  }

  const salesData = [
    { name: "JAN", value: 8 },
    { name: "FEV", value: 10 },
    { name: "MAR", value: 12 },
    { name: "ABR", value: 11 },
    { name: "MAI", value: 9 },
    { name: "JUN", value: 11 },
    { name: "JUL", value: 12 },
    { name: "AGO", value: 2 },
    { name: "SET", value: 5 },
    { name: "OUT", value: 42 },
    { name: "NOV", value: 30 },
    { name: "DEZ", value: 8 },
  ];

  const salesDataByBuilding = [
    { name: "JAN", value: 80 },
    { name: "FEV", value: 10 },
    { name: "MAR", value: 12 },
    { name: "ABR", value: 11 },
    { name: "MAI", value: 9 },
    { name: "JUN", value: 11 },
    { name: "JUL", value: 12 },
    { name: "AGO", value: 2 },
    { name: "SET", value: 5 },
    { name: "OUT", value: 42 },
    { name: "NOV", value: 30 },
    { name: "DEZ", value: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Dashboard
          </span>
          <span className="text-sm text-indigo-600 dark:text-indigo-300">
            {formatCurrentDate()}
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
                  Vendas Concluídas
                  <span className="text-xs"> (Nessa semana)</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">73</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                    +24%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Semana passada: 35</p>
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
                  Vendas não finalizadas{" "}
                  <span className="text-xs"> (Nessa semana)</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">35</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">
                    -12%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Semana passada: 97</p>
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
                  Reservas realizadas{" "}
                  <span className="text-xs"> (Nessa semana)</span>
                </p>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold mr-2">237</h3>
                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                    +31%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Semana passada: 187</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-2">Top Vendas</p>
              <div className="flex justify-between mb-2">
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>25</span>
                  </div>
                  <p className="text-xs">Edifício A</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>20</span>
                  </div>
                  <p className="text-xs">Edifício B</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
                    <span>15</span>
                  </div>
                  <p className="text-xs">Edifício C</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-500">Total Vendas</p>
                <p className="text-lg font-bold">R$ 35.000.000,00</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <SalesChartsFilter salesData={salesData} />
          <SalesChartsFilterByBuilding
            salesDataByBuilding={salesDataByBuilding}
          />
        </div>
      </div>
    </div>
  );
}
