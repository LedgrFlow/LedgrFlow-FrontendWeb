import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "@/locales/es/translation.json";
import esDashboard from "@/locales/es/darhboard.json";
import en from "@/locales/en/translation.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
    dashboard: esDashboard,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
