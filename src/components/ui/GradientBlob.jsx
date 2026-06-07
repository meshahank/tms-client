export default function GradientBlob({ className = '', amber = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background: amber
          ? 'radial-gradient(circle, rgba(233,180,76,0.20) 0%, rgba(233,180,76,0.06) 55%, transparent 80%)'
          : 'radial-gradient(circle, rgba(24,77,71,0.10) 0%, rgba(24,77,71,0.03) 55%, transparent 80%)',
      }}
    />
  )
}
