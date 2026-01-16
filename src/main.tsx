import "./locales/i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/auth-context";
import { CondominioProvider } from "./contexts/condominio-context";
import { AppRouter } from "./router";
import "./index.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "./contexts/theme-context";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <CondominioProvider>
            <AppRouter />
            <Toaster />
          </CondominioProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
