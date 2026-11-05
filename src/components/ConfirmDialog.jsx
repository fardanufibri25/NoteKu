import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-inverse-surface/40 px-margin pb-6 backdrop-blur-sm sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="flex w-full max-w-[390px] flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              danger ? 'bg-error-container text-error' : 'bg-primary-fixed text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">{danger ? 'warning' : 'help'}</span>
          </div>
          <div className="min-w-0">
            <h2 id="confirm-title" className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h2>
            <p className="mt-1 font-body-md text-body-md leading-normal text-on-surface-variant">{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 pt-1">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-surface-container font-label-lg text-label-lg text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl font-label-lg text-label-lg shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60 ${
              danger ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
            }`}
          >
            {busy ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">{danger ? 'delete_forever' : 'check'}</span>
            )}
            {busy ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
