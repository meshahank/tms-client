export default function Badge({ className = '', children }) {
  return <span className={`badge-chip inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${className}`}>{children}</span>
}
