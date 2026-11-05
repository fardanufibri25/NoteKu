import { useEffect, useState } from 'react'
import { formatDate, readingMinutes, timeAgo } from '../lib/format'
import { navigate } from '../hooks/useHashRoute'
import CourseBadge from './CourseBadge'

export default function NoteCard({ note, recent = false, onRequestDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const detailHref = `#/notes/${note.id}`

  useEffect(() => {
    if (!menuOpen) return undefined
    const close = () => setMenuOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  return (
    <article className="relative flex flex-col gap-2.5 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-space-xs">
          <CourseBadge course={note.course} />
          <span className="flex items-center gap-0.5 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[13px]">{recent ? 'schedule' : 'calendar_today'}</span>
            {recent ? timeAgo(note.updatedAt) : formatDate(note.updatedAt)}
          </span>
        </div>
        {onRequestDelete && (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label={`Aksi untuk ${note.title}`}
              aria-expanded={menuOpen}
              onClick={(event) => {
                event.stopPropagation()
                setMenuOpen((open) => !open)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-9 z-30 w-36 rounded-xl bg-surface-container-lowest py-1.5 shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/notes/${note.id}/edit`)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                  Edit Catatan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onRequestDelete(note)
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left font-label-md text-label-md text-error hover:bg-error-container"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Hapus
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <a href={detailHref} className="group min-w-0">
        <h2 className="line-clamp-1 font-headline-sm text-headline-sm tracking-tight text-on-surface group-hover:text-primary">
          {note.title}
        </h2>
        <p className="mt-1.5 line-clamp-2 font-body-md text-body-md text-on-surface-variant">{note.content}</p>
      </a>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex min-w-0 items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
          <span className="truncate">Tersimpan lokal</span>
          <span className="hidden sm:inline">• {readingMinutes(note.content)} mnt baca</span>
        </div>
        <a
          href={detailHref}
          className="flex shrink-0 items-center gap-0.5 font-label-md text-label-md text-primary hover:underline"
        >
          Baca
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </a>
      </div>
    </article>
  )
}
