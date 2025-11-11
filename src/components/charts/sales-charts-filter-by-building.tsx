import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart as RechartsLineChart,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { SalesBuildingList } from "../../model/sales-model";
import { useTranslation } from "react-i18next";

interface SalesChartsFilterByBuildingProps {
  salesDataByBuilding: SalesBuildingList[];
  buildingSelect: string;
  onBuildingChange: (buildingName: string) => void;
}

export function SalesChartsFilterByBuilding({
  salesDataByBuilding,
  buildingSelect,
  onBuildingChange,
}: SalesChartsFilterByBuildingProps) {
  const { t } = useTranslation();

  const buildingOptions = [
    { value: "Edifício A", label: t("dashboard.topSales.buildings.A") },
    { value: "Edifício B", label: t("dashboard.topSales.buildings.B") },
    { value: "Edifício C", label: t("dashboard.topSales.buildings.C") },
  ];

  const selectedBuildingLabel =
    buildingOptions.find((option) => option.value === buildingSelect)?.label ||
    buildingSelect;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-base font-medium">
          {t("dashboard.charts.salesByBuilding.title")}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              {selectedBuildingLabel} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {buildingOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => onBuildingChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={salesDataByBuilding}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis hide={true} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow-sm">
                        <p className="text-xs">
                          {t("dashboard.charts.salesByBuilding.tooltip", {
                            value: payload[0].value,
                          })}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "white",
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6 }}
                fill="url(#colorUv)"
              />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
