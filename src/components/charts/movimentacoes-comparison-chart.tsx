import {
  Bar,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface MovimentacoesComparisonChartProps {
  entradasData: {
    mes: number;
    valor: number;
  }[];
  saidasData: {
    mes: number;
    valor: number;
  }[];
  condominioId?: string;
}

export function MovimentacoesComparisonChart({
  entradasData,
  saidasData,
  condominioId,
}: MovimentacoesComparisonChartProps) {
  console.log(
    "🚀 ~ MovimentacoesComparisonChart ~ condominioId:",
    condominioId
  );
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // Combinar dados de entradas e saídas por mês
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    const entrada = entradasData.find((d) => d.mes === mes);
    const saida = saidasData.find((d) => d.mes === mes);

    return {
      name: meses[i],
      Entradas: entrada?.valor || 0,
      Saídas: saida?.valor || 0,
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-medium">
          Comparativo Entradas vs Saídas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded shadow-sm">
                        {payload.map((entry, index) => (
                          <p
                            key={index}
                            className="text-xs"
                            style={{ color: entry.color }}
                          >
                            {entry.name}:{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(entry.value))}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="Entradas" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Saídas" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
