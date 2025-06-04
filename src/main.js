import * as yup from 'yup'
import axios from 'axios'
import i18next from './i18n'
import view from './view'
import { parseRSS } from './parser'

const UPDATE_INTERVAL_MS = 5000

const generateId = str => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

const getProxiedUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

const fetchRSS = url => {
  return axios.get(getProxiedUrl(url))
    .then(response => {
      if (!response.data.contents) {
        throw new Error('Invalid response', { cause: { key: 'errors.network' } })
      }
      return response.data.contents
    })
    .catch(() => {
      throw new Error('Network error', { cause: { key: 'errors.network' } })
    })
}

const addFeedAndPosts = (watchedState, feed, posts, url, generateId, defaultValues) => {
  const feedId = generateId(feed.title || defaultValues.feedTitle)
  watchedState.feeds.push({
    id: feedId,
    url,
    title: feed.title || defaultValues.feedTitle,
    description: feed.description || defaultValues.feedDescription,
  })
  const newPosts = posts.map(post => ({
    id: generateId(post.title || defaultValues.postTitle),
    feedId,
    title: post.title || defaultValues.postTitle,
    link: post.link || defaultValues.postLink,
    description: post.description || defaultValues.postDescription,
  }))
  watchedState.posts.unshift(...newPosts)
}

const loadRSS = (url, watchedState, generateId, defaultValues) => {
  return fetchRSS(url)
    .then(xmlString => {
      const { feed, posts } = parseRSS(xmlString)
      return { feed, posts, url }
    })
    .then(({ feed, posts, url }) => {
      addFeedAndPosts(watchedState, feed, posts, url, generateId, defaultValues)
    })
}

const app = () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.url' }),
      required: () => ({ key: 'errors.required' }),
    },
  })

  const defaultValues = {
    feedTitle: 'Unnamed Feed',
    feedDescription: '',
    postTitle: 'Unnamed Post',
    postLink: '#',
    postDescription: 'No description available',
  }

  const state = {
    feeds: [],
    posts: [],
    readPosts: [],
    form: {
      valid: false,
      error: null,
    },
    process: {
      loading: false,
    },
    modal: {
      postId: null,
    },
    updateError: null,
  }

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

  i18next.init().then(() => {
    const watchedState = view(state, elements)

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.preview-post')
      if (button && button.closest('.posts')) {
        const postId = button.dataset.postId;
        watchedState.readPosts.push({ id: postId })
        watchedState.modal.postId = postId;
      }
    })

    const checkForUpdates = () => {
      if (state.feeds.length === 0 || state.process.loading) {
        setTimeout(checkForUpdates, UPDATE_INTERVAL_MS)
        return
      }

      const promises = state.feeds.map(feed => fetchRSS(feed.url)
        .then((xmlString) => {
          const { posts } = parseRSS(xmlString)
          const existingLinks = new Set(state.posts.map((post) => post.link))
          const newPosts = posts
            .filter(post => !existingLinks.has(post.link))
            .map(post => ({
              id: generateId(post.title || defaultValues.postTitle),
              feedId: feed.id,
              title: post.title || defaultValues.postTitle,
              link: post.link || defaultValues.postLink,
              description: post.description || defaultValues.postDescription,
            }))
          if (newPosts.length > 0) {
            watchedState.posts.unshift(...newPosts)
          }
        })
        .catch((err) => {
          watchedState.updateError = err.cause?.key || 'errors.network'
        }))

      Promise.allSettled(promises).then(() => {
        setTimeout(checkForUpdates, UPDATE_INTERVAL_MS)
      })
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n
      if (key.startsWith('[placeholder]')) {
        const actualKey = key.replace('[placeholder]', '')
        element.placeholder = i18next.t(actualKey)
      }
      else {
        element.textContent = i18next.t(key)
      }
    })

    const readFullBtn = document.querySelector('#postLink')
    const closeBtn = document.querySelector('#postModal .btn-secondary')
    if (readFullBtn) readFullBtn.textContent = i18next.t('read_full')
    if (closeBtn) closeBtn.textContent = i18next.t('close')

    document.getElementById('rss-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      const rssUrl = formData.get('url') || ''

      watchedState.form.valid = false
      watchedState.form.error = null
      watchedState.process.loading = true

      const currentUrls = state.feeds.map(feed => feed.url)

      const schema = yup.string()
        .url('errors.url')
        .required('errors.required')
        .notOneOf(currentUrls, 'errors.duplicate')

      schema.validate(rssUrl, { abortEarly: false })
        .then(() => loadRSS(rssUrl, watchedState, generateId, defaultValues))
        .then(() => {
          watchedState.form.valid = true
          watchedState.form.error = null
          watchedState.process.loading = false
        })
        .catch((err) => {
          watchedState.form.valid = false
          watchedState.process.loading = false
          if (err.name === 'ValidationError') {
            const errorKey = err.errors[0] || 'errors.url'
            watchedState.form.error = errorKey
          }
          else {
            watchedState.form.error = err.cause?.key || 'errors.network'
          }
        })
    })

    checkForUpdates()
  })
}

app()
