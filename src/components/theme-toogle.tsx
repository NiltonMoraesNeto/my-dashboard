import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded hover:text-gray-300 dark:bg-indigo-900 dark:text-white"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
