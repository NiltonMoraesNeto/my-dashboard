import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth-context";
import { useTheme } from "../contexts/theme-context";

const Header: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-indigo-600 dark:bg-red-500 text-white dark:text-blue-600 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/home" className="text-2xl font-bold hover:text-gray-300">
          NM -{" "}
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        <Button
          className="focus:outline-none hover:text-gray-300"
          onClick={toggleTheme}
        >
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
