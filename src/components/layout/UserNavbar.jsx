import { NavLink, Link } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-primary text-white shadow-glow' : 'text-brand-dark/80 hover:bg-white/70 hover:text-brand-dark'}`

export default function UserNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight text-brand-dark">
          <span className="text-brand-primary">Tea</span>petti
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-brand-border bg-white/70 p-1 shadow-sm">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/students" className={linkClass}>
            Students
          </NavLink>
          <NavLink to="/classes" className={linkClass}>
            Classes
          </NavLink>
          <NavLink to="/menu" className={linkClass}>
            Menu
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
