export const COURSES = [
  'Jaringan Komputer',
  'Sistem Digital',
  'Pemrograman Perangkat Bergerak',
  'Basis Data',
  'Kecerdasan Buatan',
]

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
})

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta',
})

export function formatDate(iso) {
  if (!iso) return '-'
  return dateFormatter.format(new Date(iso))
}

export function formatDateTime(iso) {
  if (!iso) return '-'
  const date = new Date(iso)
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)} WIB`
}

export function timeAgo(iso) {
  if (!iso) return '-'
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} mnt lalu`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  return formatDate(iso)
}

export function readingMinutes(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return words === 0 ? 0 : Math.max(1, Math.ceil(words / 150))
}

const TONES = [
  { badge: 'bg-primary-fixed text-on-primary-fixed', dot: 'bg-primary' },
  { badge: 'bg-secondary-fixed text-on-secondary-fixed', dot: 'bg-secondary' },
  { badge: 'bg-tertiary-fixed text-on-tertiary-fixed', dot: 'bg-tertiary' },
  { badge: 'bg-primary-fixed-dim text-on-primary-fixed', dot: 'bg-primary-container' },
]

export function courseTone(course = '') {
  let hash = 0
  for (let i = 0; i < course.length; i += 1) hash = (hash * 31 + course.charCodeAt(i)) >>> 0
  return TONES[hash % TONES.length]
}
