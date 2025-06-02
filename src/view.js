import onChange from 'on-change'
import i18next from './i18n'

export default (state) => {
  const elements = {
    rssInput: document.getElementById('input-url'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.getElementById('feeds-container'),
    modal: document.getElementById('postModal'),
    modalTitle: document.getElementById('postModalLabel'),
    modalDescription: document.getElementById('postDescription'),
    modalLink: document.getElementById('postLink'),
    submitButton: document.querySelector('#rss-form button'),
  }

  let modalInstance = null

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.error') {
      if (value) {
        elements.rssInput.classList.add('is-invalid')
        elements.feedback.classList.add('text-danger')
        elements.feedback.textContent = i18next.t(value) || 'Unknown error'
      } else {
        elements.rssInput.classList.remove('is-invalid')
        elements.feedback.classList.remove('text-danger')
        elements.feedback.textContent = ''
      }
    }

    if (path === 'form.valid') {
      if (value) {
        elements.rssInput.value = ''
        elements.rssInput.focus()
        elements.feedback.classList.remove('text-danger')
        elements.feedback.classList.add('text-success')
        elements.feedback.textContent = i18next.t('success')
      }
    }

    if (path === 'form.loading') {
      elements.submitButton.disabled = value
      if (value) {
        elements.feedback.classList.remove('text-danger', 'text-success')
        elements.feedback.textContent = i18next.t('loading')
      } else if (!state.form.error && !state.form.valid) {
        elements.feedback.textContent = ''
      }
    }

    if (path === 'updateError' && value) {
      elements.feedback.classList.add('text-warning')
      elements.feedback.textContent = i18next.t(value)
    }

    if (path === 'feeds' || path === 'posts' || path === 'readPosts') {
      elements.feedsContainer.innerHTML = ''

      const feedsSection = document.createElement('div')
      feedsSection.classList.add('mb-4')
      const feedsTitle = document.createElement('h2')
      feedsTitle.textContent = i18next.t('feeds')
      feedsSection.appendChild(feedsTitle)
      const feedsList = document.createElement('ul')
      feedsList.classList.add('list-group')
      state.feeds.forEach((feed) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item')
        const feedTitle = document.createElement('h3')
        feedTitle.textContent = feed.title || 'Unnamed Feed'
        const feedDesc = document.createElement('p')
        feedDesc.textContent = feed.description || ''
        li.append(feedTitle, feedDesc)
        feedsList.appendChild(li)
      })
      feedsSection.appendChild(feedsList)

      const postsSection = document.createElement('div')
      const postsTitle = document.createElement('h2')
      postsTitle.textContent = i18next.t('posts')
      postsSection.appendChild(postsTitle)
      const postsList = document.createElement('ul')
      postsList.classList.add('list-group')
      state.posts.forEach((post) => {
        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
        const isRead = state.readPosts.some((read) => read.id === post.id)
        const linkClass = isRead ? 'fw-normal' : 'fw-bold'
        const link = document.createElement('a')
        link.href = post.link || '#'
        link.className = linkClass
        link.target = '_blank'
        link.textContent = post.title || 'Unnamed Post'
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'btn btn-primary btn-sm preview-post'
        button.dataset.postId = post.id
        button.textContent = i18next.t('preview')
        button.addEventListener('click', () => {
          watchedState.readPosts.push({ id: post.id })
          watchedState.modal.postId = post.id
        })
        li.append(link, button)
        postsList.appendChild(li)
      })
      postsSection.appendChild(postsList)

      elements.feedsContainer.appendChild(feedsSection)
      elements.feedsContainer.appendChild(postsSection)
    }

    if (path === 'modal.postId' && value) {
      const post = state.posts.find((p) => p.id === value)
      if (post && elements.modal && elements.modalTitle && elements.modalDescription && elements.modalLink && window.bootstrap) {
        elements.modalTitle.textContent = post.title || 'Unnamed Post'
        elements.modalDescription.textContent = post.description || 'No description'
        elements.modalLink.href = post.link || '#'
        if (!modalInstance) {
          modalInstance = new window.bootstrap.Modal(elements.modal, { backdrop: true, keyboard: true })
        }
        modalInstance.show()
      }
    }
  })

  if (elements.modal) {
    elements.modal.addEventListener('hidden.bs.modal', () => {
      watchedState.modal.postId = null
      elements.modalTitle.textContent = ''
      elements.modalDescription.textContent = ''
      elements.modalLink.href = '#'
    })
  }

  return watchedState
}