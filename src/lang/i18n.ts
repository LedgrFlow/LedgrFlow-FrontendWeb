import { dashboardTexts } from "./es/dashboard";


/**
 * List of available languages and their translations
 */
const languages = {
  es: {
    dashboard: dashboardTexts,
  }
};

/**
 * Define the current language
 */
const currentLanguage = "es";
/**
 * Define the current language translations
 */
const currentLanguageTranslations = languages[currentLanguage];
/**
 * Export the current language translations
 */
export const i18n = currentLanguageTranslations;