export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-brand-primary text-white shadow-glow hover:-translate-y-0.5 hover:shadow-float',
    secondary: 'bg-white text-brand-dark border border-brand-border hover:border-brand-primary/30 hover:bg-brand-primaryTint',
    ghost: 'bg-transparent text-brand-dark hover:bg-black/5',
    danger: 'bg-brand-danger text-white shadow-glow hover:-translate-y-0.5',
    success: 'bg-brand-success text-white shadow-glow hover:-translate-y-0.5',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
