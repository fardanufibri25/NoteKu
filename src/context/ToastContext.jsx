import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(timer.current)
    setToast({ message, tone })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed top-20 inset-x-4 z-[60] mx-auto flex max-w-[350px] items-center gap-2 rounded-xl bg-inverse-surface px-4 py-2.5 text-body-sm font-body-sm text-inverse-on-surface shadow-lg transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <span className={`material-symbols-outlined text-[18px] ${toast?.tone === 'error' ? 'text-error-container' : 'text-tertiary-fixed'}`}>
          {toast?.tone === 'error' ? 'error' : 'check_circle'}
        </span>
        <span className="flex-1">{toast?.message}</span>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return context
}
