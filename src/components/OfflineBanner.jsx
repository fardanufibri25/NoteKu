import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-[#FFFBEB] p-3 shadow-sm">
      <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#D97706]">cloud_off</span>
      <div className="min-w-0 flex-1">
        <p className="font-label-md text-label-md text-[#92400E]">Mode luring aktif</p>
        <p className="font-body-sm text-body-sm text-[#92400E]/90">
          Catatan tetap bisa dibaca, ditambah, diedit, dan dihapus. Perubahan tersimpan di perangkat.
        </p>
      </div>
      <span className="rounded-full bg-[#FDE68A] px-2 py-0.5 font-label-sm text-label-sm text-[#78350F]">Lokal</span>
    </div>
  )
}
