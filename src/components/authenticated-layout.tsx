import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";

export function AuthenticatedLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
