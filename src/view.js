import onChange from 'on-change';
import i18next from './i18n.js';

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    const rssInput = document.getElementById('rss-url');
    const feedbackElement = document.querySelector('.feedback') || document.createElement('div');

    if (!feedbackElement.classList.contains('feedback')) {
      feedbackElement.classList.add('feedback', 'mt-2');
      rssInput.after(feedbackElement);
    }

    if (path === 'form.error') {
      if (value) {
        rssInput.classList.add('is-invalid');
        feedbackElement.classList.add('text-danger');
        feedbackElement.textContent = i18next.t(value);
      } else {
        rssInput.classList.remove('is-invalid');
        feedbackElement.classList.remove('text-danger');
        feedbackElement.textContent = '';
      }
    }

    if (path === 'form.valid' && value) {
      rssInput.value = '';
      rssInput.focus();
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18next.t('success');
    }
  });

  return watchedState;
};