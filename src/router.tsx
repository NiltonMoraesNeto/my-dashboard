import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./components/login-page";
import { ProtectedRoute } from "./components/protected-route";
import { AuthenticatedLayout } from "./components/authenticated-layout";
import { useAuth } from "./contexts/auth-context";
import { HomePage } from "./pages/Home/home";
import { Profile } from "./pages/Profile/profile";
import { NotFoundPage } from "./pages/NotFound/not-found";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />

      {/* Rotas protegidas com layout autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Rota para página não encontrada */}
        </Route>
      </Route>

      {/* Redirecionar para login ou home dependendo do estado de autenticação */}
      {/* <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />}
      /> */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}
