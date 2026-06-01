import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-white/50">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-sm font-bold text-brand-dark">
          <span className="text-brand-primary">Tea</span>petti
        </Link>
      </div>
    </footer>
  )
}
