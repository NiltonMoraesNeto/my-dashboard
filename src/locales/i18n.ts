import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import br from "./br/translation.json";
import en from "./en/translation.json";
import es from "./es/translation.json";

const resources = {
  br: { translation: br },
  "pt-BR": { translation: br },
  pt: { translation: br },
  en: { translation: en },
  es: { translation: es },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "br",
      supportedLngs: ["br", "pt-BR", "pt", "en", "es"],
      nonExplicitSupportedLngs: true,
      detection: {
        order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false,
      },
      returnEmptyString: false,
    });
}

export default i18n;
