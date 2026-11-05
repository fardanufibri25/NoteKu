import { navigate } from '../hooks/useHashRoute'

export default function Fab({ label = '' }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] z-40">
      <div className="mx-auto flex max-w-3xl justify-end px-margin">
        <button
          type="button"
          onClick={() => navigate('/new')}
          aria-label="Buat catatan baru"
          className={`pointer-events-auto flex h-14 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-xl transition-all hover:bg-primary active:scale-95 ${
            label ? 'gap-2 pl-4 pr-5' : 'w-14'
          }`}
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[24px]">add</span>
          {label && <span className="font-label-lg text-label-lg font-bold tracking-wide">{label}</span>}
        </button>
      </div>
    </div>
  )
}
