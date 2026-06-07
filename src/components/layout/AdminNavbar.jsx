import { Link, NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const LINKS = [
  { to: '/admin',          label: 'Home',     end: true },
  { to: '/admin/students', label: 'Students'            },
  { to: '/admin/sale',     label: 'Sale'                },
  { to: '/admin/menu',     label: 'Menu'                },
]

export default function AdminNavbar() {
  const admin  = useAuthStore((s) => s.admin)
  const logout = useAuthStore((s) => s.logout)

  return (
    <header className="sticky top-0 z-40 bg-brand-beige/90 backdrop-blur-md border-b border-brand-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-[54px]">
        <Link
          to="/admin"
          className="font-display text-[15px] font-bold text-brand-dark tracking-tight"
        >
          <span className="text-brand-amber">Tea</span>petti
        </Link>

        <nav className="flex items-center gap-0.5">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'rounded-full bg-brand-amber px-3.5 py-1 text-[13px] font-semibold text-brand-ink'
                  : 'rounded-full px-3.5 py-1 text-[13px] font-medium text-brand-mid transition-colors hover:text-brand-dark'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-[13px] font-medium text-brand-muted transition-colors hover:text-brand-dark"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
