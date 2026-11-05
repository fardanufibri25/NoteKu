import { useEffect, useState } from 'react'

let deferredPrompt = null

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
  })
}

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(deferredPrompt)
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
  )

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault()
      deferredPrompt = event
      setPrompt(event)
    }
    const onInstalled = () => {
      deferredPrompt = null
      setPrompt(null)
      setInstalled(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function install() {
    if (!prompt) return false
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      deferredPrompt = null
      setPrompt(null)
    }
    return outcome === 'accepted'
  }

  return { canInstall: Boolean(prompt) && !installed, installed, install }
}
