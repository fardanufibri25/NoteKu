import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function ConnectivityBanner() {
  const online = useOnlineStatus()

  if (!online) {
    return (
      <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-[#FFFBEB] px-3 py-2 shadow-sm">
        <div className="flex min-w-0 items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#D97706]">cloud_off</span>
          <span className="font-label-sm text-label-sm text-[#92400E]">Mode luring • Data tersimpan di perangkat</span>
        </div>
        <span className="shrink-0 rounded-full bg-[#FDE68A] px-2 py-0.5 font-label-sm text-label-sm font-semibold text-[#78350F]">
          Offline
        </span>
      </div>
    )
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-tertiary-fixed px-3 py-2 text-on-tertiary-fixed-variant shadow-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">cloud_done</span>
        <span className="font-label-sm text-label-sm">Offline-ready • Data tersimpan di perangkat</span>
      </div>
      <span className="shrink-0 font-label-sm text-label-sm font-semibold">Aktif</span>
    </div>
  )
}
