import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "./components/authenticated-layout";
import { LoginPage } from "./components/login-page";
import { ProtectedRoute } from "./components/protected-route";
import { useAuth } from "./contexts/auth-context";
import { Dashboard } from "./pages/Dashboard/dashboard";
import { HomePage } from "./pages/Home/home";
import { NotFoundPage } from "./pages/NotFound/not-found";
import { Profile } from "./pages/Profile/profile";
import { User } from "./pages/User/user";
import { UserEdit } from "./pages/User/user-edit";
import { UserNew } from "./pages/User/user-new";

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rota raiz - redireciona automaticamente */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Rota pública - Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      {/* Rotas protegidas com layout autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/new" element={<UserNew />} />
          <Route path="/user/:id/edit" element={<UserEdit />} />
          {/* Rota para página não encontrada */}
          <Route path="*" element={<NotFoundPage />} />
          {/* Rota para página não encontrada */}
        </Route>
      </Route>
    </Routes>
  );
}
