import { useEffect, useState } from 'react'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { navigate } from '../hooks/useHashRoute'
import { formatDate } from '../lib/format'
import TabPage from '../components/TabPage'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import Fab from '../components/Fab'
import Loading from '../components/Loading'

export default function NotesList({ initialQuery = '' }) {
  const { notes, loading, error, removeNote } = useNotes()
  const showToast = useToast()
  const [search, setSearch] = useState(initialQuery)
  const [activeCourse, setActiveCourse] = useState('all')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setSearch(initialQuery)
  }, [initialQuery])

  const courseCounts = notes.reduce((counts, note) => {
    counts[note.course] = (counts[note.course] || 0) + 1
    return counts
  }, {})
  const courses = Object.keys(courseCounts)

  useEffect(() => {
    if (activeCourse !== 'all' && !courses.includes(activeCourse)) setActiveCourse('all')
  }, [activeCourse, courses])

  const term = search.trim().toLowerCase()
  const filtered = notes.filter((note) => {
    const matchesCourse = activeCourse === 'all' || note.course === activeCourse
    const matchesSearch =
      !term || note.title.toLowerCase().includes(term) || note.content.toLowerCase().includes(term)
    return matchesCourse && matchesSearch
  })

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await removeNote(pendingDelete.id)
      showToast('Catatan berhasil dihapus.')
      setPendingDelete(null)
    } catch (err) {
      console.error(err)
      showToast('Catatan gagal dihapus. Coba lagi.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  function resetFilters() {
    setSearch('')
    setActiveCourse('all')
  }

  return (
    <TabPage subtitle="Catatan" active="notes">
      <div className="mb-space-xs flex items-center justify-between gap-space-sm">
        <div className="flex min-w-0 flex-col">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-on-surface">Catatan Kuliah</h1>
          <p className="line-clamp-1 font-body-sm text-body-sm text-on-surface-variant">
            Kelola dan temukan seluruh materi perkuliahan
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/new')}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-3 py-2 text-on-primary shadow-sm transition-transform hover:opacity-95 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="font-label-md text-label-md">Baru</span>
        </button>
      </div>

      <div className="relative my-space-sm w-full">
        <div className="relative flex items-center overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
          <span className="pointer-events-none ml-3.5 text-[20px] text-outline">
            <span className="material-symbols-outlined">search</span>
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari topik, kode, atau materi"
            className="h-11 w-full bg-transparent pl-2.5 pr-9 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Cari topik, kode, atau materi..."
            type="text"
          />
          {search && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={() => setSearch('')}
              className="absolute right-3 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      <div className="no-scrollbar -mx-margin mb-space-sm w-full overflow-x-auto px-margin py-1">
        <div className="flex items-center gap-space-xs whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveCourse('all')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-label-md text-label-md transition-all ${
              activeCourse === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            <span>Semua</span>
            <span
              className={`rounded-full px-1.5 py-0.5 font-label-sm text-label-sm ${
                activeCourse === 'all' ? 'bg-primary-fixed/25 text-on-primary' : 'bg-surface-variant text-on-surface-variant'
              }`}
            >
              {notes.length}
            </span>
          </button>
          {courses.map((course) => {
            const active = activeCourse === course
            return (
              <button
                key={course}
                type="button"
                onClick={() => setActiveCourse(course)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-label-md text-label-md transition-all ${
                  active ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span>{course}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 font-label-sm text-label-sm ${
                    active ? 'bg-primary-fixed/25 text-on-primary' : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  {courseCounts[course]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-space-md flex items-center gap-3 rounded-xl bg-surface-container-low p-space-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-fixed text-on-secondary-fixed">
          <span className="material-symbols-outlined text-[22px]">auto_stories</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-label-md text-label-md font-semibold text-on-surface">Ruang belajar saya</span>
            <span className="flex shrink-0 items-center gap-0.5 font-label-sm text-label-sm font-semibold text-tertiary">
              <span className="material-symbols-outlined text-[14px]">offline_pin</span> Lokal
            </span>
          </div>
          <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
            {courses.length} mata kuliah • {notes.length} catatan
            {notes[0] ? ` • terakhir ${formatDate(notes[0].updatedAt)}` : ''}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-error-container px-3 py-2 font-body-sm text-body-sm text-on-error-container">{error}</p>
      )}

      {loading ? (
        <Loading />
      ) : notes.length === 0 ? (
        <EmptyState
          icon="note_add"
          title="Belum ada catatan"
          message="Semua catatan kuliah Anda akan muncul di sini. Mulai dengan satu catatan baru."
          actionLabel="Tulis Catatan"
          onAction={() => navigate('/new')}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="manage_search"
          title="Tidak ada catatan yang cocok"
          message="Periksa kembali kata kunci atau coba reset filter mata kuliah Anda."
          actionLabel="Reset Filter"
          onAction={resetFilters}
        />
      ) : (
        <div className="flex flex-col gap-space-sm">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} onRequestDelete={setPendingDelete} />
          ))}
        </div>
      )}

      <Fab />
      <div className="h-8" aria-hidden="true" />

      {pendingDelete && (
        <ConfirmDialog
          title="Hapus catatan ini?"
          message={`"${pendingDelete.title}" akan dihapus dari penyimpanan lokal NoteKu. Tindakan ini tidak dapat dibatalkan.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </TabPage>
  )
}
