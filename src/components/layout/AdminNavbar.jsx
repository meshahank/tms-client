import { Link, NavLink } from 'react-router-dom'
import { LogOut, Shield, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { useAuthStore } from '../../store/authStore'

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-primary text-white shadow-glow' : 'text-brand-dark/80 hover:bg-white/70 hover:text-brand-dark'}`

export default function AdminNavbar() {
  const admin = useAuthStore((state) => state.admin)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/admin" className="flex items-center gap-2 font-display text-lg font-extrabold text-brand-dark">
          <span className="text-brand-primary">Tea</span>petti
          <Shield size={17} className="text-brand-primary" />
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-brand-border bg-white/70 p-1 shadow-sm">
          <NavLink to="/admin" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/admin/students" className={linkClass}>
            Students
          </NavLink>
          <NavLink to="/admin/sale" className={linkClass}>
            Sale
          </NavLink>
          <NavLink to="/admin/menu" className={linkClass}>
            Menu
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-brand-border bg-white/80 px-3 py-2 text-sm font-semibold text-brand-dark md:flex">
            <Sparkles size={14} className="text-brand-primary" />
            {admin?.username ?? 'Admin'}
          </div>
          <Button variant="secondary" size="sm" onClick={logout} className="hidden sm:inline-flex">
            <LogOut size={14} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
