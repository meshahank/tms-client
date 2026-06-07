import { useState } from 'react'
import { MenuSquare, ShoppingBag, Users, FileText, AlertTriangle, ArrowRight } from 'lucide-react'
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
  const { data: students = [] }                            = useStudents()
  const { data: menuItems = [] }                           = useMenuItems(false)
  const { data: dailySummary, isLoading: summaryLoading }  = useDailySummary()
  const { data: analytics, isLoading: analyticsLoading }   = useItemAnalytics(analyticsRange)

  const debtors = students.filter((s) => Number(s.balance) < 0)

  const metrics = [
    { label: 'Students',      value: students.length,                                                              icon: Users,         danger: false },
    { label: 'Active Items',  value: menuItems.filter((i) => i.isActive).length,                                   icon: MenuSquare,    danger: false },
    { label: 'Debtors',       value: debtors.length,                                                               icon: AlertTriangle, danger: debtors.length > 0 },
    { label: 'Total Balance', value: currencyLabel(students.reduce((s, x) => s + Number(x.balance ?? 0), 0)),      icon: ShoppingBag,   danger: false },
  ]

  const features = [
    { label: 'Students', description: 'Manage roster',   icon: Users,      path: '/admin/students' },
    { label: 'Sale',     description: 'Record purchase', icon: ShoppingBag, path: '/admin/sale' },
    { label: 'Menu',     description: 'Edit items',      icon: MenuSquare, path: '/admin/menu' },
    { label: 'Reports',  description: 'Export data',     icon: FileText,   path: '/admin/reports' },
  ]

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="relative mx-auto max-w-7xl px-6 py-12 animate-page">
        <GradientBlob className="left-[-5rem] top-0 h-80 w-80 opacity-70" />
        <GradientBlob className="right-[-4rem] top-10 h-64 w-64 opacity-50" amber />

        <div className="relative space-y-10">
          {/* Header */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-2">Dashboard</p>
            <h1 className="font-display text-[3rem] sm:text-[4rem] font-extrabold text-brand-dark leading-[0.9]">
              Admin<br />
              <span className="text-brand-green">Overview</span>
            </h1>
          </div>

          {/* Daily summary */}
          <DailySummaryCard data={dailySummary} isLoading={summaryLoading} />

          {/* Metric tiles */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 animate-stagger">
            {metrics.map((m) => {
              const Icon = m.icon
              return (
                <div key={m.label} className="card flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-3">{m.label}</p>
                    <p className={`text-3xl font-black tabular-nums ${m.danger ? 'text-brand-danger' : 'text-brand-dark'}`}>
                      {m.value}
                    </p>
                  </div>
                  <span className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    m.danger ? 'bg-brand-dangerTint text-brand-danger' : 'bg-brand-greenTint text-brand-green'
                  }`}>
                    <Icon size={18} />
                  </span>
                </div>
              )
            })}
          </div>

          {/* Quick actions + chart */}
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Quick actions */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-green mb-4">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                {features.map((f) => {
                  const Icon = f.icon
                  return (
                    <button
                      key={f.label}
                      onClick={() => navigate(f.path)}
                      className="group card card-hover flex h-28 flex-col justify-between p-5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-xl bg-brand-greenTint flex items-center justify-center">
                          <Icon size={16} className="text-brand-green" />
                        </div>
                        <ArrowRight size={14} className="text-brand-subtle opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-brand-dark">{f.label}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-subtle">{f.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sales analytics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-green">Sales Analytics</p>
                <div className="flex gap-1">
                  {['week', 'month'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAnalyticsRange(r)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        analyticsRange === r
                          ? 'bg-brand-green text-white'
                          : 'bg-brand-greenTint text-brand-mid hover:bg-brand-greenMid'
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
