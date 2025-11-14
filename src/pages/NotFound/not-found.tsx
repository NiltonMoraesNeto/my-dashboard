import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-indigo-900">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          404 - Página Não Encontrada
        </h1>
        <div>
          <Button
            type="button"
            className="w-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            onClick={() => navigate({ to: "/home" })}
          >
            Voltar para a Home
          </Button>
        </div>
      </div>
    </div>
  );
}
