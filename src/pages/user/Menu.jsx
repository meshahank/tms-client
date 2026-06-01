import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function Menu() {
  const { data: menuItems = [], isLoading } = useMenuItems(true)

  return (
    <div className="min-h-screen">
      <UserNavbar />

      <main className="relative mx-auto max-w-6xl px-6 py-12">
        <GradientBlob className="left-[-4rem] top-0 h-64 w-64 opacity-40" />
        <GradientBlob className="right-[-3rem] bottom-0 h-56 w-56 opacity-30" />

        <div className="relative">
          <h1 className="font-display text-5xl font-black text-brand-dark text-center mb-2">Menu</h1>
          <p className="text-center text-sm text-brand-muted mb-10">Fresh, active items for today</p>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[1.4rem] bg-gradient-to-br from-brand-primaryTint via-white to-brand-primarySoft animate-pulse"
                />
              ))}
            </div>
          ) : menuItems.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item._id ?? item.name} item={item} compact />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-brand-muted">
              No menu items available today
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
