import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-brand-borderLight mt-16">
      <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between">
        <Link to="/" className="font-display text-sm font-bold text-brand-mid flex items-center gap-0.5">
          <span className="text-brand-green">Tea</span>petti
        </Link>
        <p className="text-xs text-brand-subtle">Campus Coffee Management</p>
      </div>
    </footer>
  )
}
