import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
} from "recharts";

interface ComparativoVendasChartsProps {
  comparativoData: {
    name: string;
    occupied: number;
    booked: number;
    available: number;
  }[];
}

export function ComparativoVendasCharts({
  comparativoData,
}: ComparativoVendasChartsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-medium">Comparativo</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-xs mb-2">
          <div className="flex items-center justify-between">
            <p>Total anual de vendas</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span>Negociado</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>Cancelado</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Vendido</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={comparativoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="text-xs">{`Negociado: ${payload[0].value}`}</p>
                        <p className="text-xs">{`Cancelado: ${payload[1].value}`}</p>
                        <p className="text-xs">{`Vendido: ${payload[2].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="occupied" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="booked" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
