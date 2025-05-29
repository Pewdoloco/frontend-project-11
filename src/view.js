import onChange from 'on-change';

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
        feedbackElement.textContent = value.message;
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
      feedbackElement.textContent = 'RSS feed added successfully';
    }
  });

  return watchedState;
};