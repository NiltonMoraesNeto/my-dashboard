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

interface VendasChartsProps {
  vendasData: {
    name: string;
    value: number;
  }[];
}

export function VendasCharts({ vendasData }: VendasChartsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-medium">Vendas</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={vendasData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="text-xs">{`${payload[0].value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
