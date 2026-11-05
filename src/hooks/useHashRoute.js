import { useEffect, useState } from 'react'

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, queryString = ''] = raw.split('?')
  return { path: path || '/', query: new URLSearchParams(queryString) }
}

export function navigate(path) {
  window.location.hash = `#${path}`
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.path])

  return route
}
