export default function UrgencyBadge({ level }) {
  const colors = {
    Low: 'bg-safe/10 text-safe border-safe',
    Medium: 'bg-warning/10 text-warning border-warning',
    High: 'bg-urgent/10 text-urgent border-urgent',
  }
  const cls = colors[level] || 'bg-gray-100 text-gray-600 border-gray-300'
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${cls}`}>
      {level || 'Unknown'} urgency
    </span>
  )
}
