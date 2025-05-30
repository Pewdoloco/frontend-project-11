import * as yup from 'yup';
import axios from 'axios';
import i18next from './i18n';
import view from './view';
import { parseRSS } from './parser';

const generateId = () => Math.random().toString(36).slice(2);

yup.setLocale({
  string: {
    url: () => ({ key: 'errors.url' }),
    required: () => ({ key: 'errors.required' }),
  },
});

const state = {
  feeds: [],
  posts: [],
  form: {
    valid: false,
    error: null,
  },
};

const watchedState = view(state);

const schema = yup.string().url().required();

const fetchRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    url,
  )}`;
  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents)
    .catch(() => {
      throw new Error('Network error', { cause: { key: 'errors.network' } });
    });
};

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

    const isDuplicate = state.feeds.some((feed) => feed.url === rssUrl);

    new Promise((resolve, reject) => {
      if (isDuplicate) {
        reject(
          new Error('Duplicate feed', { cause: { key: 'errors.duplicate' } }),
        );
      } else {
        schema
          .validate(rssUrl)
          .then(() => fetchRSS(rssUrl))
          .then((xmlString) => {
            try {
              const { feed, posts } = parseRSS(xmlString);
              resolve({ feed, posts, url: rssUrl });
            } catch (err) {
              reject(
                new Error('Invalid RSS', {
                  cause: { key: 'errors.invalid_rss' },
                }),
              );
            }
          })
          .catch((err) => {
            if (err.key) {
              reject(
                new Error('Validation error', { cause: { key: err.key } }),
              );
            } else {
              reject(err);
            }
          });
      }
    })
      .then(({ feed, posts, url }) => {
        const feedId = generateId();
        watchedState.feeds.push({
          id: feedId,
          title: feed.title,
          description: feed.description,
          url,
        });
        watchedState.posts.push(
          ...posts.map((post) => ({
            id: generateId(),
            feedId,
            title: post.title,
            link: post.link,
          })),
        );
        watchedState.form.error = null;
        watchedState.form.valid = true;
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.cause ? err.cause.key : 'errors.network';
      });
  });
});
