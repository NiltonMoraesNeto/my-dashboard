import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MesAnoFilterProps {
  mes: number | undefined;
  ano: number;
  onMesChange: (mes: number | undefined) => void;
  onAnoChange: (ano: number) => void;
}

const meses = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export function MesAnoFilter({
  mes,
  ano,
  onMesChange,
  onAnoChange,
}: MesAnoFilterProps) {
  // Gerar lista de anos (últimos 5 anos + ano atual + próximos 2 anos)
  const anosDisponiveis = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const mesSelecionado = meses.find((m) => m.value === mes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Filtro Mês */}
      <div className="space-y-2">
        <Label htmlFor="mes">Mês</Label>
        <Select
          value={mes?.toString() || "todos"}
          onValueChange={(value) =>
            onMesChange(value === "todos" ? undefined : parseInt(value, 10))
          }
        >
          <SelectTrigger id="mes" className="bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value.toString()}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro Ano */}
      <div className="space-y-2">
        <Label htmlFor="ano">Ano</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {ano} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
            {anosDisponiveis.map((anoOption) => (
              <DropdownMenuItem
                key={anoOption}
                onSelect={() => onAnoChange(anoOption)}
              >
                {anoOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
