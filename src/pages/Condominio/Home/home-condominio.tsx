import { useTranslation } from "react-i18next";

export function HomeCondominio() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("condominio.home.title")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t("condominio.home.cards.unidades.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t("condominio.home.cards.unidades.description")}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t("condominio.home.cards.financeiro.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t("condominio.home.cards.financeiro.description")}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">{t("condominio.home.cards.reunioes.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t("condominio.home.cards.reunioes.description")}</p>
        </div>
      </div>
    </div>
  );
}

