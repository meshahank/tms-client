import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-borderLight">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-center">
        <Link to="/" className="font-display text-sm font-bold text-brand-muted tracking-tight">
          <span className="text-brand-amber">Tea</span>petti
        </Link>
      </div>
    </footer>
  )
}
