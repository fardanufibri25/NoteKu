import Header from './Header'
import BottomNav from './BottomNav'
import OfflineBanner from './OfflineBanner'

export default function TabPage({ subtitle, active, showOffline = true, children }) {
  return (
    <>
      <Header subtitle={subtitle} />
      <main tabIndex={-1} className="pt-header mx-auto w-full max-w-3xl flex-1 px-margin pb-tab outline-none">
        {showOffline && <OfflineBanner />}
        {children}
      </main>
      <BottomNav active={active} />
    </>
  )
}
