import { useState } from 'react'
import { useNotes } from '../context/NotesContext'
import { navigate } from '../hooks/useHashRoute'
import TabPage from '../components/TabPage'
import ConnectivityBanner from '../components/ConnectivityBanner'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import Fab from '../components/Fab'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export default function Dashboard() {
  const { notes, loading, error } = useNotes()
  const [query, setQuery] = useState('')

  const courses = new Set(notes.map((note) => note.course)).size
  const latest = notes[0]
  const recentNotes = notes.slice(0, 4)
  const weeklyCount = notes.filter((note) => Date.now() - new Date(note.updatedAt).getTime() <= WEEK_MS).length
  const weeklyPercent = notes.length ? Math.round((weeklyCount / notes.length) * 100) : 0

  function submitSearch(event) {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/notes?q=${encodeURIComponent(term)}` : '/notes')
  }

  return (
    <TabPage subtitle="Dashboard" active="dashboard" showOffline={false}>
      <ConnectivityBanner />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Halo, Danu!</h1>
            <span className="animate-bounce text-xl">👋</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Siap belajar &amp; catat materi hari ini?</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container px-2.5 py-1.5 shadow-sm">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">edit_note</span>
          <span className="font-label-sm text-label-sm font-bold text-on-surface">{notes.length} catatan</span>
        </div>
      </div>

      <form onSubmit={submitSearch} className="mb-5 flex items-center gap-2">
        <div className="relative flex flex-1 items-center">
          <span aria-hidden="true" className="material-symbols-outlined absolute left-3.5 text-[20px] text-outline">search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari catatan kuliah"
            className="h-12 w-full rounded-xl bg-surface-container-lowest pl-10 pr-12 font-body-md text-body-md text-on-surface shadow-sm transition-all placeholder:text-on-surface-variant/75 focus:outline-none focus:ring-2 focus:ring-primary-container/40"
            placeholder="Cari catatan kuliah..."
            type="text"
          />
          {query && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setQuery('')}
              className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full text-outline hover:bg-surface-container hover:text-on-surface"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
        <button
          type="button"
          aria-label="Buka daftar dan filter catatan"
          onClick={() => navigate('/notes')}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant shadow-sm transition-transform active:scale-95"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </form>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm">
          <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-primary-fixed/40 blur-xl" />
          <div className="mb-2 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <span className="rounded-full bg-primary-fixed/70 px-2 py-0.5 font-label-sm text-label-sm text-on-primary-fixed">Lokal</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{notes.length}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">berkas</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Catatan</p>
          </div>
        </div>

        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm">
          <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-tertiary-fixed/40 blur-xl" />
          <div className="mb-2 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tertiary-fixed text-tertiary">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">folder_special</span>
            </div>
            <span className="rounded-full bg-tertiary-fixed/70 px-2 py-0.5 font-label-sm text-label-sm text-on-tertiary-fixed">Aktif</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{courses}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">matkul</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant">Mata Kuliah</p>
          </div>
        </div>
      </div>

      {latest ? (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-fixed to-surface-container p-3.5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-sm">
            <span aria-hidden="true" className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-label-md text-label-md text-on-surface">Catatan terakhir: {latest.title}</p>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{latest.course}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/notes/${latest.id}`)}
            className="shrink-0 rounded-lg bg-surface-container-lowest px-2.5 py-1 font-label-sm text-label-sm text-primary shadow-sm"
          >
            Buka
          </button>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-fixed to-surface-container p-3.5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary-container shadow-sm">
            <span aria-hidden="true" className="material-symbols-outlined text-[22px]">auto_stories</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface">Belum ada catatan kuliah</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Mulai catat materi pertama Anda.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/new')}
            className="shrink-0 rounded-lg bg-surface-container-lowest px-2.5 py-1 font-label-sm text-label-sm text-primary shadow-sm"
          >
            Tulis
          </button>
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Catatan Terbaru</h2>
          <span className="h-2 w-2 rounded-full bg-primary-container" />
        </div>
        <a href="#/notes" className="flex items-center font-label-md text-label-md text-primary-container hover:underline">
          Lihat Semua
          <span aria-hidden="true" className="material-symbols-outlined ml-0.5 text-[16px]">chevron_right</span>
        </a>
      </div>

      {loading ? (
        <Loading />
      ) : recentNotes.length === 0 ? (
        <EmptyState
          icon="note_add"
          title="Belum ada catatan"
          message="Buat catatan kuliah pertama Anda. Semua catatan tersimpan di perangkat ini."
          actionLabel="Tulis Catatan"
          onAction={() => navigate('/new')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {recentNotes.map((note) => (
            <NoteCard key={note.id} note={note} recent />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="text-surface-container"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="text-primary-container"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${weeklyPercent}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
          <span className="absolute font-label-sm text-label-sm font-bold text-on-surface">{weeklyPercent}%</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-label-lg text-label-lg text-on-surface">Aktivitas Minggu Ini</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {weeklyCount} dari {notes.length} catatan diperbarui dalam 7 hari terakhir.
          </p>
        </div>
      </div>

      <Fab label="Catatan Baru" />
    </TabPage>
  )
}
