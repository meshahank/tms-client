export default function GradientBlob({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl animate-drift ${className}`}
      style={{ background: 'radial-gradient(circle, rgba(240,138,36,0.42) 0%, rgba(240,138,36,0.14) 40%, transparent 72%)' }}
    />
  )
}
