import Card from './Card'
import { currencyLabel } from '../../lib/formatters'

export default function ItemSalesChart({ data, isLoading, range }) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-brand-primaryTint" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-20 animate-pulse rounded bg-brand-primaryTint" />
              <div className="h-6 flex-1 animate-pulse rounded-full bg-brand-primaryTint/50" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const items = data?.items || []
  const maxCount = Math.max(...items.map(i => i.count || 0), 1)

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Item Sales</p>
          <p className="mt-1 text-xs text-brand-muted">
            {range === 'week' ? 'This week' : 'This month'} breakdown
          </p>
        </div>
        {data?.totalRevenue !== undefined && (
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted">Total</p>
            <p className="text-lg font-bold text-brand-primary">{currencyLabel(data.totalRevenue)}</p>
          </div>
        )}
      </div>

      {items.length ? (
        <div className="space-y-4">
          {items.map((item, index) => {
            const percentage = ((item.count || 0) / maxCount) * 100
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-brand-dark">{item.name}</span>
                  <span className="text-brand-muted">
                    {item.count} sold · {currencyLabel(item.revenue)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-brand-primaryTint/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary/70 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-brand-muted">No sales data available</p>
      )}
    </Card>
  )
}
