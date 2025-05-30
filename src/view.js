import onChange from 'on-change';
import i18next from './i18n';

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    const rssInput = document.getElementById('rss-url');
    const feedbackElement = document.querySelector('.feedback') || document.createElement('div');
    const feedsContainer = document.getElementById('feeds-container');

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

    if (path === 'feeds' || path === 'posts') {
      feedsContainer.innerHTML = '';

      const feedsSection = document.createElement('div');
      feedsSection.classList.add('mb-4');
      const feedsTitle = document.createElement('h2');
      feedsTitle.textContent = i18next.t('feeds');
      feedsSection.appendChild(feedsTitle);
      const feedsList = document.createElement('ul');
      feedsList.classList.add('list-group');
      state.feeds.forEach((feed) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
        feedsList.appendChild(li);
      });
      feedsSection.appendChild(feedsList);

      const postsSection = document.createElement('div');
      const postsTitle = document.createElement('h2');
      postsTitle.textContent = i18next.t('posts');
      postsSection.appendChild(postsTitle);
      const postsList = document.createElement('ul');
      postsList.classList.add('list-group');
      state.posts.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<a href="${post.link}" target="_blank">${post.title}</a>`;
        postsList.appendChild(li);
      });
      postsSection.appendChild(postsList);

      feedsContainer.appendChild(feedsSection);
      feedsContainer.appendChild(postsSection);
    }
  });

  return watchedState;
};
