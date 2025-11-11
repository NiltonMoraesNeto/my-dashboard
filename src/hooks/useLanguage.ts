import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export type LanguageCode = "br" | "pt" | "pt-BR" | "en" | "es";

type LanguageOption = {
  value: LanguageCode;
  labelKey: string;
  icon: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "br", labelKey: "language.br", icon: "/bra.png" },
  { value: "en", labelKey: "language.en", icon: "/usa.png" },
  { value: "es", labelKey: "language.es", icon: "/spa.png" },
];

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = useMemo<LanguageCode>(() => {
    const resolved = (i18n.resolvedLanguage || i18n.language || "br").toLowerCase();

    if (resolved.startsWith("pt")) {
      return "br";
    }

    const match = LANGUAGE_OPTIONS.find((option) => option.value === resolved);
    return match ? match.value : "br";
  }, [i18n.language, i18n.resolvedLanguage]);

  const changeLanguage = useCallback(
    async (language: LanguageCode) => {
      await i18n.changeLanguage(language);
    },
    [i18n]
  );

  return {
    currentLanguage,
    changeLanguage,
    options: LANGUAGE_OPTIONS,
  };
}
