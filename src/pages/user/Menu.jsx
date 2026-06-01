import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import GradientBlob from '../../components/ui/GradientBlob'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function Menu() {
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-[-3rem] top-[-2rem] h-48 w-48" />
          <GradientBlob className="right-[-2rem] bottom-[-3rem] h-56 w-56" />
          
          <div className="relative space-y-8">
            <div className="text-center">
              <h1 className="font-display text-4xl font-black text-brand-dark">
                Today&apos;s <span className="text-gradient">Menu</span>
              </h1>
              <p className="mt-2 text-sm text-brand-muted">Fresh, active items for today</p>
            </div>

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index} className="aspect-[4/4] animate-pulse bg-white/70 p-0">
                    <div className="h-full rounded-card bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft shimmer" />
                  </Card>
                ))}
              </div>
            ) : menuItems.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {menuItems.map((item) => (
                  <MenuItemCard key={item._id ?? item.id ?? item.name} item={item} compact />
                ))}
              </div>
            ) : (
              <Card className="border-dashed p-10 text-center">
                <p className="text-brand-muted">No menu items available today</p>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
