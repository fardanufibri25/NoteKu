const ITEMS = [
  { key: 'dashboard', href: '#/', icon: 'dashboard', label: 'Beranda' },
  { key: 'notes', href: '#/notes', icon: 'menu_book', label: 'Catatan' },
  { key: 'profile', href: '#/profile', icon: 'person', label: 'Profil' },
]

export default function BottomNav({ active }) {
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/95 shadow-nav backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-around px-space-xs">
        {ITEMS.map((item) => {
          const isActive = item.key === active
          return (
            <a
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[44px] min-w-[64px] flex-col items-center justify-center rounded-lg py-1 transition-colors ${
                isActive ? 'text-primary-container' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">{item.icon}</span>
              <span className="mt-0.5 font-label-sm text-label-sm">{item.label}</span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
