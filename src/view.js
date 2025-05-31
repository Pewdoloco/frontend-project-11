import onChange from 'on-change';
import i18next from './i18n';

export default (state) => {
  const watchedState = onChange(state, (path, value) => {
    const rssInput = document.getElementById('input-url');
    const feedbackElement = document.querySelector('.feedback');
    const feedsContainer = document.getElementById('feeds-container');
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('postModalLabel');
    const modalDescription = document.getElementById('postDescription');
    const modalLink = document.getElementById('postLink');

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

    if (path === 'feeds' || path === 'posts' || path === 'readPosts') {
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
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        const isRead = state.readPosts.some((read) => read.postId === post.id);
        const linkClass = isRead ? 'fw-normal' : 'fw-bold';
        li.innerHTML = `
          <a href="${post.link}" class="${linkClass}" target="_blank">${post.title}</a>
          <button type="button" class="btn btn-primary btn-sm preview-post" data-post-id="${post.id}">
            ${i18next.t('preview')}
          </button>
        `;
        li.querySelector('.preview-post').addEventListener('click', () => {
          watchedState.readPosts.push({ postId: post.id });
          watchedState.modal.postId = post.id;
        });
        postsList.appendChild(li);
      });
      postsSection.appendChild(postsList);

      feedsContainer.appendChild(feedsSection);
      feedsContainer.appendChild(postsSection);
    }

    if (path === 'modal.postId' && value) {
      const post = state.posts.find((p) => p.id === value);
      if (post && modal && modalTitle && modalDescription && modalLink && window.bootstrap) {
        modalTitle.textContent = post.title;
        modalDescription.textContent = post.description;
        modalLink.href = post.link;
        const modalInstance = new window.bootstrap.Modal(modal);
        modalInstance.show();
      }
    }
  });

  i18next.on('initialized', () => {
    const readFullBtn = document.querySelector('#postLink');
    const closeBtn = document.querySelector('#postModal .btn-secondary');
    if (readFullBtn) readFullBtn.textContent = i18next.t('read_full');
    if (closeBtn) closeBtn.textContent = i18next.t('close');
  });

  return watchedState;
};
