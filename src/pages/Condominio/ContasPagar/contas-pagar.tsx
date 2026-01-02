import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

export function ContasPagar() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("condominio.contasPagar.title")}</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {t("condominio.contasPagar.addButton")}
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">{t("condominio.contasPagar.emptyMessage")}</p>
      </div>
    </div>
  );
}

