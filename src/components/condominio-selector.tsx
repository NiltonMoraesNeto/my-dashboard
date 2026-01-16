import { useEffect, useState } from "react";
import { useCondominio } from "../contexts/condominio-context";
import { fetchCondominiosList, type CondominioOption } from "../services/usuarios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

export function CondominioSelector() {
  const { selectedCondominioId, setSelectedCondominioId, shouldShowSelector } =
    useCondominio();
  const [condominios, setCondominios] = useState<CondominioOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shouldShowSelector) {
      const loadCondominios = async () => {
        try {
          setLoading(true);
          const data = await fetchCondominiosList();
          setCondominios(data);
          // Se não há condomínio selecionado e há condomínios disponíveis, seleciona o primeiro
          if (!selectedCondominioId && data.length > 0) {
            setSelectedCondominioId(data[0].id);
          }
        } catch (error) {
          console.error("Erro ao carregar condomínios:", error);
        } finally {
          setLoading(false);
        }
      };
      loadCondominios();
    }
  }, [shouldShowSelector, selectedCondominioId, setSelectedCondominioId]);

  if (!shouldShowSelector) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center gap-4">
        <Label htmlFor="condominio-select" className="text-sm font-medium">
          Condomínio:
        </Label>
        <Select
          value={selectedCondominioId || ""}
          onValueChange={(value) => setSelectedCondominioId(value)}
          disabled={loading}
        >
          <SelectTrigger id="condominio-select" className="w-[300px]">
            <SelectValue placeholder={loading ? "Carregando..." : "Selecione um condomínio"} />
          </SelectTrigger>
          <SelectContent>
            {condominios.map((condominio) => (
              <SelectItem key={condominio.id} value={condominio.id}>
                {condominio.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
