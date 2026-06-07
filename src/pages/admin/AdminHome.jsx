import { useState } from 'react'
import { MenuSquare, ShoppingBag, Users, FileText, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
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

  const debtors = students.filter((s) => Number(s.balance) < 0)

  const metrics = [
    { label: 'Students', value: students.length, icon: Users },
    { label: 'Active menu', value: menuItems.filter((i) => i.isActive).length, icon: MenuSquare },
    { label: 'Debtors', value: debtors.length, icon: AlertTriangle, danger: debtors.length > 0 },
    {
      label: 'Total balance',
      value: currencyLabel(students.reduce((sum, s) => sum + Number(s.balance ?? 0), 0)),
      icon: ShoppingBag,
    },
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

      <main className="relative mx-auto max-w-7xl px-6 py-12">
        <GradientBlob className="left-[-4rem] top-0 h-64 w-64 opacity-40" />
        <GradientBlob className="right-[-3rem] top-10 h-56 w-56 opacity-30" />

        <div className="relative space-y-10">
          {/* Header */}
          <div>
            <h1 className="font-display text-5xl font-black text-brand-dark leading-tight">
              Admin<br />Features
            </h1>
          </div>

          {/* Daily summary */}
          <DailySummaryCard data={dailySummary} isLoading={summaryLoading} />

          {/* Metric tiles */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.label}
                  className="rounded-[1.4rem] bg-white border border-black/[0.07] shadow-sm p-5 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-muted">{m.label}</p>
                    <p className={`mt-2.5 text-3xl font-black ${m.danger ? 'text-brand-danger' : 'text-brand-dark'}`}>{m.value}</p>
                  </div>
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${m.danger ? 'bg-brand-danger/10 text-brand-danger' : 'bg-brand-primaryTint text-brand-primary'}`}>
                    <Icon size={18} />
                  </span>
                </div>
              )
            })}
          </div>

          {/* Quick actions + chart */}
          <div className="grid gap-8 xl:grid-cols-2">
            {/* Quick actions */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted mb-4">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                {features.map((f) => {
                  const Icon = f.icon
                  return (
                    <button
                      key={f.label}
                      onClick={() => navigate(f.path)}
                      className="group rounded-[1.4rem] bg-gradient-to-br from-brand-primaryTint/70 via-white to-white border border-black/[0.06] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-28 flex flex-col justify-between p-5 text-left"
                    >
                      <Icon size={22} className="text-brand-primary" />
                      <div>
                        <p className="text-base font-black text-brand-dark">{f.label}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">{f.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sales analytics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted">Sales Analytics</p>
                <div className="flex gap-1">
                  {['week', 'month'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAnalyticsRange(r)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        analyticsRange === r
                          ? 'bg-brand-primary text-white'
                          : 'bg-black/[0.05] text-brand-muted hover:bg-black/[0.09]'
                      }`}
                    >
                      {r === 'week' ? 'Week' : 'Month'}
                    </button>
                  ))}
                </div>
              </div>
              <ItemSalesChart data={analytics} isLoading={analyticsLoading} range={analyticsRange} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
