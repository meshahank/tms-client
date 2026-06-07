import { Link, NavLink } from 'react-router-dom'
import { LogOut, ChevronDown, LayoutDashboard, Users, ShoppingCart, UtensilsCrossed, BarChart2, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students',  icon: Users },
  { to: '/admin/sale',     label: 'Sale',       icon: ShoppingCart },
  { to: '/admin/menu',     label: 'Menu',       icon: UtensilsCrossed },
]
const MORE_NAV = [
  { to: '/admin/reports', label: 'Reports',   icon: BarChart2 },
  { to: '/admin/debt',    label: 'Debt View', icon: TrendingDown },
]

export default function AdminNavbar() {
  const admin   = useAuthStore((s) => s.admin)
  const logout  = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-brand-dark/98 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="h-[2.5px] w-full bg-gradient-to-r from-brand-green via-brand-amber to-brand-green opacity-60" />
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link to="/admin" className="font-display text-[15px] font-bold flex items-center gap-1">
          <span className="text-brand-amber">Tea</span>
          <span className="text-white">petti</span>
          <span className="ml-2 text-[10px] font-semibold tracking-widest uppercase text-white/30 border border-white/10 rounded px-1.5 py-0.5 leading-none">Admin</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/85 hover:bg-white/[0.06]'
                }`
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-white/50 hover:text-white/85 hover:bg-white/[0.06] rounded-lg transition-all duration-200"
            >
              More
              <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-white/10 bg-brand-dark shadow-2xl overflow-hidden">
                  <div className="p-1">
                    {MORE_NAV.map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors ${
                            isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                          }`
                        }
                      >
                        <Icon size={13} />
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-brand-green/80 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white uppercase">{(admin?.username ?? 'A')[0]}</span>
            </div>
            <span className="text-[13px] font-medium text-white/50">{admin?.username ?? 'Admin'}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white/80 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
