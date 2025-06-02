export const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const errorNode = doc.querySelector('parsererror')
  if (errorNode) {
    throw new Error('Invalid RSS format', { cause: { key: 'errors.invalid_rss' } })
  }

  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('Invalid RSS: no channel found', { cause: { key: 'errors.invalid_rss' } })
  }

  const feed = {
    title: channel.querySelector('title')?.textContent,
    description: channel.querySelector('description')?.textContent,
  }

  const posts = Array.from(channel.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title')?.textContent,
    link: item.querySelector('link')?.textContent,
    description: item.querySelector('description')?.textContent,
  }))

  return { feed, posts }
}
