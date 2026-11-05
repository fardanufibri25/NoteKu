export default function EmptyState({ icon = 'note_add', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest p-space-xl text-center shadow-sm">
      <div className="mb-space-sm flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-outline">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <h2 className="mb-1 font-headline-sm text-headline-sm text-on-surface">{title}</h2>
      <p className="mb-space-md max-w-[260px] font-body-sm text-body-sm text-on-surface-variant">{message}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl bg-surface-container px-4 py-2 font-label-md text-label-md text-primary transition-colors hover:bg-surface-container-high"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
