import {
  Apple,
  ArrowDown,
  ArrowUp,
  ChartArea,
  Menu,
  NotebookPen,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  interface OpenSubmenus {
    [key: string]: boolean;
  }

  const toggleSubmenu = (menu: string): void => {
    setOpenSubmenus((prev: OpenSubmenus) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  function getGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (hours < 12) {
      return "Bom Dia";
    } else if (hours < 18) {
      return "Boa Tarde";
    } else {
      return "Boa Noite";
    }
  }

  return (
    <div className="flex h-auto">
      <div className="fixed top-13 left-0 p-4 min-md:hidden text-indigo-600">
        <button className="focus:outline-none" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div
        className={`
      fixed inset-y-0 left-0 transform text-white
      ${isOpen ? "translate-x-0" : "-translate-x-full sm:w-16 sm:translate-x-0"}
      ransition-transform duration-300 ease-in-out bg-indigo-600 text-white w-64 p-4 h-full md:relative md:translate-x-0 md:transform-none
    `}
      >
        <button className="focus:outline-none" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2
          className={`text-2xl mb-6 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          {getGreeting()} Nilton
        </h2>
        <nav>
          <ul>
            <Separator
              orientation="horizontal"
              className="mb-4 bg-indigo-400"
            />
            <li className="mb-4">
              <Link to="/home" className="text-lg hover:text-gray-300">
                {isOpen ? (
                  <div className="flex items-center">
                    <ChartArea /> <span className="ml-2">Home</span>
                  </div>
                ) : (
                  <ChartArea />
                )}
              </Link>
            </li>
            <Separator
              orientation="horizontal"
              className="mb-4 bg-indigo-400"
            />
            <li className="mb-4">
              <div
                className="text-lg hover:text-gray-300 cursor-pointer"
                onClick={() => toggleSubmenu("cadastros")}
              >
                {isOpen ? (
                  <div className="flex items-center">
                    <NotebookPen />
                    <span className="ml-2 flex">
                      Cadastros{" "}
                      <span className="absolute right-4">
                        {openSubmenus["cadastros"] ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )}
                      </span>
                    </span>
                  </div>
                ) : (
                  <NotebookPen />
                )}
              </div>
              {openSubmenus["cadastros"] && (
                <ul className="ml-8 mt-2">
                  <li className="mb-2">
                    <Link
                      to="/cadastros/submenu1"
                      className="text-md hover:text-gray-300"
                    >
                      Perfil
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/cadastros/submenu2"
                      className="text-md hover:text-gray-300"
                    >
                      Usuário
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <Separator
              orientation="horizontal"
              className="mb-4 bg-indigo-400"
            />
            <li className="mb-4">
              <div
                className="text-lg hover:text-gray-300 cursor-pointer"
                onClick={() => toggleSubmenu("outromenu")}
              >
                {isOpen ? (
                  <div className="flex items-center">
                    <Apple />
                    <span className="ml-2 flex">
                      Outro Menu{" "}
                      <span className="absolute right-4">
                        {openSubmenus["outromenu"] ? (
                          <ArrowUp />
                        ) : (
                          <ArrowDown />
                        )}
                      </span>
                    </span>
                  </div>
                ) : (
                  <Apple />
                )}
              </div>
              {openSubmenus["outromenu"] && (
                <ul className="ml-8 mt-2">
                  <li className="mb-2">
                    <Link
                      to="/outromenu/submenu1"
                      className="text-md hover:text-gray-300"
                    >
                      Outro 1
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/outromenu/submenu2"
                      className="text-md hover:text-gray-300"
                    >
                      Outro 2
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/outromenu/submenu3"
                      className="text-md hover:text-gray-300"
                    >
                      Outro 3
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
