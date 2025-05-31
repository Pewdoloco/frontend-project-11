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
  readPosts: [],
  form: {
    valid: false,
    error: null,
  },
  modal: {
    postId: null,
  },
};

const watchedState = view(state);

const schema = yup.string().url().required();

const fetchRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(proxyUrl)
    .then((response) => {
      if (!response.data.contents) {
        throw new Error('Invalid response from proxy');
      }
      return response.data.contents;
    })
    .catch(() => {
      throw new Error('Network error', { cause: { key: 'errors.network' } });
    });
};

const checkForUpdates = () => {
  if (state.feeds.length === 0) {
    setTimeout(checkForUpdates, 5000);
    return;
  }

  const promises = state.feeds.map((feed) => fetchRSS(feed.url)
    .then((xmlString) => {
      const { posts } = parseRSS(xmlString);
      const existingLinks = new Set(state.posts.map((post) => post.link));
      const newPosts = posts
        .filter((post) => !existingLinks.has(post.link))
        .map((post) => ({
          id: generateId(),
          feedId: feed.id,
          title: post.title,
          link: post.link,
          description: post.description,
        }));
      if (newPosts.length > 0) {
        watchedState.posts.unshift(...newPosts);
      }
    })
    .catch(() => {
    }));

  Promise.allSettled(promises).then(() => {
    setTimeout(checkForUpdates, 5000);
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
    const rssUrl = document.getElementById('input-url').value;

    watchedState.form.valid = false;
    watchedState.form.error = null;

    const isDuplicate = state.feeds.some((feed) => feed.url === rssUrl);

    new Promise((resolve, reject) => {
      if (isDuplicate) {
        reject(new Error('Duplicate feed', { cause: { key: 'errors.duplicate' } }));
      } else {
        schema.validate(rssUrl, { abortEarly: false })
          .then(() => fetchRSS(rssUrl))
          .then((xmlString) => {
            try {
              const { feed, posts } = parseRSS(xmlString);
              resolve({ feed, posts, url: rssUrl });
            } catch (err) {
              reject(new Error('Invalid RSS', { cause: { key: 'errors.invalid_rss' } }));
            }
          })
          .catch((err) => {
            let errorKey = 'errors.url';
            if (err.name === 'ValidationError') {
              if (err.type === 'required' || (err.errors && err.errors.includes('this is a required field'))) {
                errorKey = 'errors.required';
              }
            }
            reject(new Error('Validation error', { cause: { key: errorKey } }));
          });
      }
    })
      .then(({ feed, posts, url }) => {
        const feedId = generateId();
        watchedState.feeds.push({
          id: feedId, url, title: feed.title, description: feed.description,
        });
        const newPosts = posts
          .map((post) => ({
            id: generateId(),
            feedId,
            title: post.title,
            link: post.link,
            description: post.description,
          }));
        watchedState.posts.unshift(...newPosts);
        watchedState.form.valid = true;
        watchedState.form.error = null;
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.cause ? err.cause.key : 'errors.network';
      });
  });

  checkForUpdates();
});
