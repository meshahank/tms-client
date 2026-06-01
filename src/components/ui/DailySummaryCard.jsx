import { TrendingUp, ShoppingBag, Star } from 'lucide-react'
import Card from './Card'
import { currencyLabel } from '../../lib/formatters'

export default function DailySummaryCard({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="animate-pulse p-6">
        <div className="flex flex-wrap gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-[180px]">
              <div className="h-4 w-24 rounded bg-brand-primaryTint" />
              <div className="mt-3 h-8 w-20 rounded bg-brand-primaryTint" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const metrics = [
    {
      label: 'Today Revenue',
      value: currencyLabel(data?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: 'text-brand-primary',
      bg: 'bg-brand-primaryTint',
    },
    {
      label: 'Transactions',
      value: data?.transactionCount ?? 0,
      icon: ShoppingBag,
      color: 'text-brand-dark',
      bg: 'bg-black/5',
    },
    {
      label: 'Top Item',
      value: data?.topItem ?? 'N/A',
      icon: Star,
      color: 'text-brand-primary',
      bg: 'bg-brand-primaryTint',
    },
  ]

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-brand-border bg-gradient-to-r from-brand-primaryTint via-white to-brand-primaryTint px-6 py-4">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Daily Summary</p>
        <p className="mt-1 text-xs text-brand-muted">Real-time sales overview for today</p>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="flex items-start gap-4">
              <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${metric.bg} ${metric.color}`}>
                <Icon size={20} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">{metric.label}</p>
                <p className="mt-1 text-2xl font-black text-brand-dark">{metric.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
