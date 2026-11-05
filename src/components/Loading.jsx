export default function Loading({ message = 'Memuat catatan...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface-container-lowest p-8 text-center shadow-sm">
      <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{message}</p>
    </div>
  )
}
