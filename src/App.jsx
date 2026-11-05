import { useHashRoute } from './hooks/useHashRoute'
import { NotesProvider } from './context/NotesContext'
import { ToastProvider } from './context/ToastContext'
import Dashboard from './pages/Dashboard'
import NotesList from './pages/NotesList'
import NoteDetail from './pages/NoteDetail'
import NoteForm from './pages/NoteForm'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function Router() {
  const { path, query } = useHashRoute()

  let page
  if (path === '/') page = <Dashboard />
  else if (path === '/notes') page = <NotesList initialQuery={query.get('q') ?? ''} />
  else if (path === '/new') page = <NoteForm />
  else if (path === '/profile') page = <Profile />
  else {
    const editMatch = path.match(/^\/notes\/([^/]+)\/edit$/)
    const detailMatch = path.match(/^\/notes\/([^/]+)$/)
    if (editMatch) page = <NoteForm id={decodeURIComponent(editMatch[1])} />
    else if (detailMatch) page = <NoteDetail id={decodeURIComponent(detailMatch[1])} />
    else page = <NotFound />
  }

  return <div className="flex min-h-dvh flex-col bg-surface font-body-md text-on-surface antialiased">{page}</div>
}

export default function App() {
  return (
    <ToastProvider>
      <NotesProvider>
        <Router />
      </NotesProvider>
    </ToastProvider>
  )
}
