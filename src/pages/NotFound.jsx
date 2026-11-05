import StackPage from '../components/StackPage'
import EmptyState from '../components/EmptyState'
import { navigate } from '../hooks/useHashRoute'

export default function NotFound() {
  return (
    <StackPage title="Halaman Tidak Ditemukan" onBack={() => navigate('/')}>
      <EmptyState
        icon="explore_off"
        title="Halaman tidak ditemukan"
        message="Alamat yang Anda buka tidak tersedia di NoteKu."
        actionLabel="Kembali ke Beranda"
        onAction={() => navigate('/')}
      />
    </StackPage>
  )
}
