import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { isAxiosError } from "axios";
import api from "../services/api";
import { TokenPayload } from "../model/profile-model";
import { AuthContextType } from "../model/auth-context-model";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<TokenPayload | undefined>();
  const [profileUser, setProfileUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/check");

      if (response.data.isAuthenticated && response.data.user) {
        setIsAuthenticated(true);

        const userData: TokenPayload = {
          sub: response.data.user.id,
          email: response.data.user.email,
          perfilId: response.data.user.perfilId,
          exp: 0, // Não precisamos mais disso, o backend gerencia
          nome: response.data.user.nome,
          avatar: response.data.user.avatar,
        };

        setDataUser(userData);
        setProfileUser(response.data.user.perfil?.descricao || "");
      } else {
        setIsAuthenticated(false);
        setDataUser(undefined);
        setProfileUser("");
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
      setDataUser(undefined);
      setProfileUser("");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.user) {
        const userData: TokenPayload = {
          sub: response.data.user.id,
          email: response.data.user.email,
          perfilId: response.data.user.perfilId,
          exp: 0,
          nome: response.data.user.nome,
          avatar: response.data.user.avatar,
        };

        setDataUser(userData);
        setIsAuthenticated(true);
        setProfileUser(response.data.user.perfil?.descricao || "");

        return { success: true };
      }

      return { success: false, message: "Erro ao fazer login" };
    } catch (error: unknown) {
      console.error("Erro ao fazer login:", error);
      const message =
        isAxiosError(error) && typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Erro ao fazer login";
      return {
        success: false,
        message,
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsAuthenticated(false);
      setDataUser(undefined);
      setProfileUser("");
    }
  };

  if (isLoading) {
    return null; // ou um componente de loading
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, dataUser, profileUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
