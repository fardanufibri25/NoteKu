import { useState } from 'react'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { navigate } from '../hooks/useHashRoute'
import { formatDateTime, readingMinutes } from '../lib/format'
import StackPage from '../components/StackPage'
import CourseBadge from '../components/CourseBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'

export default function NoteDetail({ id }) {
  const { notes, loading, removeNote } = useNotes()
  const showToast = useToast()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const note = notes.find((item) => item.id === id)
  const back = () => navigate('/notes')

  async function confirmDelete() {
    setDeleting(true)
    try {
      await removeNote(note.id)
      showToast('Catatan berhasil dihapus.')
      navigate('/notes')
    } catch (err) {
      console.error(err)
      showToast('Catatan gagal dihapus. Coba lagi.', 'error')
      setDeleting(false)
    }
  }

  return (
    <StackPage title="Detail Catatan" onBack={back}>
      {loading ? (
        <Loading />
      ) : !note ? (
        <EmptyState
          icon="search_off"
          title="Catatan tidak ditemukan"
          message="Catatan ini sudah dihapus atau tidak tersedia di perangkat ini."
          actionLabel="Kembali ke Catatan"
          onAction={back}
        />
      ) : (
        <div className="pb-8">
          <div className="mb-space-xs flex items-center justify-between gap-space-sm py-space-sm">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-space-xs rounded-xl bg-surface-container-low px-3 py-2 text-on-surface transition-colors hover:bg-surface-container"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span className="font-label-md text-label-md">Kembali ke Catatan</span>
            </button>
            <div className="flex shrink-0 items-center gap-space-xs">
              <button
                type="button"
                onClick={() => navigate(`/notes/${note.id}/edit`)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary-fixed px-3.5 text-on-primary-fixed shadow-sm transition-colors hover:bg-primary-fixed-dim"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">edit</span>
                <span className="font-label-md text-label-md">Edit</span>
              </button>
              <button
                type="button"
                aria-label="Hapus catatan"
                onClick={() => setConfirming(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-error-container text-on-error-container shadow-sm transition-opacity hover:opacity-90"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>

          <div className="mb-space-md flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CourseBadge course={note.course} className="gap-1.5 px-3 py-1" />
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]">timer</span>
                {readingMinutes(note.content)} mnt baca
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile leading-tight text-on-surface">{note.title}</h2>
            <div className="flex flex-col gap-1.5 pt-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
                <span>Dibuat: {formatDateTime(note.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">update</span>
                <span>Terakhir diperbarui: {formatDateTime(note.updatedAt)}</span>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-2.5 rounded-xl bg-tertiary-fixed p-2.5 text-on-tertiary-fixed-variant shadow-sm">
              <div className="flex items-center gap-0.5 text-tertiary">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">check_circle</span>
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">save</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md leading-none">Tersimpan di Penyimpanan Lokal</span>
                <span className="mt-0.5 font-label-sm text-label-sm opacity-85">Akses offline tersedia</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
            <p className="whitespace-pre-wrap break-words font-body-lg text-body-lg leading-relaxed text-on-surface">
              {note.content}
            </p>
          </div>
        </div>
      )}

      {confirming && note && (
        <ConfirmDialog
          title="Hapus catatan ini?"
          message={`"${note.title}" akan dihapus dari penyimpanan lokal NoteKu. Tindakan ini tidak dapat dibatalkan.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </StackPage>
  )
}
