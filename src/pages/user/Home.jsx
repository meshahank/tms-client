import { ArrowRight, Search, Coffee, BookOpen, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

const MARQUEE_ITEMS = ['Fresh Chai', 'Strong Coffee', 'Quick Snacks', 'Campus Evenings', 'Friendly Conversations', 'Masala Tea', 'Bite-sized Treats']

export default function Home() {
  const navigate = useNavigate()
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background accent */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-hero-glow" />

        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-center">
          {/* Left copy */}
          <div className="animate-page space-y-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-greenTint px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-green">Open Now</span>
            </div>

            <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] font-extrabold leading-[0.93] tracking-tight text-brand-dark">
              Where<br />
              Campus<br />
              <span className="text-brand-green">Evenings</span><br />
              Begin
            </h1>

            <p className="text-base text-brand-muted leading-relaxed max-w-sm">
              Your campus coffee shop — fresh brews, quick bites, and a spot to unwind between classes.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => navigate('/students')}
                className="btn btn-primary btn-lg"
              >
                <Search size={15} />
                Check Balance
              </button>
              <button
                onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-ghost btn-lg"
              >
                View Menu
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-5 pt-2">
              {[
                { icon: Coffee,   label: 'Daily Brews',  value: '200+' },
                { icon: BookOpen, label: 'Classes',       value: '12' },
                { icon: Star,     label: 'Rating',        value: '4.9' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-greenTint flex items-center justify-center">
                    <Icon size={14} className="text-brand-green" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-dark leading-none">{value}</p>
                    <p className="text-[10px] text-brand-muted mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative card */}
          <div className="relative hidden lg:flex items-center justify-center animate-scale-in">
            <div className="absolute inset-0 rounded-[2.5rem] bg-brand-greenTint/60 blur-2xl scale-90" />
            <div className="relative w-full rounded-[2.5rem] bg-white border border-brand-border shadow-xl overflow-hidden">
              {/* Top strip */}
              <div className="h-2 w-full bg-gradient-to-r from-brand-green to-brand-amber" />
              <div className="p-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-muted mb-3">Today&apos;s Special</p>
                <h2 className="font-display text-3xl font-extrabold text-brand-dark mb-1">Masala Chai</h2>
                <p className="text-sm text-brand-muted mb-6">Spiced and brewed fresh every morning</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-green">₹10</span>
                  <div className="flex -space-x-2">
                    {['184D47','2E7D68','1A5C54'].map((c) => (
                      <div key={c} className={`h-7 w-7 rounded-full border-2 border-white`} style={{ background: `#${c}` }} />
                    ))}
                    <div className="h-7 w-7 rounded-full border-2 border-white bg-brand-amberTint flex items-center justify-center">
                      <span className="text-[9px] font-bold text-brand-amber">+8</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Coffee image strip */}
              <div className="h-44 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=800&q=80"
                  alt="Coffee"
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-brand-borderLight bg-brand-greenTint/40 overflow-hidden py-2.5">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-4 px-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-mid">
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-brand-amber opacity-60" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Today's Menu ────────────────────────────────────── */}
      <section id="menu-section" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-1.5">Fresh Today</p>
            <h2 className="font-display text-3xl font-extrabold text-brand-dark">
              Today&apos;s <span className="text-brand-green">Menu</span>
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-greenLight transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-stagger">
          {(isLoading ? Array.from({ length: 8 }) : menuItems.slice(0, 8)).map((item, i) =>
            isLoading ? (
              <div key={i} className="aspect-square rounded-2xl skeleton" />
            ) : (
              <MenuItemCard key={item._id ?? item.name} item={item} compact />
            )
          )}
        </div>

        {!isLoading && menuItems.length === 0 && (
          <div className="py-16 text-center text-sm text-brand-subtle">No menu items today</div>
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link to="/menu" className="btn btn-ghost">
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
