import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/auth-context";
import { useCondominio } from "../../../contexts/condominio-context";
import { fetchUnidadesList } from "../../../services/unidades";
import { fetchReunioesList } from "../../../services/reunioes";
import { fetchMovimentacoesMensal } from "../../../services/home";
import { MovimentacoesChart } from "../../../components/charts/movimentacoes-chart";
import { MovimentacoesComparisonChart } from "../../../components/charts/movimentacoes-comparison-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { ReuniaoList } from "../../../model/reuniao-model";
import { CondominioSelector } from "../../../components/condominio-selector";

export function HomeCondominio() {
  const { t } = useTranslation();
  const { dataUser, profileUser } = useAuth();
  const { selectedCondominioId, shouldShowSelector } = useCondominio();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  // Para SuperAdmin, usa o condomínio selecionado; caso contrário, usa o próprio userId
  const condominioIdToUse = isSuperAdmin && selectedCondominioId ? selectedCondominioId : dataUser?.sub;
  const [totalUnidades, setTotalUnidades] = useState<number>(0);
  const [isLoadingUnidades, setIsLoadingUnidades] = useState(true);
  const [proximaReuniao, setProximaReuniao] = useState<ReuniaoList | null>(
    null
  );
  const [isLoadingReuniao, setIsLoadingReuniao] = useState(true);
  
  // Estados para gráficos
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState<"Entrada" | "Saída" | undefined>(undefined);
  const [movimentacoesData, setMovimentacoesData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [entradasData, setEntradasData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [saidasData, setSaidasData] = useState<
    Array<{ mes: number; valor: number }>
  >([]);
  const [loadingMovimentacoes, setLoadingMovimentacoes] = useState(false);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTotalUnidades = async () => {
      try {
        setIsLoadingUnidades(true);
        const response = await fetchUnidadesList(
          1,
          1,
          "",
          isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
        );
        if (response && response.total !== undefined) {
          setTotalUnidades(response.total);
        }
      } catch (error) {
        console.error("Erro ao carregar total de unidades:", error);
      } finally {
        setIsLoadingUnidades(false);
      }
    };

    if (condominioIdToUse) {
      loadTotalUnidades();
    }
  }, [condominioIdToUse, isSuperAdmin, selectedCondominioId]);

  useEffect(() => {
    const loadProximaReuniao = async () => {
      try {
        setIsLoadingReuniao(true);
        const response = await fetchReunioesList(
          1,
          100,
          isSuperAdmin && selectedCondominioId ? selectedCondominioId : undefined
        );
        if (response?.data) {
          const reunioes = response.data;
          const agora = new Date();

          // Filtrar reuniões futuras e ordenar por data e hora
          const reunioesFuturas = reunioes
            .filter((reuniao: ReuniaoList) => {
              // Combinar data e hora para comparação
              let dataHoraReuniao: Date;

              // A data vem como ISO string do backend (DateTime)
              const dataStr =
                typeof reuniao.data === "string"
                  ? reuniao.data.split("T")[0]
                  : new Date(reuniao.data).toISOString().split("T")[0];

              if (reuniao.hora && reuniao.hora.trim() !== "") {
                // Combinar data e hora: YYYY-MM-DDTHH:MM
                dataHoraReuniao = new Date(`${dataStr}T${reuniao.hora}`);
              } else {
                dataHoraReuniao = new Date(reuniao.data);
              }

              // Verificar se a data é válida
              if (Number.isNaN(dataHoraReuniao.getTime())) {
                return false;
              }

              // Comparar data/hora completa (reuniões futuras ou de hoje com hora futura)
              return dataHoraReuniao >= agora;
            })
            .sort((a: ReuniaoList, b: ReuniaoList) => {
              let dataHoraA: Date;
              let dataHoraB: Date;

              if (a.hora && a.hora.trim() !== "") {
                const dataPartA = a.data.split("T")[0];
                dataHoraA = new Date(`${dataPartA}T${a.hora}`);
              } else {
                dataHoraA = new Date(a.data);
              }

              if (b.hora && b.hora.trim() !== "") {
                const dataPartB = b.data.split("T")[0];
                dataHoraB = new Date(`${dataPartB}T${b.hora}`);
              } else {
                dataHoraB = new Date(b.data);
              }

              return dataHoraA.getTime() - dataHoraB.getTime();
            });

          if (reunioesFuturas.length > 0) {
            setProximaReuniao(reunioesFuturas[0]);
          } else {
            setProximaReuniao(null);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar próxima reunião:", error);
        setProximaReuniao(null);
      } finally {
        setIsLoadingReuniao(false);
      }
    };

    if (condominioIdToUse) {
      loadProximaReuniao();
    }
  }, [condominioIdToUse, isSuperAdmin, selectedCondominioId]);

  // Buscar dados de movimentações (gráfico individual)
  useEffect(() => {
    const fetchData = async () => {
      if (!tipo || !condominioIdToUse) {
        setMovimentacoesData([]);
        setLoadingMovimentacoes(false);
        return;
      }

      try {
        setLoadingMovimentacoes(true);
        setError(null);

        const data = await fetchMovimentacoesMensal({
          ano,
          tipo,
          condominioId: isSuperAdmin ? condominioIdToUse : undefined,
        });

        setMovimentacoesData(data);
      } catch (err) {
        console.error("Erro ao carregar movimentações:", err);
        setError("Erro ao carregar dados");
        toast.error("Erro ao carregar movimentações");
      } finally {
        setLoadingMovimentacoes(false);
      }
    };

    fetchData();
  }, [ano, tipo, condominioIdToUse, isSuperAdmin]);

  // Buscar dados para gráfico comparativo (sempre busca ambos)
  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!condominioIdToUse) {
        return;
      }

      try {
        setLoadingComparison(true);

        const [entradas, saidas] = await Promise.all([
          fetchMovimentacoesMensal({
            ano,
            tipo: "Entrada",
            condominioId: isSuperAdmin ? condominioIdToUse : undefined,
          }),
          fetchMovimentacoesMensal({
            ano,
            tipo: "Saída",
            condominioId: isSuperAdmin ? condominioIdToUse : undefined,
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
  }, [ano, condominioIdToUse, isSuperAdmin]);

  // Gerar lista de anos (últimos 5 anos + ano atual + próximos 2 anos)
  const anosDisponiveis = Array.from(
    { length: 8 },
    (_, i) => new Date().getFullYear() - 5 + i
  );

  const formatDateTime = (dataString: string, horaString: string) => {
    const dataFormatada = new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return { data: dataFormatada, hora: horaString };
  };

  return (
    <div className="p-6">
      {shouldShowSelector && <CondominioSelector />}
      <h1 className="text-3xl font-bold mb-6">{t("condominio.home.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            {t("condominio.home.cards.unidades.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("condominio.home.cards.unidades.description")}
          </p>
          <p className="text-3xl font-bold mt-4 text-indigo-600 dark:text-indigo-400">
            {isLoadingUnidades ? "..." : totalUnidades}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            {t("condominio.home.cards.financeiro.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("condominio.home.cards.financeiro.description")}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            {t("condominio.home.cards.reunioes.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("condominio.home.cards.reunioes.description")}
          </p>
          {isLoadingReuniao ? (
            <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
          ) : proximaReuniao ? (
            <div>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                {proximaReuniao.titulo}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Data:{" "}
                  {
                    formatDateTime(proximaReuniao.data, proximaReuniao.hora)
                      .data
                  }
                </p>
                <p>
                  Hora:{" "}
                  {
                    formatDateTime(proximaReuniao.data, proximaReuniao.hora)
                      .hora
                  }
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma reunião agendada
            </p>
          )}
        </div>
      </div>

      {/* Seção de Gráficos */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">{t("condominio.home.graficos.title") || "Gráficos Financeiros"}</h2>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        {tipo && movimentacoesData.length === 0 && !loadingMovimentacoes && (
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
            <>
              <MovimentacoesComparisonChart
                entradasData={entradasData}
                saidasData={saidasData}
              />
              {!loadingComparison && entradasData.length === 0 && saidasData.length === 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Nenhum dado encontrado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Não há movimentações para o período selecionado.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
