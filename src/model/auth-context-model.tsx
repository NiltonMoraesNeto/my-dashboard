import type { TokenPayload } from "./profile-model";

export interface AuthContextType {
  isAuthenticated: boolean;
  dataUser: TokenPayload | undefined;
  profileUser: string;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; profileUser?: string }>;
  logout: () => Promise<void>;
}
