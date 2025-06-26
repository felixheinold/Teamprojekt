import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import de from "./components/de.json";
import en from "./components/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    fallbackLng: "de", // fallback if language not available

    interpolation: {
      escapeValue: false, // React handles XSS by default
    },

    detection: {
      // Priority of language detection
      order: ["localStorage", "navigator", "htmlTag"],
      // Cache the language
      caches: ["localStorage"],
      // Optional: fallback to navigator if nothing in localStorage
      lookupLocalStorage: "i18nextLng"
    },

    react: {
      useSuspense: false, // safer in CSR-only apps
    },

    debug: false // set to true for troubleshooting
  });

export default i18n;
