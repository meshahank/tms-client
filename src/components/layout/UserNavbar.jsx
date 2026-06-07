import { NavLink, Link } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
    isActive
      ? 'bg-brand-primary text-white'
      : 'text-brand-dark/70 hover:text-brand-dark'
  }`

export default function UserNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/[0.06]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="font-display text-base font-bold text-brand-dark tracking-tight">
          <span className="text-brand-primary">Tea</span>petti
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/students" className={linkClass}>Students</NavLink>
          <NavLink to="/classes" className={linkClass}>Classes</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
        </nav>
      </div>
    </header>
  )
}
