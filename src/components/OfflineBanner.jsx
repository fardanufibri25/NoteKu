import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-warning-container p-3 shadow-sm">
      <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[20px] text-warning">cloud_off</span>
      <div className="min-w-0 flex-1">
        <p className="font-label-md text-label-md text-on-warning-container">Mode luring aktif</p>
        <p className="font-body-sm text-body-sm text-on-warning-container/90">
          Catatan tetap bisa dibaca, ditambah, diedit, dan dihapus. Perubahan tersimpan di perangkat.
        </p>
      </div>
      <span className="rounded-full bg-warning-fixed px-2 py-0.5 font-label-sm text-label-sm text-on-warning-fixed">Lokal</span>
    </div>
  )
}
