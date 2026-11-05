import Header from './Header'
import OfflineBanner from './OfflineBanner'

export default function StackPage({ title, onBack, children }) {
  return (
    <>
      <Header subtitle={title} onBack={onBack} />
      <main className="pt-header pb-safe-content mx-auto w-full max-w-2xl flex-1 px-margin">
        <OfflineBanner />
        {children}
      </main>
    </>
  )
}
