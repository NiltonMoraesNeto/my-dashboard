import { useState } from "react";
import { Facebook, Instagram, Linkedin, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { fetchLogin } from "../services/usuarios";
import { ModalResetPassword } from "./modal-reset-password";
import { ModalInputToken } from "./modal-input-token";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [openModalInputToken, setOpenModalInputToken] = useState(false);

  const [tokenIsValid, setTokenIsValid] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await fetchLogin(email, password);

      if (result && result.access_token) {
        login(result.access_token);
        navigate("/dashboard");
      } else {
        setError(result?.error || "Email ou senha inválidos");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Coluna esquerda - Roxo  */}
      <div className="hidden w-1/2 flex-col justify-between bg-indigo-600 dark:bg-indigo-900 p-12 text-white md:flex h-full">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Wifi />
            Nilton Moraes Neto
            <ThemeToggle />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Hey There!</h1>
          <div className="space-y-2">
            <p className="text-xl">Welcome Back.</p>
          </div>
          <div>
            <p className="mb-4">Don't have an account?</p>
            <Button
              variant="default"
              className="border-white text-white hover:bg-white/10 hover:text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>
        <div></div>
      </div>

      {/* Coluna direita - Branco */}
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-indigo-950 p-6 md:w-1/2 md:p-12 h-full">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-600">SIGN IN</h2>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitLogin} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-indigo-400 dark:text-white"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-indigo-400 dark:text-white"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border-indigo-200 focus-visible:ring-indigo-500 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="dark:border-white"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-500 dark:text-white"
                  >
                    Keep me logged in
                  </Label>
                </div>
                <ModalResetPassword
                  openModalResetPassword={openModalResetPassword}
                  setOpenModalResetPassword={setOpenModalResetPassword}
                  setOpenModalInputToken={setOpenModalInputToken}
                />
                <ModalInputToken
                  openModalInputToken={openModalInputToken}
                  setOpenModalInputToken={setOpenModalInputToken}
                  tokenIsValid={tokenIsValid}
                  setTokenIsValid={setTokenIsValid}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Sign In"}
            </Button>

            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
