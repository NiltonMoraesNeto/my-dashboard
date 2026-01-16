import { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { useCondominio } from "../contexts/condominio-context";
import { useNavigate, Link } from "@tanstack/react-router";

interface CondominioGuardProps {
  children: ReactNode;
}

export function CondominioGuard({ children }: CondominioGuardProps) {
  const { profileUser } = useAuth();
  const { selectedCondominioId, shouldShowSelector } = useCondominio();
  const navigate = useNavigate();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";

  // Se não for SuperAdmin, renderiza normalmente (usa seu próprio userId)
  if (!shouldShowSelector || !isSuperAdmin) {
    return <>{children}</>;
  }

  // Se for SuperAdmin mas não selecionou condomínio, redireciona para home
  useEffect(() => {
    if (!selectedCondominioId) {
      navigate({ to: "/condominio/home" });
    }
  }, [selectedCondominioId, navigate]);

  if (!selectedCondominioId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Por favor, selecione um condomínio na página inicial.
          </p>
          <Link
            to="/condominio/home"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Ir para página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Se tem condomínio selecionado, renderiza normalmente
  return <>{children}</>;
}
