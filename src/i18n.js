import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'RSS Aggregator',
      placeholder: 'Enter RSS feed URL',
      button: 'Add Feed',
      success: 'RSS successfully loaded',
      feeds: 'Feeds',
      posts: 'Posts',
      preview: 'Preview',
      read_full: 'Read Full Post',
      close: 'Close',
      errors: {
        url: 'The link must be a valid URL',
        required: 'Must not be empty',
        duplicate: 'RSS already exists',
        network: 'Network error',
        invalid_rss: 'Resource does not contain valid RSS',
      },
    },
  },
  ru: {
    translation: {
      title: 'RSS Агрегатор',
      placeholder: 'Введите URL RSS-потока',
      button: 'Добавить поток',
      success: 'RSS успешно загружен',
      feeds: 'Фиды',
      posts: 'Посты',
      preview: 'Просмотр',
      read_full: 'Читать полностью',
      close: 'Закрыть',
      errors: {
        url: 'Ссылка должна быть валидным URL',
        required: 'Не должно быть пустым',
        duplicate: 'RSS уже существует',
        network: 'Ошибка сети',
        invalid_rss: 'Ресурс не содержит валидный RSS',
      },
    },
  },
};

i18next
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
    },
  });

export default i18next;
