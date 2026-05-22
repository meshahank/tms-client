import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function Menu() {
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Today’s Menu</p>
            <h1 className="font-display text-4xl font-black text-brand-dark">Fresh, active items for today</h1>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="aspect-square animate-pulse bg-white/70 p-0">
                  <div className="h-full rounded-card bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft shimmer" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item._id ?? item.id ?? item.name} item={item} compact />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
