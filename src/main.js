import "./style.css";
import * as yup from 'yup';
import view from './view.js';

const state = {
  feeds: [],
  form: {
    valid: false,
    error: null,
  },
};

const watchedState = view(state);

const schema = yup.string().url('Нужен валидный URL').required('URL валидный');

document.getElementById('rss-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const rssUrl = document.getElementById('rss-url').value;
  const isDuplicate = state.feeds.includes(rssUrl);

  new Promise((resolve, reject) => {
    if (isDuplicate) {
      reject(new Error('This RSS feed is already added'));
    } else {
      schema.validate(rssUrl)
        .then(() => resolve(rssUrl))
        .catch((err) => reject(err));
    }
  })
    .then((validUrl) => {
      watchedState.form.error = null;
      watchedState.form.valid = true;
      watchedState.feeds.push(validUrl);
    })
    .catch((err) => {
      watchedState.form.valid = false;
      watchedState.form.error = err;
    });
});