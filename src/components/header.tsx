import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-indigo-600 dark:bg-red-500 text-white dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/home" className="text-2xl font-bold hover:text-gray-300">
          NM
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button className="focus:outline-none hover:text-gray-300">
          <Bell size={24} />
        </Button>
        <Button
          className="focus:outline-none hover:text-gray-300"
          onClick={() => navigate("/profile")}
        >
          <User size={24} />
        </Button>
        <Button
          className="focus:outline-none hover:text-gray-300"
          onClick={handleLogout}
        >
          <LogOut size={24} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
