import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function Header({ subtitle, onBack }) {
  const online = useOnlineStatus()

  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-margin">
        {onBack ? (
          <div className="flex min-w-0 items-center gap-space-xs">
            <button
              type="button"
              aria-label="Kembali"
              onClick={onBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-on-surface transition-colors hover:bg-surface-container"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <img src="/logo.svg" alt="" className="h-7 w-7 shrink-0" />
            <h1 className="truncate font-headline-sm text-headline-sm text-on-surface">{subtitle}</h1>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-space-sm">
            <img src="/logo.svg" alt="Logo NoteKu" className="h-8 w-8 shrink-0 object-contain" />
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">NoteKu</span>
                <span
                  className={online ? 'flex items-center text-primary-container' : 'flex items-center text-warning'}
                  title={online ? 'Online' : 'Mode offline'}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">{online ? 'cloud_done' : 'cloud_off'}</span>
                </span>
              </div>
              <span className="truncate font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>
            </div>
          </div>
        )}
        <a
          href="#/profile"
          aria-label="Buka profil"
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <img
            src="/avatar.svg"
            alt="Profil Fardanu Fibri Alfarizi"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-container/20"
          />
        </a>
      </div>
    </header>
  )
}
