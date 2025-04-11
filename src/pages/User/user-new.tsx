import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Label } from "../../components/ui/label";

export function UserNew() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Adicionar Novo Usuário
          </h1>
          <Label
            className="cursor-pointer text-lg text-indigo-600 dark:text-indigo-300"
            onClick={() => navigate("/user")}
          >
            <ArrowLeft /> Voltar
          </Label>
        </div>
      </div>
    </div>
  );
}
