import { useState } from 'react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import MenuItemCard from '../../components/ui/MenuItemCard'
import GradientBlob from '../../components/ui/GradientBlob'
import { useMenuItems } from '../../hooks/useMenuItems'

const CATEGORIES = ['All', 'Coffee', 'Tea', 'Snacks', 'Other']

export default function Menu() {
  const [category, setCategory] = useState('All')
  const { data: items = [], isLoading } = useMenuItems(true)

  const filtered = category === 'All'
    ? items
    : items.filter((i) => (i.category ?? '').toLowerCase() === category.toLowerCase())

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 text-center">
        <GradientBlob className="left-[-8rem] top-0 h-96 w-96 opacity-50" />
        <GradientBlob className="right-[-6rem] top-12 h-72 w-72 opacity-40" amber />

        <div className="relative mx-auto max-w-xl px-6 animate-page">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-3">What We Serve</p>
          <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] font-extrabold leading-[0.9] text-brand-dark mb-4">
            Our <span className="text-brand-green">Menu</span>
          </h1>
          <p className="text-base text-brand-muted max-w-xs mx-auto leading-relaxed">
            Freshly brewed every day. Simple, delicious, campus-priced.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[64px] z-10 bg-brand-paper/80 backdrop-blur-md border-b border-brand-borderLight">
        <div className="mx-auto max-w-6xl px-6 flex gap-1.5 py-2.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-brand-green text-white shadow-sm'
                  : 'text-brand-mid hover:bg-brand-greenTint'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 py-10 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-stagger">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl skeleton" />
              ))
            : filtered.map((item) => (
                <MenuItemCard key={item._id ?? item.name} item={item} compact />
              ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center text-sm text-brand-subtle">No items in this category.</div>
        )}
      </section>

      <Footer />
    </div>
  )
}
