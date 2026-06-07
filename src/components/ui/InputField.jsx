export default function InputField({ label, error, className = '', prefix, suffix, ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
          {label}
        </span>
      )}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-subtle">
            {prefix}
          </span>
        )}
        <input
          className={`input-base focus-ring ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''} ${error ? '!border-brand-danger/50' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-subtle">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span className="mt-1.5 block text-[11px] font-medium text-brand-danger">{error}</span>
      )}
    </label>
  )
}
