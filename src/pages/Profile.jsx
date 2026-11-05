import { useEffect, useState } from 'react'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { formatDate } from '../lib/format'
import TabPage from '../components/TabPage'

const PROFILE = {
  name: 'Fardanu Fibri Alfarizi',
  nim: '21120124110105',
  kelompok: 'Kelompok 35',
  prodi: 'Teknik Komputer',
  kampus: 'Universitas Diponegoro (UNDIP)',
}

function formatSize(bytes) {
  if (!bytes) return '0 MB'
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Profile() {
  const { notes } = useNotes()
  const showToast = useToast()
  const { canInstall, installed, install } = useInstallPrompt()
  const [storage, setStorage] = useState(null)
  const [swReady, setSwReady] = useState(false)

  useEffect(() => {
    navigator.storage
      ?.estimate?.()
      .then(setStorage)
      .catch(() => setStorage(null))
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => setSwReady(false))
  }, [])

  const courses = new Set(notes.map((note) => note.course)).size
  const usedPercent = storage?.quota ? Math.min(100, (storage.usage / storage.quota) * 100) : 0

  async function handleInstall() {
    const accepted = await install()
    if (accepted) showToast('NoteKu berhasil dipasang.')
  }

  function exportNotes() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `NoteKu-${PROFILE.nim}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast(`${notes.length} catatan diekspor ke JSON.`)
  }

  return (
    <TabPage subtitle="Profil" active="profile">
      <div className="flex items-center justify-between pt-space-xs">
        <div className="flex items-center gap-space-xs">
          <h1 className="font-headline-md text-headline-md text-on-surface">Profil Mahasiswa</h1>
          <span className="inline-flex items-center rounded-full bg-tertiary-fixed px-2 py-0.5 font-label-sm text-label-sm text-on-tertiary-fixed-variant">
            Akademik
          </span>
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${
            swReady ? 'bg-surface-container text-primary-container' : 'bg-surface-container text-on-surface-variant'
          }`}
          title={swReady ? 'Service worker aktif' : 'Service worker belum aktif'}
        >
          <span className="material-symbols-outlined text-[20px]">{swReady ? 'offline_pin' : 'sync_problem'}</span>
        </span>
      </div>

      <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex items-start gap-space-md">
          <div className="relative shrink-0">
            <img
              src="/avatar.svg"
              alt={`Avatar ${PROFILE.name}`}
              className="h-20 w-20 rounded-2xl bg-surface-container object-cover shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-on-tertiary">
              <span className="material-symbols-outlined text-[13px]">verified</span>
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-tertiary-fixed px-2.5 py-0.5 font-label-sm text-label-sm text-on-tertiary-fixed-variant">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
              Mahasiswa Aktif
            </span>
            <h2 className="truncate font-headline-sm text-headline-sm text-on-surface">{PROFILE.name}</h2>
            <p className="mt-0.5 truncate font-label-md text-label-md text-primary">{PROFILE.prodi}</p>
            <p className="truncate font-body-sm text-body-sm text-on-surface-variant">{PROFILE.kampus}</p>
          </div>
        </div>

        <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-sm">
          {[
            ['badge', 'NIM', PROFILE.nim],
            ['groups', 'Kelompok', PROFILE.kelompok],
            ['school', 'Program Studi', PROFILE.prodi],
            ['account_balance', 'Kampus', 'UNDIP, Semarang'],
          ].map(([icon, label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest px-2 py-1.5 shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-outline">{icon}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
              </div>
              <span className="truncate text-right font-label-md text-label-md text-on-surface">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-space-xs">
        <span className="px-1 font-label-md text-label-md text-on-surface-variant">Ringkasan Kuliah</span>
        <div className="grid grid-cols-3 gap-space-xs">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed-variant">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface">{notes.length}</span>
            <span className="mt-0.5 font-label-sm text-label-sm leading-tight text-on-surface-variant">Catatan Dibuat</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed-variant">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface">{courses}</span>
            <span className="mt-0.5 font-label-sm text-label-sm leading-tight text-on-surface-variant">Mata Kuliah</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-lowest p-3 text-center shadow-sm">
            <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-[18px]">offline_pin</span>
            </div>
            <span className="font-headline-md text-headline-md text-tertiary">{swReady ? '100%' : '—'}</span>
            <span className="mt-0.5 font-label-sm text-label-sm leading-tight text-on-surface-variant">Offline Siap</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[22px] text-primary-container">devices</span>
            <span className="font-label-lg text-label-lg text-on-surface">PWA &amp; Penyimpanan</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm text-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-[12px]">check_circle</span>
            {installed ? 'Terpasang' : 'PWA Aktif'}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container-low p-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Penyimpanan aplikasi</span>
            <span className="font-label-sm text-label-sm font-medium text-on-surface">
              {storage ? `${formatSize(storage.usage)} / ${formatSize(storage.quota)}` : 'Tidak tersedia'}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-primary-container transition-all duration-500" style={{ width: `${usedPercent}%` }} />
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">offline_bolt</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Catatan dan aset aplikasi tersedia tanpa internet
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Aplikasi</span>
            <span className="font-label-sm text-label-sm text-on-surface">NoteKu — Catatan Kuliah</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Versi</span>
            <span className="font-label-sm text-label-sm text-on-surface">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Service Worker</span>
            <span className={`font-label-sm text-label-sm ${swReady ? 'text-tertiary' : 'text-on-surface-variant'}`}>
              {swReady ? 'Aktif' : 'Menyiapkan...'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Catatan terakhir diperbarui</span>
            <span className="font-label-sm text-label-sm text-tertiary">
              {notes[0] ? formatDate(notes[0].updatedAt) : 'Belum ada'}
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-space-sm">
        {canInstall ? (
          <button
            type="button"
            onClick={handleInstall}
            className="flex h-12 w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container font-label-lg text-label-lg text-on-primary shadow-sm transition-colors hover:bg-primary"
          >
            <span className="material-symbols-outlined text-[20px]">install_mobile</span>
            <span>Install NoteKu</span>
          </button>
        ) : (
          <p className="flex items-start gap-2 rounded-xl bg-surface-container px-3 py-2.5 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">info</span>
            <span>
              {installed
                ? 'NoteKu sudah terpasang di perangkat ini.'
                : 'Untuk memasang NoteKu, buka menu browser lalu pilih "Install app" atau "Add to Home screen".'}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={exportNotes}
          className="flex h-12 w-full items-center justify-center gap-space-xs rounded-xl bg-surface-container font-label-lg text-label-lg text-primary transition-colors hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          <span>Cadangkan Catatan (Export JSON)</span>
        </button>
      </section>

      <p className="px-1 text-center font-body-sm text-body-sm text-on-surface-variant/80">
        Data profil dan catatan hanya tersimpan di perangkat ini.
      </p>
    </TabPage>
  )
}
