const variants = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-ghost',
  ghost: 'btn btn-ghost border-0 hover:bg-brand-greenTint',
  danger: 'btn btn-danger',
  success: 'bg-brand-success text-white btn hover:opacity-90',
  amber: 'btn btn-amber',
}

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
