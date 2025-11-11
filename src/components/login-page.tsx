import { useMemo, useState } from "react";
import { Facebook, Instagram, Linkedin, Wifi } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { ThemeToggle } from "./theme-toogle";
import { ModalResetPassword } from "./modal-reset-password";
import { ModalInputToken } from "./modal-input-token";
import { ModalSignUp } from "./modal-sign-up";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./language-switcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoginSchema, type LoginSchema } from "../schemas/login-schema";
import { FormErrorMessage } from "./form-error-message";
import { cn } from "../lib/utils";

export function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [openModalResetPassword, setOpenModalResetPassword] = useState(false);
  const [openModalInputToken, setOpenModalInputToken] = useState(false);
  const [openModalSignUp, setOpenModalSignUp] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setSubmitError("");

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setSubmitError(result.message || t("auth.errors.invalidCredentials"));
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setSubmitError(t("auth.errors.unexpected"));
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Coluna esquerda - Roxo  */}
      <div className="hidden w-1/2 flex-col justify-between bg-indigo-600 dark:bg-indigo-900 p-12 text-white md:flex h-full">
        <div>
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Wifi />
            {t("auth.brand")}
            <ThemeToggle />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{t("auth.hero.title")}</h1>
          <div className="space-y-2">
            <p className="text-xl">{t("auth.hero.subtitle")}</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="mb-4">{t("auth.hero.callToAction")}</p>
              <Button
                type="button"
                variant="default"
                className="border-white text-white hover:bg-white/10 hover:text-white"
                onClick={() => setOpenModalSignUp(true)}
              >
                {t("auth.hero.signUp")}
              </Button>
            </div>
            <LanguageSwitcher isLabelVisible={false} />
          </div>
        </div>
        <div></div>
      </div>

      {/* Coluna direita - Branco  */}
      <div className="flex w-full flex-col items-center justify-center bg-white dark:bg-indigo-950 p-6 md:w-1/2 md:p-12 h-full">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-indigo-600 uppercase">
              {t("auth.form.title")}
            </h2>
          </div>
          {submitError && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-indigo-400 dark:text-white"
                >
                  {t("auth.form.emailLabel")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.form.emailPlaceholder")}
                  className={cn(
                    "border-indigo-200 focus-visible:ring-indigo-500 dark:text-white",
                    errors.email &&
                      "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                  )}
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email")}
                />
                <FormErrorMessage message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-indigo-400 dark:text-white"
                >
                  {t("auth.form.passwordLabel")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.form.passwordPlaceholder")}
                  className={cn(
                    "border-indigo-200 focus-visible:ring-indigo-500 dark:text-white",
                    errors.password &&
                      "border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                  )}
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password")}
                />
                <FormErrorMessage message={errors.password?.message} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="dark:border-white"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-500 dark:text-white"
                  >
                    {t("auth.form.rememberMe")}
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
              disabled={isSubmitting}
              className="w-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {isSubmitting ? t("auth.form.submitting") : t("auth.form.submit")}
            </Button>

            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">
                  {t("auth.form.social.facebook")}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">
                  {t("auth.form.social.instagram")}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">
                  {t("auth.form.social.linkedin")}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>

      <ModalSignUp open={openModalSignUp} setOpen={setOpenModalSignUp} />
    </div>
  );
}
