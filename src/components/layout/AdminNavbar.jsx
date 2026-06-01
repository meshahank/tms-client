import { Link, NavLink } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

const linkClass = ({ isActive }) =>
  `px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
    isActive
      ? 'bg-brand-primary text-white'
      : 'text-brand-dark/70 hover:text-brand-dark'
  }`

export default function AdminNavbar() {
  const admin = useAuthStore((state) => state.admin)
  const logout = useAuthStore((state) => state.logout)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/admin" className="font-display text-base font-bold text-brand-dark tracking-tight">
          <span className="text-brand-primary">Tea</span>petti
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/admin" className={linkClass} end>Home</NavLink>
          <NavLink to="/admin/students" className={linkClass}>Students</NavLink>
          <NavLink to="/admin/sale" className={linkClass}>Sale</NavLink>
          <NavLink to="/admin/menu" className={linkClass}>Menu</NavLink>

          {/* More dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-brand-dark/70 hover:text-brand-dark rounded-full transition-colors"
            >
              More
              <ChevronDown size={13} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-black/[0.08] bg-white shadow-float py-1.5">
                  <NavLink
                    to="/admin/reports"
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-dark hover:bg-black/[0.04]'}`
                    }
                  >
                    Reports
                  </NavLink>
                  <NavLink
                    to="/admin/debt"
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-brand-primary' : 'text-brand-dark hover:bg-black/[0.04]'}`
                    }
                  >
                    Debt View
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-brand-muted hidden sm:block">
            {admin?.username ?? 'Admin'}
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
