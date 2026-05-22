import { ArrowRight, Search, Coffee, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import GradientBlob from '../../components/ui/GradientBlob'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

const homeFeatures = [
  'Campus credit system',
  'Fast student lookup',
  'Dynamic menu management',
  'Elegant admin controls',
]

export default function Home() {
  const navigate = useNavigate()
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
                <h1 className="font-display text-5xl font-black leading-[0.92] text-brand-dark sm:text-6xl lg:text-7xl">
                  Where Campus <span className="text-gradient">Evenings</span> Begin
                </h1>
                <p className="max-w-2xl text-base leading-7 text-brand-muted sm:text-lg">
                  Teapetti is a premium student credit and menu platform for the campus coffee shop. Search students, manage purchases, and keep the counter moving.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/students')}>
                  <Search size={16} />
                  Search Students
                </Button>
                <Button variant="secondary" onClick={() => document.getElementById('menu-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  View Menu
                  <ArrowRight size={16} />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {homeFeatures.map((feature) => (
                  <Card key={feature} className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                        <Sparkles size={18} />
                      </span>
                      <p className="text-sm font-semibold text-brand-dark">{feature}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="absolute inset-x-0 top-10 mx-auto h-48 w-48 rounded-full bg-brand-primary/15 blur-3xl" />
              <div className="relative flex h-[320px] w-full max-w-md items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-white/80 to-brand-primaryTint shadow-float">
                <div className="relative h-56 w-56">
                  <div className="absolute left-9 top-11 h-32 w-32 rounded-[2rem] bg-gradient-to-br from-brand-primarySoft via-white to-white shadow-soft" />
                  <div className="absolute left-16 top-20 h-20 w-24 rounded-[1.5rem] border-[10px] border-brand-primary/90 bg-transparent" />
                  <div className="absolute bottom-16 right-10 h-12 w-12 rounded-full bg-brand-primary/90 blur-[1px]" />
                  <div className="absolute right-6 top-10 h-16 w-16 rounded-full bg-brand-primary/20 blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[1.6rem] border border-brand-border bg-white/70 py-3 shadow-soft">
          <div className="animate-marquee whitespace-nowrap text-sm font-semibold uppercase tracking-[0.28em] text-brand-primary">
            {[...Array(2)].map((_, index) => (
              <span key={index} className="inline-flex items-center gap-3 px-5">
                Fresh coffee · Tea · Snacks · Student balances · Smart checkout · Menu control
              </span>
            ))}
          </div>
        </section>

        <section id="menu-preview" className="mt-10 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Today’s Menu</p>
              <h2 className="font-display text-3xl font-black text-brand-dark">A polished menu wall for the day</h2>
            </div>
            <Link to="/menu" className="hidden text-sm font-semibold text-brand-primary transition hover:text-brand-dark sm:inline-flex">
              Explore full menu
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(isLoading ? Array.from({ length: 4 }) : menuItems.slice(0, 4)).map((item, index) =>
              isLoading ? (
                <Card key={index} className="aspect-[4/4.5] animate-pulse rounded-card bg-white/70 p-0">
                  <div className="h-full rounded-card bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft shimmer" />
                </Card>
              ) : (
                <MenuItemCard key={item._id ?? item.id ?? item.name} item={item} compact />
              ),
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
