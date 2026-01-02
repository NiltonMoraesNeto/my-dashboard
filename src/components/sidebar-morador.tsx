import { Home, ArrowLeft, Menu, Receipt } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../contexts/auth-context";
import { cn } from "../lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { Separator } from "./ui/separator";

type SidebarMenuItem = {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  labelKey: string;
  to: string;
};

const menuConfig: SidebarMenuItem[] = [
  {
    key: "home",
    icon: Home,
    labelKey: "sidebar.menu.home",
    to: "/home",
  },
  {
    key: "boletos",
    icon: Receipt,
    labelKey: "sidebar.menu.boletos",
    to: "/boletos",
  },
];

export function SidebarMorador() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
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

  const getGreetingKey = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      return "sidebar.greeting.morning";
    }
    if (hours < 18) {
      return "sidebar.greeting.afternoon";
    }
    return "sidebar.greeting.evening";
  };

  const toggleSidebarLabel = isOpen
    ? t("sidebar.toggleClose")
    : t("sidebar.toggleOpen");

  const activeKeys = new Set<string>();
  menuConfig.forEach((item) => {
    if (item.to && pathname.startsWith(item.to)) {
      activeKeys.add(item.key);
    }
  });

  return (
    <div className="flex h-auto">
      <div className="absolute p-4 md:hidden text-indigo-600">
        <button
          type="button"
          className="focus:outline-none"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label={toggleSidebarLabel}
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
          "fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out bg-emerald-600 dark:bg-emerald-950 text-emerald-300 w-64 p-4 h-full md:relative md:translate-x-0 md:transform-none z-50",
          {
            "translate-x-0": isOpen,
            "-translate-x-full md:translate-x-0 md:w-20": !isOpen,
          }
        )}
        aria-hidden={!isOpen && isMobile}
      >
        <button
          type="button"
          className={cn(
            "focus:outline-none mb-4 transition-all duration-300",
            !isOpen && "mx-auto"
          )}
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label={toggleSidebarLabel}
        >
          {isOpen ? (
            <ArrowLeft size={24} />
          ) : (
            <Menu size={24} className="ml-3" />
          )}
        </button>
        {isOpen ? (
          <div className="text-2xl mb-6 transition-opacity duration-300">
            <div>{t(getGreetingKey())}</div>
            <div>{dataUser?.nome}</div>
          </div>
        ) : (
          <span className="sr-only">{dataUser?.nome}</span>
        )}
        <nav className={cn(!isOpen && "mt-6")}>
          <ul className="space-y-4">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const isActive = activeKeys.has(item.key);

              return (
                <li
                  key={item.key}
                  className={cn(!isOpen && "flex flex-col items-center")}
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 text-lg hover:text-gray-300 transition-colors",
                      isActive && "text-white font-semibold",
                      !isOpen && "justify-center"
                    )}
                    title={!isOpen ? t(item.labelKey) : undefined}
                  >
                    <Icon size={20} />
                    {isOpen && <span>{t(item.labelKey)}</span>}
                  </Link>

                  <Separator
                    orientation="horizontal"
                    className={cn(
                      "mt-4 bg-emerald-400",
                      !isOpen && "mx-auto w-10"
                    )}
                  />
                </li>
              );
            })}
          </ul>
        </nav>

        {isOpen && (
          <div className="mt-4">
            <LanguageSwitcher isLabelVisible={false} />
          </div>
        )}
      </div>
    </div>
  );
}

