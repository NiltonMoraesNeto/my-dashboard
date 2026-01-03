import { Bell, LogOut } from "lucide-react";
import type React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { ModalProfileUser } from "./modal-profile-user";
import { ThemeToggle } from "./theme-toogle";
import { Button } from "./ui/button";
import { countAvisosNaoLidos } from "../services/avisos";
import { ModalAvisos } from "./modal-avisos";

const Header: React.FC = () => {
  const { logout, profileUser } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [avisosModalOpen, setAvisosModalOpen] = useState(false);

  const isCondominioProfile =
    profileUser?.toLowerCase() === "condomínio" ||
    profileUser?.toLowerCase() === "condominio";
  const isMoradorProfile = profileUser?.toLowerCase() === "morador";

  const loadUnreadCount = useCallback(async () => {
    const count = await countAvisosNaoLidos();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    if (isCondominioProfile || isMoradorProfile) {
      loadUnreadCount();

      // Atualizar a cada 30 segundos
      const interval = setInterval(loadUnreadCount, 30000);

      // Escutar evento customizado para atualizar quando aviso for marcado como lido
      const handleAvisosUpdated = () => {
        loadUnreadCount();
      };
      window.addEventListener("avisosUpdated", handleAvisosUpdated);

      return () => {
        clearInterval(interval);
        window.removeEventListener("avisosUpdated", handleAvisosUpdated);
      };
    }
  }, [isCondominioProfile, isMoradorProfile, loadUnreadCount]);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const handleBellClick = () => {
    setAvisosModalOpen(true);
  };

  const handleMarkAsRead = () => {
    loadUnreadCount();
    window.dispatchEvent(new CustomEvent("avisosUpdated"));
  };

  return (
    <header className="bg-indigo-600 dark:bg-indigo-950 text-white dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link
          to="/home"
          className="text-2xl font-bold hover:text-gray-300 text-indigo-300"
        >
          NM
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {(isCondominioProfile || isMoradorProfile) && (
          <>
            <Button
              className="focus:outline-none hover:text-gray-300 dark:bg-indigo-900 dark:text-white relative"
              onClick={handleBellClick}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
            <ModalAvisos
              open={avisosModalOpen}
              onOpenChange={setAvisosModalOpen}
              onMarkAsRead={handleMarkAsRead}
            />
          </>
        )}
        <ModalProfileUser />
        <Button
          className="focus:outline-none hover:text-gray-300 dark:bg-indigo-900 dark:text-white"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
