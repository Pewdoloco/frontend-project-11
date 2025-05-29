import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'RSS Aggregator',
      placeholder: 'Enter RSS feed URL',
      button: 'Add Feed',
      success: 'RSS feed added successfully',
      errors: {
        url: 'Must be a valid URL',
        required: 'URL is required',
        duplicate: 'This RSS feed is already added',
      },
    },
  },
  ru: {
    translation: {
      title: 'RSS Агрегатор',
      placeholder: 'Введите URL RSS-потока',
      button: 'Добавить поток',
      success: 'RSS-поток успешно добавлен',
      errors: {
        url: 'Должен быть действительным URL',
        required: 'URL обязателен',
        duplicate: 'Этот RSS-поток уже добавлен',
      },
    },
  },
};

i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
    },
  });

export default i18next;