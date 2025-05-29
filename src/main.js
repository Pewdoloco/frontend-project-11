import * as yup from 'yup';
import i18next from './i18n.js';
import view from './view.js';

yup.setLocale({
  string: {
    url: () => ({ key: 'errors.url' }),
    required: () => ({ key: 'errors.required' }),
  },
});

const state = {
  feeds: [],
  form: {
    valid: false,
    error: null, 
  },
};

const watchedState = view(state);

const schema = yup.string().url().required();

i18next.init().then(() => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    if (key.startsWith('[placeholder]')) {
      const actualKey = key.replace('[placeholder]', '');
      element.placeholder = i18next.t(actualKey);
    } else {
      element.textContent = i18next.t(key);
    }
  });

  document.getElementById('rss-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const rssUrl = document.getElementById('rss-url').value;

    const isDuplicate = state.feeds.includes(rssUrl);

    new Promise((resolve, reject) => {
      if (isDuplicate) {
        reject({ key: 'errors.duplicate' });
      } else {
        schema.validate(rssUrl)
          .then(() => resolve(rssUrl))
          .catch((err) => reject({ key: err.message }));
      }
    })
      .then((validUrl) => {
        watchedState.form.error = null;
        watchedState.form.valid = true;
        watchedState.feeds.push(validUrl);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.key;
      });
  });
});