import { useState } from 'react'
import { ChartColumnBig, MenuSquare, ShoppingBag, Users, FileText, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import GradientBlob from '../../components/ui/GradientBlob'
import DailySummaryCard from '../../components/ui/DailySummaryCard'
import ItemSalesChart from '../../components/ui/ItemSalesChart'
import { useStudents } from '../../hooks/useStudents'
import { useMenuItems } from '../../hooks/useMenuItems'
import { useDailySummary } from '../../hooks/useDailySummary'
import { useItemAnalytics } from '../../hooks/useItemAnalytics'
import { currencyLabel } from '../../lib/formatters'

export default function AdminHome() {
  const navigate = useNavigate()
  const [analyticsRange, setAnalyticsRange] = useState('week')
  const { data: students = [] } = useStudents()
  const { data: menuItems = [] } = useMenuItems(false)
  const { data: dailySummary, isLoading: summaryLoading } = useDailySummary()
  const { data: analytics, isLoading: analyticsLoading } = useItemAnalytics(analyticsRange)

  const debtors = students.filter(s => Number(s.balance) < 0)

  const metrics = [
    { label: 'Students', value: students.length, icon: Users },
    { label: 'Active menu', value: menuItems.filter((item) => item.isActive).length, icon: MenuSquare },
    { label: 'Debtors', value: debtors.length, icon: AlertTriangle, danger: debtors.length > 0 },
    { label: 'Total balance', value: currencyLabel(students.reduce((sum, student) => sum + Number(student.balance ?? 0), 0)), icon: ShoppingBag },
  ]

  const features = [
    { label: 'Students', description: 'Manage roster', icon: Users, path: '/admin/students' },
    { label: 'Sale', description: 'Record purchase', icon: ShoppingBag, path: '/admin/sale' },
    { label: 'Menu', description: 'Edit items', icon: MenuSquare, path: '/admin/menu' },
    { label: 'Reports', description: 'Export data', icon: FileText, path: '/admin/reports' },
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
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Admin Dashboard</p>
              <h1 className="mt-2 font-display text-5xl font-black text-brand-dark">Operate the shop with clarity</h1>
            </div>

            <DailySummaryCard data={dailySummary} isLoading={summaryLoading} />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <Card key={metric.label} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">{metric.label}</p>
                        <p className={`mt-3 text-3xl font-black ${metric.danger ? 'text-brand-danger' : 'text-brand-dark'}`}>{metric.value}</p>
                      </div>
                      <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${metric.danger ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-primaryTint text-brand-primary'}`}>
                        <Icon size={20} />
                      </span>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-muted">Quick Actions</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                      <Card key={feature.label} className="group cursor-pointer p-0 transition duration-300 hover:-translate-y-1 hover:shadow-float" onClick={() => navigate(feature.path)}>
                        <div className="flex h-28 flex-col justify-between rounded-card bg-gradient-to-br from-brand-primaryTint via-white to-white p-5">
                          <Icon size={24} className="text-brand-primary" />
                          <div>
                            <p className="text-lg font-black text-brand-dark">{feature.label}</p>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">{feature.description}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-muted">Sales Analytics</p>
                  <div className="flex gap-2">
                    {['week', 'month'].map((range) => (
                      <Button
                        key={range}
                        variant={analyticsRange === range ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setAnalyticsRange(range)}
                      >
                        {range === 'week' ? 'Week' : 'Month'}
                      </Button>
                    ))}
                  </div>
                </div>
                <ItemSalesChart data={analytics} isLoading={analyticsLoading} range={analyticsRange} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
