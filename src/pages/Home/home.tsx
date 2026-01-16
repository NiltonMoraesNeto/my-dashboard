import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { fetchMovimentacoesMensal } from "../../services/home";
import { fetchCondominiosList } from "../../services/usuarios";
import { MovimentacoesChart } from "../../components/charts/movimentacoes-chart";
import { MovimentacoesComparisonChart } from "../../components/charts/movimentacoes-comparison-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CondominioOption {
  id: string;
  nome: string;
}

export function HomePage() {
  const { profileUser, dataUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState<"Entrada" | "Saída" | undefined>(undefined);
  const [condominioId, setCondominioId] = useState<string | undefined>(undefined);
  const [condominios, setCondominios] = useState<CondominioOption[]>([]);
  const [loadingCondominios, setLoadingCondominios] = useState(false);
  const [movimentacoesData, setMovimentacoesData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [entradasData, setEntradasData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [saidasData, setSaidasData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Identificar perfil: SuperAdmin tem perfilId === 99
  const isSuperAdmin = dataUser?.perfilId === 99;
  const isAdmin = profileUser?.toLowerCase().includes("admin") && !isSuperAdmin;
  const isCondominio = profileUser?.toLowerCase().includes("condomínio") || 
                       profileUser?.toLowerCase().includes("condominio");

  // Carregar lista de condomínios baseado no perfil
  useEffect(() => {
    const loadCondominios = async () => {
      // SuperAdmin e Admin podem ver lista de condomínios
      if (isSuperAdmin || isAdmin) {
        setLoadingCondominios(true);
        try {
          const condominiosList = await fetchCondominiosList();
          setCondominios(condominiosList);
        } catch (error) {
          console.error("Erro ao carregar condomínios:", error);
          toast.error("Erro ao carregar lista de condomínios");
        } finally {
          setLoadingCondominios(false);
        }
      } else {
        // Perfil Condomínio não precisa de lista
        setCondominios([]);
      }
    };

    loadCondominios();
  }, [isSuperAdmin, isAdmin]);

  // Buscar dados de movimentações (gráfico individual)
  useEffect(() => {
    const fetchData = async () => {
      if (!tipo) {
        setMovimentacoesData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchMovimentacoesMensal({
          ano,
          tipo,
          condominioId,
        });

        setMovimentacoesData(data);
      } catch (err) {
        console.error("Erro ao carregar movimentações:", err);
        setError("Erro ao carregar dados");
        toast.error("Erro ao carregar movimentações");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ano, tipo, condominioId]);

  // Buscar dados para gráfico comparativo (sempre busca ambos)
  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoadingComparison(true);

        const [entradas, saidas] = await Promise.all([
          fetchMovimentacoesMensal({
            ano,
            tipo: "Entrada",
            condominioId,
          }),
          fetchMovimentacoesMensal({
            ano,
            tipo: "Saída",
            condominioId,
          }),
        ]);

        setEntradasData(entradas);
        setSaidasData(saidas);
      } catch (err) {
        console.error("Erro ao carregar dados comparativos:", err);
        toast.error("Erro ao carregar dados comparativos");
      } finally {
        setLoadingComparison(false);
      }
    };

    fetchComparisonData();
  }, [ano, condominioId]);

  // Gerar lista de anos (últimos 5 anos + ano atual + próximos 2 anos)
  const anosDisponiveis = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  if (loading && movimentacoesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
        <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">
              Carregando...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Home
          </h1>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Filtro Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo do Dado</Label>
            <Select
              value={tipo || ""}
              onValueChange={(value) =>
                setTipo(value === "Entrada" || value === "Saída" ? value : undefined)
              }
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Condomínio - apenas para SuperAdmin e Admin */}
          {(isSuperAdmin || isAdmin) && (
            <div className="space-y-2">
              <Label htmlFor="condominio">Condomínio</Label>
              <Select
                value={condominioId || ""}
                onValueChange={(value) =>
                  setCondominioId(value === "todos" ? undefined : value)
                }
                disabled={loadingCondominios}
              >
                <SelectTrigger id="condominio">
                  <SelectValue placeholder="Selecione o condomínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {condominios.map((condominio) => (
                    <SelectItem key={condominio.id} value={condominio.id}>
                      {condominio.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                    onSelect={() => setAno(anoOption)}
                  >
                    {anoOption}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Gráfico Individual */}
        {tipo && movimentacoesData.length > 0 && (
          <div className="mb-6">
            <MovimentacoesChart data={movimentacoesData} tipo={tipo} />
          </div>
        )}

        {/* Mensagem quando não há tipo selecionado */}
        {!tipo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Selecione um tipo de dado para visualizar o gráfico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha entre "Entrada" ou "Saída" no filtro acima para ver os dados
                mensais do ano selecionado.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Mensagem quando não há dados */}
        {tipo && movimentacoesData.length === 0 && !loading && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nenhum dado encontrado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Não há movimentações do tipo "{tipo}" para o período selecionado.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Gráfico Comparativo */}
        <div className="mt-6">
          {loadingComparison ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-64">
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    Carregando comparativo...
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <MovimentacoesComparisonChart
              entradasData={entradasData}
              saidasData={saidasData}
              condominioId={condominioId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
