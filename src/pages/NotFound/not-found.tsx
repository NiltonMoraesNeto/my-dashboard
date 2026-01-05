import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-indigo-900">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          {t("notFound.title")}
        </h1>
        <div>
          <Button
            type="button"
            className="w-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            onClick={() => navigate({ to: "/home" })}
          >
            {t("notFound.backHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
