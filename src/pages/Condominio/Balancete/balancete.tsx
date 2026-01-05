import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { TableBalanceteMovimentacao } from "../../../components/table-balancete-movimentacao";
import { Pagination } from "../../../components/pagination";
import type { BalanceteMovimentacaoList } from "../../../model/balancete-movimentacao-model";
import { fetchBalanceteMovimentacoesList } from "../../../services/balancete-movimentacoes";

export function Balancete() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [movimentacaoList, setMovimentacaoList] = useState<
    BalanceteMovimentacaoList[]
  >([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovimentacaoData = useCallback(async () => {
    const response = await fetchBalanceteMovimentacoesList(page, limit);
    if (response) {
      if (response.data && response.total !== undefined) {
        setMovimentacaoList(response.data);
        setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      } else if (Array.isArray(response)) {
        setMovimentacaoList(response);
        setTotalPages(Math.ceil(response.length / limit));
      }
    }
  }, [page, limit]);

  useEffect(() => {
    loadMovimentacaoData();
  }, [loadMovimentacaoData]);

  // Calcular saldo
  const entradas = movimentacaoList
    .filter((m) => m.tipo === "Entrada")
    .reduce((sum, m) => sum + m.valor, 0);
  const saidas = movimentacaoList
    .filter((m) => m.tipo === "Saída")
    .reduce((sum, m) => sum + m.valor, 0);
  const saldo = entradas - saidas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t("condominio.balancete.title")}
        </h1>
        <Button
          onClick={() =>
            navigate({ to: "/condominio/balancete/movimentacoes/new" })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("condominio.balancete.addMovimentacao")}
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
            {t("condominio.balancete.entradas")}
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(entradas)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
            {t("condominio.balancete.saidas")}
          </h2>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(saidas)}
          </p>
        </div>
        <div
          className={`p-6 rounded-lg shadow ${
            saldo >= 0
              ? "bg-blue-50 dark:bg-blue-900"
              : "bg-orange-50 dark:bg-orange-900"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">
            {t("condominio.balancete.saldo")}
          </h2>
          <p
            className={`text-3xl font-bold ${
              saldo >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-orange-600 dark:text-orange-400"
            }`}
          >
            {formatCurrency(saldo)}
          </p>
        </div>
      </div>

      {/* Tabela de movimentações */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <TableBalanceteMovimentacao
          movimentacaoList={movimentacaoList}
          handleListData={loadMovimentacaoData}
        />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </div>
  );
}
