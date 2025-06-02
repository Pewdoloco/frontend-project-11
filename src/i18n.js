import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en'
import ru from './locales/ru'

i18next
  .use(LanguageDetector)
  .init({
    resources: { ru, en },
    lng: 'ru',
    fallbackLng: 'ru',
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
    },
  })

export default i18next