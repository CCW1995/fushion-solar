import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

const loadTranslations = async (lng) => {
  try {
    const response = await fetch(`/locales/${lng}.json`)

    if (!response.ok) {
      console.error(`Failed to fetch translations for ${lng}. Status: ${response.status}`)
      return {}
    }

    const translations = await response.json()
    return translations
  } catch (error) {
    console.error(`Error loading ${lng} translations:`, error)
    return {}
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {},
    debug: true,
  })

const setLanguage = async (lng) => {
  try {
    const translations = await loadTranslations(lng)
    i18n.addResourceBundle(lng, "translation", translations, true, true)
    i18n.changeLanguage(lng)
  } catch (error) {
    console.error('Error setting language:', error)
  }
}

export const translate = (key, options = {}) => {
  const translatedText = i18n.t(key, options)
  return translatedText
}

export { setLanguage }
export default i18n
