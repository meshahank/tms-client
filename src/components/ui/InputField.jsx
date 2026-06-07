export default function InputField({ label, error, className = '', prefix, suffix, ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="mb-2 block text-sm font-semibold text-brand-dark">{label}</span> : null}
      <div className="relative">
        {prefix ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-brand-muted">{prefix}</span> : null}
        <input
          className={`focus-ring w-full rounded-full border border-brand-border bg-white/90 px-4 py-3 text-sm shadow-sm transition placeholder:text-brand-muted/70 ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''} ${error ? 'border-brand-danger/40' : ''}`}
          {...props}
        />
        {suffix ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-brand-muted">{suffix}</span> : null}
      </div>
      {error ? <span className="mt-2 block text-xs font-medium text-brand-danger">{error}</span> : null}
    </label>
  )
}
