import { ArrowRight, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import MenuItemCard from '../../components/ui/MenuItemCard'
import GradientBlob from '../../components/ui/GradientBlob'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function Home() {
  const navigate = useNavigate()
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <GradientBlob className="left-[-6rem] top-0 h-80 w-80 opacity-60" />
        <GradientBlob className="right-[-4rem] bottom-[-4rem] h-72 w-72 opacity-40" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="font-display text-6xl sm:text-7xl font-black leading-[0.92] text-brand-dark tracking-tight">
              Where<br />
              Campus<br />
              <span className="text-brand-primary">Evenings</span><br />
              Begin
            </h1>
            <p className="text-sm text-brand-muted font-medium">
              Fresh Chai · Strong Coffee · Quick Snacks · Campus Evenings · Friendly Conversations
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/students')}
                className="inline-flex items-center gap-2 bg-brand-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-primary/90 transition-colors"
              >
                <Search size={14} />
                Search
              </button>
              <button
                onClick={() => document.getElementById('menu-preview')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 border border-brand-border bg-white text-brand-dark text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-black/[0.03] transition-colors"
              >
                Menu
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Coffee cup illustration */}
          <div className="relative flex justify-center items-center">
            <div className="absolute h-64 w-64 rounded-full bg-brand-primary/12 blur-3xl" />
            <div className="relative w-full max-w-xs h-72 rounded-[2.5rem] bg-gradient-to-br from-white via-brand-primaryTint/60 to-brand-primarySoft/80 shadow-soft border border-white/60 flex items-center justify-center">
              <div className="relative">
                {/* Cup body */}
                <div className="h-36 w-28 rounded-b-[2.5rem] bg-gradient-to-b from-brand-primarySoft to-white shadow-md border border-brand-warm/40" />
                {/* Handle */}
                <div className="absolute -right-5 top-8 h-10 w-5 rounded-r-full border-[3px] border-brand-primarySoft" />
                {/* Coffee surface */}
                <div className="absolute left-1/2 top-0 h-5 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7B3D0E] to-[#4A2008]" />
                {/* Steam */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex gap-2">
                  <div className="h-6 w-1.5 rounded-full bg-white/50 blur-sm animate-drift" />
                  <div className="h-8 w-1.5 rounded-full bg-white/40 blur-sm animate-drift" style={{ animationDelay: '0.6s' }} />
                  <div className="h-5 w-1.5 rounded-full bg-white/30 blur-sm animate-drift" style={{ animationDelay: '1.1s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-b border-black/[0.06] bg-white/60 overflow-hidden py-3">
          <div className="animate-marquee whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-primary">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-5 px-6">
                <span>Fresh Chai</span><span className="text-brand-muted opacity-40">·</span>
                <span>Strong Coffee</span><span className="text-brand-muted opacity-40">·</span>
                <span>Quick Snacks</span><span className="text-brand-muted opacity-40">·</span>
                <span>Campus Evenings</span><span className="text-brand-muted opacity-40">·</span>
                <span>Friendly Conversations</span><span className="text-brand-muted opacity-40">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Menu */}
      <section id="menu-preview" className="mx-auto max-w-6xl px-6 py-14 space-y-8">
        <h2 className="text-center font-display text-4xl font-black text-brand-dark">
          Today&apos;s <span className="text-brand-primary">Menu</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(isLoading ? Array.from({ length: 8 }) : menuItems.slice(0, 8)).map((item, i) =>
            isLoading ? (
              <div
                key={i}
                className="aspect-square rounded-[1.4rem] bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft animate-pulse"
              />
            ) : (
              <MenuItemCard key={item._id ?? item.name} item={item} compact />
            )
          )}
        </div>

        {menuItems.length > 8 && (
          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 border border-brand-border bg-white text-brand-dark text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-black/[0.03] transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
