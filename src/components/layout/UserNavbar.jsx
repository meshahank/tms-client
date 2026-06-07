import { NavLink, Link } from 'react-router-dom'

export default function UserNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-brand-border">
      {/* Green accent line at very top */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-brand-green via-brand-amber to-brand-green opacity-70" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
        <Link to="/" className="font-display text-[15px] font-bold text-brand-dark tracking-tight flex items-center gap-1">
          <span className="text-brand-green">Tea</span>
          <span>petti</span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {[
            { to: '/',         label: 'Home',     end: true },
            { to: '/students', label: 'Students'           },
            { to: '/classes',  label: 'Classes'            },
            { to: '/menu',     label: 'Menu'               },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative px-3.5 py-1.5 text-[13.5px] font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-greenTint text-brand-green font-semibold'
                    : 'text-brand-mid hover:text-brand-dark hover:bg-brand-greenTint/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
