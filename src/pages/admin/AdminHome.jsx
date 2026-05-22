import { ChartColumnBig, MenuSquare, ShoppingBag, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import GradientBlob from '../../components/ui/GradientBlob'
import { useStudents } from '../../hooks/useStudents'
import { useMenuItems } from '../../hooks/useMenuItems'
import { currencyLabel } from '../../lib/formatters'

export default function AdminHome() {
  const navigate = useNavigate()
  const { data: students = [] } = useStudents()
  const { data: menuItems = [] } = useMenuItems(false)

  const metrics = [
    { label: 'Students', value: students.length, icon: Users },
    { label: 'Active menu', value: menuItems.filter((item) => item.isActive).length, icon: MenuSquare },
    { label: 'Dormant balance', value: currencyLabel(students.reduce((sum, student) => sum + Math.abs(Number(student.balance ?? 0)), 0)), icon: ShoppingBag },
    { label: 'Sales analytics', value: 'Live', icon: ChartColumnBig },
  ]

  const features = [
    { label: 'Students', icon: Users, path: '/admin/students' },
    { label: 'Sale', icon: ShoppingBag, path: '/admin/sale' },
    { label: 'Menu', icon: MenuSquare, path: '/admin/menu' },
    { label: 'Analytics', icon: ChartColumnBig, path: '/admin/sale' },
  ]

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-[-3rem] top-[-2rem] h-56 w-56" />
          <GradientBlob className="right-[-2rem] top-6 h-64 w-64" />
          <div className="relative space-y-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Admin Features</p>
              <h1 className="mt-2 font-display text-5xl font-black text-brand-dark">Operate the shop with clarity</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <Card key={metric.label} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">{metric.label}</p>
                        <p className="mt-3 text-3xl font-black text-brand-dark">{metric.value}</p>
                      </div>
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                        <Icon size={20} />
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.label} className="group cursor-pointer p-5 transition duration-300 hover:-translate-y-1 hover:shadow-float" onClick={() => navigate(feature.path)}>
                    <div className="flex h-24 flex-col justify-between rounded-[1.25rem] bg-gradient-to-br from-brand-primaryTint via-white to-white p-4">
                      <Icon size={24} className="text-brand-primary" />
                      <div>
                        <p className="text-lg font-black text-brand-dark">{feature.label}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">Open module</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
