import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";

interface CondominioContextType {
  selectedCondominioId: string | null;
  setSelectedCondominioId: (id: string | null) => void;
  shouldShowSelector: boolean;
}

const CondominioContext = createContext<CondominioContextType | undefined>(
  undefined
);

const STORAGE_KEY = "selectedCondominioId";

export function CondominioProvider({ children }: { children: ReactNode }) {
  const { profileUser } = useAuth();
  const isSuperAdmin = profileUser?.toLowerCase() === "superadmin";
  
  // Carregar do localStorage na inicialização
  const [selectedCondominioId, setSelectedCondominioIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined" && isSuperAdmin) {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored || null;
    }
    return null;
  });

  // Salvar no localStorage quando mudar
  const setSelectedCondominioId = (id: string | null) => {
    setSelectedCondominioIdState(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // Limpar quando não for mais SuperAdmin
  useEffect(() => {
    if (!isSuperAdmin && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      setSelectedCondominioIdState(null);
    }
  }, [isSuperAdmin]);

  return (
    <CondominioContext.Provider
      value={{
        selectedCondominioId,
        setSelectedCondominioId,
        shouldShowSelector: isSuperAdmin,
      }}
    >
      {children}
    </CondominioContext.Provider>
  );
}

export function useCondominio() {
  const context = useContext(CondominioContext);
  if (context === undefined) {
    throw new Error("useCondominio must be used within a CondominioProvider");
  }
  return context;
}
