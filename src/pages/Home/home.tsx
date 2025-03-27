import { VendasCharts } from "../../components/charts/vendasCharts";
import { ComparativoVendasCharts } from "../../components/charts/comparativoVendasCharts";

export function HomePage() {
  const vendasData = [
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

  const comparativoData = [
    { name: "JAN", occupied: 15, booked: 10, available: 25 },
    { name: "FEV", occupied: 20, booked: 12, available: 18 },
    { name: "MAR", occupied: 18, booked: 15, available: 17 },
    { name: "ABR", occupied: 22, booked: 10, available: 18 },
    { name: "MAI", occupied: 20, booked: 15, available: 15 },
    { name: "JUN", occupied: 18, booked: 12, available: 20 },
    { name: "JUL", occupied: 15, booked: 10, available: 25 },
    { name: "AGO", occupied: 15, booked: 10, available: 25 },
    { name: "SET", occupied: 15, booked: 10, available: 25 },
    { name: "OUT", occupied: 15, booked: 10, available: 25 },
    { name: "NOV", occupied: 15, booked: 10, available: 25 },
    { name: "DEZ", occupied: 15, booked: 10, available: 25 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Bem Vindo - Home
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6">
          <VendasCharts vendasData={vendasData} />
          <ComparativoVendasCharts comparativoData={comparativoData} />
        </div>
      </div>
    </div>
  );
}
