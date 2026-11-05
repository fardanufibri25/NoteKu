const TITLES = [
  [/^\/$/, 'Dashboard'],
  [/^\/notes$/, 'Catatan'],
  [/^\/new$/, 'Catatan Baru'],
  [/^\/profile$/, 'Profil'],
  [/^\/notes\/[^/]+\/edit$/, 'Edit Catatan'],
  [/^\/notes\/[^/]+$/, 'Detail Catatan'],
]

export function pageTitle(path) {
  const match = TITLES.find(([pattern]) => pattern.test(path))
  return `${match ? match[1] : 'Halaman Tidak Ditemukan'} — NoteKu`
}
