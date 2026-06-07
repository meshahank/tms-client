export default function Badge({ variant = 'green', className = '', children }) {
  const v = {
    green: 'badge-green',
    amber: 'badge-amber',
    red:   'badge-red',
    muted: 'badge-muted',
  }
  return (
    <span className={`badge ${v[variant] ?? v.green} ${className}`}>
      {children}
    </span>
  )
}
