import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchUnidadesList } from "../../../services/unidades";
import { fetchReunioesList } from "../../../services/reunioes";
import type { ReuniaoList } from "../../../model/reuniao-model";

export function HomeCondominio() {
  const { t } = useTranslation();
  const [totalUnidades, setTotalUnidades] = useState<number>(0);
  const [isLoadingUnidades, setIsLoadingUnidades] = useState(true);
  const [proximaReuniao, setProximaReuniao] = useState<ReuniaoList | null>(
    null
  );
  const [isLoadingReuniao, setIsLoadingReuniao] = useState(true);

  useEffect(() => {
    const loadTotalUnidades = async () => {
      try {
        setIsLoadingUnidades(true);
        const response = await fetchUnidadesList(1, 1, "");
        if (response && response.total !== undefined) {
          setTotalUnidades(response.total);
        }
      } catch (error) {
        console.error("Erro ao carregar total de unidades:", error);
      } finally {
        setIsLoadingUnidades(false);
      }
    };

    loadTotalUnidades();
  }, []);

  useEffect(() => {
    const loadProximaReuniao = async () => {
      try {
        setIsLoadingReuniao(true);
        const response = await fetchReunioesList(1, 100);
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

    loadProximaReuniao();
  }, []);

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
    </div>
  );
}
