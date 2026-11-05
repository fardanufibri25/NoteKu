import { useMemo, useState } from 'react'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { navigate } from '../hooks/useHashRoute'
import { COURSES, readingMinutes } from '../lib/format'
import StackPage from '../components/StackPage'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'

export default function NoteForm({ id }) {
  const { notes, loading, addNote, updateNote } = useNotes()
  const backTo = () => navigate(id ? `/notes/${id}` : '/notes')

  if (loading) {
    return (
      <StackPage title={id ? 'Edit Catatan' : 'Catatan Baru'} onBack={backTo}>
        <Loading message="Menyiapkan form..." />
      </StackPage>
    )
  }

  const note = id ? notes.find((item) => item.id === id) : null
  if (id && !note) {
    return (
      <StackPage title="Edit Catatan" onBack={() => navigate('/notes')}>
        <EmptyState
          icon="search_off"
          title="Catatan tidak ditemukan"
          message="Catatan ini sudah dihapus atau tidak tersedia di perangkat ini."
          actionLabel="Kembali ke Catatan"
          onAction={() => navigate('/notes')}
        />
      </StackPage>
    )
  }

  return <NoteFormInner key={note?.id ?? 'new'} note={note} addNote={addNote} updateNote={updateNote} />
}

function NoteFormInner({ note, addNote, updateNote }) {
  const showToast = useToast()
  const online = useOnlineStatus()
  const initialCourse = note?.course ?? COURSES[0]

  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [course, setCourse] = useState(initialCourse)
  const [customCourse, setCustomCourse] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const courseOptions = useMemo(() => {
    const options = [...COURSES]
    if (note?.course && !options.includes(note.course)) options.push(note.course)
    return options
  }, [note?.course])

  const effectiveCourse = course === '__new__' ? customCourse.trim() : course
  const titleValid = title.trim().length >= 5
  const hasChanges =
    title !== (note?.title ?? '') ||
    content !== (note?.content ?? '') ||
    effectiveCourse !== initialCourse

  const leave = () => navigate(note ? `/notes/${note.id}` : '/notes')
  const handleBack = () => {
    if (hasChanges && !saving) setConfirmCancel(true)
    else leave()
  }

  function validate() {
    const next = {}
    if (title.trim().length < 5) next.title = 'Judul wajib diisi (minimal 5 karakter).'
    if (!effectiveCourse) next.course = 'Mata kuliah wajib dipilih.'
    if (!content.trim()) next.content = 'Isi catatan wajib diisi.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate() || saving) return
    setSaving(true)
    try {
      const payload = { title: title.trim(), course: effectiveCourse, content: content.trim() }
      const saved = note ? await updateNote(note.id, payload) : await addNote(payload)
      showToast(note ? 'Catatan berhasil diperbarui.' : 'Catatan berhasil disimpan.')
      navigate(`/notes/${saved.id}`)
    } catch (err) {
      console.error(err)
      showToast('Catatan gagal disimpan. Data Anda masih ada di form.', 'error')
      setSaving(false)
    }
  }

  return (
    <StackPage title={note ? 'Edit Catatan' : 'Catatan Baru'} onBack={handleBack}>
      <div className="mb-space-sm flex items-center justify-between rounded-xl bg-surface-container-low px-space-sm py-2">
        <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary">{online ? 'cloud_done' : 'cloud_off'}</span>
          <span>{online ? 'Tersimpan otomatis di perangkat' : 'Mode luring • tetap tersimpan di perangkat'}</span>
        </div>
        <div className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed-dim" />
          <span>Lokal</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface" htmlFor="noteTitle">
              Judul Catatan <span className="font-bold text-error">*</span>
            </label>
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-label-sm text-label-sm ${
                titleValid ? 'bg-tertiary-fixed/25 text-tertiary' : 'bg-error-container/40 text-error'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{titleValid ? 'check_circle' : 'error'}</span>
              <span>{titleValid ? 'Valid' : 'Kurang'}</span>
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              id="noteTitle"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (errors.title) setErrors((current) => ({ ...current, title: undefined }))
              }}
              aria-invalid={Boolean(errors.title)}
              className={`h-12 w-full rounded-xl bg-surface-container-lowest px-space-md pr-10 font-body-md text-body-md text-on-surface shadow-sm outline-none transition-all placeholder:text-outline-variant focus:ring-2 ${
                errors.title ? 'ring-2 ring-error/60' : 'focus:ring-primary-container/40'
              }`}
              placeholder="Masukkan judul catatan kuliah..."
              type="text"
              autoComplete="off"
            />
            {titleValid && (
              <span className="pointer-events-none absolute right-3 flex items-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
              </span>
            )}
          </div>
          {errors.title ? (
            <p className="flex items-center gap-1 font-body-sm text-body-sm text-error">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              {errors.title}
            </p>
          ) : (
            <p className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Judul wajib diisi (minimal 5 karakter)
            </p>
          )}
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface" htmlFor="courseSelect">
              Mata Kuliah <span className="font-bold text-error">*</span>
            </label>
            <span className="font-label-sm text-label-sm font-medium text-secondary">Tersimpan lokal</span>
          </div>
          <div className="relative">
            <select
              id="courseSelect"
              value={course}
              onChange={(event) => {
                setCourse(event.target.value)
                if (errors.course) setErrors((current) => ({ ...current, course: undefined }))
              }}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl bg-surface-container-lowest px-space-md pr-10 font-body-md text-body-md text-on-surface shadow-sm outline-none focus:ring-2 focus:ring-primary-container/40"
            >
              {courseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="__new__" className="font-semibold text-primary">
                + Tambah Mata Kuliah Baru
              </option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px]">keyboard_arrow_down</span>
            </div>
          </div>
          {course === '__new__' && (
            <input
              value={customCourse}
              onChange={(event) => {
                setCustomCourse(event.target.value)
                if (errors.course) setErrors((current) => ({ ...current, course: undefined }))
              }}
              aria-label="Nama mata kuliah baru"
              className="h-12 w-full rounded-xl bg-surface-container-lowest px-space-md font-body-md text-body-md text-on-surface shadow-sm outline-none placeholder:text-outline-variant focus:ring-2 focus:ring-primary-container/40"
              placeholder="Nama mata kuliah baru..."
              type="text"
              autoComplete="off"
            />
          )}
          {errors.course && (
            <p className="flex items-center gap-1 font-body-sm text-body-sm text-error">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              {errors.course}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface" htmlFor="noteContent">
              Isi Materi Catatan <span className="font-bold text-error">*</span>
            </label>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Teks biasa</span>
          </div>
          <textarea
            id="noteContent"
            value={content}
            onChange={(event) => {
              setContent(event.target.value)
              if (errors.content) setErrors((current) => ({ ...current, content: undefined }))
            }}
            aria-invalid={Boolean(errors.content)}
            className={`w-full resize-y rounded-2xl bg-surface-container-lowest p-space-md font-body-md text-body-md leading-relaxed text-on-surface shadow-sm outline-none transition-all placeholder:text-outline-variant focus:ring-2 ${
              errors.content ? 'ring-2 ring-error/60' : 'focus:ring-primary-container/40'
            }`}
            placeholder="Tulis ringkasan materi kuliah, rumus, atau catatan praktikum di sini..."
            rows="11"
          />
          {errors.content ? (
            <p className="flex items-center gap-1 font-body-sm text-body-sm text-error">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              {errors.content}
            </p>
          ) : (
            <div className="mt-1 flex items-center justify-between px-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">short_text</span>
                {content.length} karakter • Estimasi baca: {readingMinutes(content)} menit
              </span>
              <span className="flex items-center gap-0.5 text-tertiary">
                <span className="material-symbols-outlined text-[14px]">offline_bolt</span>
                Luring aman
              </span>
            </div>
          )}
          <p className="flex items-start gap-1.5 rounded-lg bg-surface-container-low p-2 font-body-sm text-body-sm text-on-surface-variant/80">
            <span className="material-symbols-outlined mt-0.5 shrink-0 text-[16px] text-primary">save_as</span>
            <span>Setelah disimpan, catatan tersedia di perangkat ini dan bisa dibuka tanpa internet.</span>
          </p>
        </div>

        <div className="mt-space-xs flex flex-col gap-space-sm pt-space-xs">
          <button
            type="submit"
            disabled={saving}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-label-lg text-label-lg text-on-primary shadow-md transition-all hover:bg-primary-container active:scale-[0.99] disabled:opacity-70"
          >
            <span className={`material-symbols-outlined text-[20px] ${saving ? 'animate-spin' : ''}`}>
              {saving ? 'refresh' : 'check'}
            </span>
            <span>{saving ? 'Menyimpan...' : note ? 'Simpan Perubahan' : 'Simpan Catatan'}</span>
          </button>
          <button
            type="button"
            onClick={handleBack}
            disabled={saving}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-surface-container-high font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-highest disabled:opacity-70"
          >
            Batal
          </button>
        </div>
      </form>

      {confirmCancel && (
        <ConfirmDialog
          title="Buang perubahan?"
          message="Perubahan pada form ini belum disimpan dan akan hilang jika Anda keluar."
          confirmLabel="Ya, Buang"
          cancelLabel="Lanjut Mengedit"
          danger={false}
          onConfirm={leave}
          onCancel={() => setConfirmCancel(false)}
        />
      )}
    </StackPage>
  )
}
