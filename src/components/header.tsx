import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { ModalProfileUser } from "./modal-profile-user";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
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
        <Button className="focus:outline-none hover:text-gray-300 dark:bg-indigo-900 dark:text-white">
          <Bell size={24} />
        </Button>
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
