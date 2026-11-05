import { courseTone } from '../lib/format'

export default function CourseBadge({ course, icon = true, className = '' }) {
  const tone = courseTone(course)
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm font-semibold ${tone.badge} ${className}`}>
      {icon && <span aria-hidden="true" className="material-symbols-outlined text-[13px]">school</span>}
      <span className="max-w-[240px] truncate">{course}</span>
    </span>
  )
}
