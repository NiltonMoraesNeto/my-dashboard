import { Outlet } from "@tanstack/react-router";
import Header from "./header";
import { Sidebar } from "./sidebar";
import { SidebarCondominio } from "./sidebar-condominio";
import { SidebarMorador } from "./sidebar-morador";
import { useAuth } from "../contexts/auth-context";

export function AuthenticatedLayout() {
  const { profileUser } = useAuth();
  const isCondominioProfile = profileUser?.toLowerCase() === "condomínio" || profileUser?.toLowerCase() === "condominio";
  const isMoradorProfile = profileUser?.toLowerCase() === "morador";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {isCondominioProfile ? (
          <SidebarCondominio />
        ) : isMoradorProfile ? (
          <SidebarMorador />
        ) : (
          <Sidebar />
        )}
        <main className="flex-1 p-1 overflow-auto bg-gray-100 dark:bg-indigo-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
