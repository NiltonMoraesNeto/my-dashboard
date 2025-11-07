import {
  Apple,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChartArea,
  Home,
  Menu,
  NotebookPen,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/auth-context";
import { cn } from "../lib/utils";

type SidebarMenuItem = {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  to?: string;
  submenuKey?: string;
  children?: Array<{ label: string; to: string }>;
};

const menuConfig: SidebarMenuItem[] = [
  {
    key: "home",
    icon: Home,
    label: "Home",
    to: "/home",
  },
  {
    key: "dashboard",
    icon: ChartArea,
    label: "Dashboard",
    to: "/dashboard",
  },
  {
    key: "cadastros",
    icon: NotebookPen,
    label: "Cadastros",
    submenuKey: "cadastros",
    children: [
      { label: "Perfil", to: "/profile" },
      { label: "Usuário", to: "/user" },
    ],
  },
  {
    key: "outromenu",
    icon: Apple,
    label: "Outro Menu",
    submenuKey: "outromenu",
    children: [
      { label: "Outro 1", to: "/outromenu/submenu1" },
      { label: "Outro 2", to: "/outromenu/submenu2" },
      { label: "Outro 3", to: "/outromenu/submenu3" },
    ],
  },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const { dataUser } = useAuth();
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = isOpen ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSubmenu = (menu: string): void => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      return "Bom Dia";
    }
    if (hours < 18) {
      return "Boa Tarde";
    }
    return "Boa Noite";
  }

  const activeKeys = useMemo(() => {
    const path = location.pathname;
    const keys = new Set<string>();

    menuConfig.forEach((item) => {
      if (item.to && path.startsWith(item.to)) {
        keys.add(item.key);
      }

      if (item.children) {
        item.children.forEach((child) => {
          if (path.startsWith(child.to)) {
            keys.add(item.key);
          }
        });
      }
    });

    return keys;
  }, [location.pathname]);

  return (
    <div className="flex h-auto">
      <div className="fixed top-13 left-0 p-4 md:hidden text-indigo-600">
        <button
          className="focus:outline-none"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 transform text-white transition-transform duration-300 ease-in-out bg-indigo-600 dark:bg-indigo-950 text-indigo-300 w-64 p-4 h-full md:relative md:translate-x-0 md:transform-none z-50",
          {
            "translate-x-0": isOpen,
            "-translate-x-full md:translate-x-0 md:w-20": !isOpen,
          }
        )}
        aria-hidden={!isOpen && isMobile}
      >
        <button
          className="focus:outline-none mb-4"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>
        <h2
          className={cn(
            "text-2xl mb-6 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <div>{getGreeting()}</div>
          <div>{dataUser?.nome}</div>
        </h2>
        <nav>
          <ul className="space-y-4">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const isActive = activeKeys.has(item.key);
              const hasChildren = Boolean(item.children);
              const isSubmenuOpen = hasChildren && openSubmenus[item.key];

              return (
                <li key={item.key}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2 text-lg hover:text-gray-300 transition-colors",
                        isActive && "text-white font-semibold",
                        !isOpen && "justify-center"
                      )}
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon size={20} />
                      {isOpen && <span>{item.label}</span>}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.submenuKey ?? item.key)}
                      className={cn(
                        "flex w-full items-center gap-2 text-lg hover:text-gray-300 transition-colors",
                        isActive && "text-white font-semibold",
                        !isOpen && "justify-center"
                      )}
                      aria-expanded={Boolean(isSubmenuOpen)}
                      aria-controls={`${item.key}-submenu`}
                      title={!isOpen ? item.label : undefined}
                    >
                      <Icon size={20} />
                      {isOpen && (
                        <span className="flex-1 flex items-center justify-between">
                          {item.label}
                          <span className="ml-2">
                            {isSubmenuOpen ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )}
                          </span>
                        </span>
                      )}
                    </button>
                  )}

                  {hasChildren && isSubmenuOpen && isOpen && (
                    <ul
                      id={`${item.key}-submenu`}
                      className="ml-6 mt-2 space-y-2 border-l border-indigo-400/40 pl-4"
                    >
                      {item.children?.map((child) => {
                        const childActive = location.pathname.startsWith(
                          child.to
                        );
                        return (
                          <li key={child.to}>
                            <Link
                              to={child.to}
                              className={cn(
                                "block text-sm hover:text-gray-300 transition-colors",
                                childActive && "text-white font-semibold"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <Separator
                    orientation="horizontal"
                    className="mt-4 bg-indigo-400"
                  />
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
