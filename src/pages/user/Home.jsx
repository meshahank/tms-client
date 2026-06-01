import { ArrowRight, Search, Coffee } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import GradientBlob from '../../components/ui/GradientBlob'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function Home() {
  const navigate = useNavigate()
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/65 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-[-4rem] top-0 h-60 w-60" />
          <GradientBlob className="bottom-[-5rem] right-[-3rem] h-72 w-72" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">
                <Coffee size={14} className="text-brand-primary" />
                Campus coffee system
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-5xl font-black leading-[0.95] text-brand-dark sm:text-6xl lg:text-7xl">
                  Where Campus{' '}
                  <span className="text-gradient">Evenings</span>{' '}
                  Begin
                </h1>
                <p className="max-w-xl text-base leading-7 text-brand-muted sm:text-lg">
                  Fresh Chai · Snacks · Strong Coffee · Campus Evenings · Friendly Conversations
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/students')}>
                  <Search size={16} />
                  Search
                </Button>
                <Button variant="secondary" onClick={() => document.getElementById('menu-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  Menu
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-x-0 top-10 mx-auto h-48 w-48 rounded-full bg-brand-primary/15 blur-3xl" />
              <div className="relative flex h-[320px] w-full max-w-md items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-white/80 to-brand-primaryTint shadow-float">
                {/* Coffee cup illustration */}
                <div className="relative">
                  <div className="h-40 w-32 rounded-b-[3rem] bg-gradient-to-b from-brand-primarySoft to-white shadow-lg" />
                  <div className="absolute -right-6 top-8 h-12 w-6 rounded-full border-4 border-brand-primarySoft bg-transparent" />
                  <div className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8B4513] to-[#5D3010]" />
                  <div className="absolute left-1/2 -top-4 h-8 w-20 -translate-x-1/2">
                    <div className="absolute left-2 h-6 w-2 animate-drift rounded-full bg-white/60 blur-sm" />
                    <div className="absolute left-8 h-8 w-2 animate-drift rounded-full bg-white/50 blur-sm" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute right-2 h-5 w-2 animate-drift rounded-full bg-white/40 blur-sm" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Strip */}
        <section className="mt-6 overflow-hidden rounded-[1.6rem] border border-brand-border bg-white/70 py-3 shadow-soft">
          <div className="animate-marquee whitespace-nowrap text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">
            {[...Array(2)].map((_, index) => (
              <span key={index} className="inline-flex items-center gap-4 px-6">
                <span>Fresh Chai</span>
                <span className="text-brand-muted">·</span>
                <span>Strong Coffee</span>
                <span className="text-brand-muted">·</span>
                <span>Quick Snacks</span>
                <span className="text-brand-muted">·</span>
                <span>Campus Evenings</span>
                <span className="text-brand-muted">·</span>
                <span>Friendly Conversations</span>
                <span className="text-brand-muted">·</span>
              </span>
            ))}
          </div>
        </section>

        {/* Today's Menu Section */}
        <section id="menu-preview" className="mt-10 space-y-6">
          <div className="text-center">
            <h2 className="font-display text-4xl font-black text-brand-dark">
              Today&apos;s <span className="text-gradient">Menu</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(isLoading ? Array.from({ length: 8 }) : menuItems.slice(0, 8)).map((item, index) =>
              isLoading ? (
                <Card key={index} className="aspect-[4/4.5] animate-pulse rounded-card bg-white/70 p-0">
                  <div className="h-full rounded-card bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft shimmer" />
                </Card>
              ) : (
                <MenuItemCard key={item._id ?? item.id ?? item.name} item={item} compact />
              ),
            )}
          </div>

          {menuItems.length > 8 && (
            <div className="text-center">
              <Link to="/menu">
                <Button variant="secondary">
                  View all menu items
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
