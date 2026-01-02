import { useTranslation } from "react-i18next";

export function Balancete() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{t("condominio.balancete.title")}</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">{t("condominio.balancete.emptyMessage")}</p>
      </div>
    </div>
  );
}

