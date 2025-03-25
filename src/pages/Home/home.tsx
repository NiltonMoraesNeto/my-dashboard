import { BarCharts } from "../../components/charts/barCharts";
import { LineCharts } from "../../components/charts/lineCharts";

export function HomePage() {
  const data = [
    { name: "JAN", uv: 4000, pv: 2400, amt: 2400 },
    { name: "FEV", uv: 3000, pv: 1398, amt: 2210 },
    { name: "MAR", uv: 2000, pv: 9800, amt: 2290 },
    { name: "ABR", uv: 2780, pv: 3908, amt: 2000 },
    { name: "MAI", uv: 1890, pv: 4800, amt: 2181 },
    { name: "JUN", uv: 2390, pv: 3800, amt: 2500 },
    { name: "JUL", uv: 3490, pv: 4300, amt: 2100 },
    { name: "AGO", uv: 4000, pv: 2400, amt: 2400 },
    { name: "SET", uv: 3000, pv: 1398, amt: 2210 },
    { name: "OUT", uv: 2000, pv: 9800, amt: 2290 },
    { name: "NOV", uv: 2780, pv: 3908, amt: 2000 },
    { name: "DEZ", uv: 1890, pv: 4800, amt: 2181 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600">
            Bem Vindo - Dashboard
          </h1>
        </div>
        <div className="p-4 bg-indigo-50 rounded-md overflow-x-auto">
          <div className="flex min-w-[800px] justify-between max-sm:block">
            <div className="w-2/2 p-2">
              <LineCharts data={data} />
            </div>
            <div className="w-2/2 p-2">
              <BarCharts data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
