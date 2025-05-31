import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'RSS Aggregator',
      placeholder: 'Enter RSS feed URL',
      button: 'Add Feed',
      success: 'RSS feed added successfully',
      feeds: 'Feeds',
      posts: 'Posts',
      preview: 'Preview',
      read_full: 'Read Full Post',
      close: 'Close',
      errors: {
        url: 'Must be a valid URL',
        required: 'URL is required',
        duplicate: 'This RSS feed is already added',
        network: 'Network error: failed to fetch RSS feed',
        invalid_rss: 'Invalid RSS format',
      },
    },
  },
  ru: {
    translation: {
      title: 'RSS Агрегатор',
      placeholder: 'Введите URL RSS-потока',
      button: 'Добавить поток',
      success: 'RSS-поток успешно добавлен',
      feeds: 'Фиды',
      posts: 'Посты',
      preview: 'Просмотр',
      read_full: 'Читать полностью',
      close: 'Закрыть',
      errors: {
        url: 'Должен быть действительным URL',
        required: 'URL обязателен',
        duplicate: 'Этот RSS-поток уже добавлен',
        network: 'Ошибка сети: не удалось загрузить RSS-поток',
        invalid_rss: 'Недействительный формат RSS',
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
