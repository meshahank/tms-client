import Button from './Button'
import Card from './Card'
import Badge from './Badge'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function StudentCard({ student, onAddItem, saleItems = [], showSaleButtons = false, children }) {
  if (!student) return null

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{student.admissionNumber}</Badge>
            <Badge className="bg-black/5 text-brand-dark">Class {formatClass(student.class)}</Badge>
          </div>
          <div>
            <h3 className="font-display text-3xl font-extrabold leading-none text-brand-dark md:text-4xl">{student.name}</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-brand-muted">
              A clean, credit-based student account view with fast balance and purchase history access.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-border bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Balance</p>
              <p className={`mt-2 text-xl font-extrabold ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-dark'}`}>
                {currencyLabel(student.balance)}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Credit</p>
              <p className="mt-2 text-xl font-extrabold text-brand-dark">{currencyLabel(student.totalCredit ?? 0)}</p>
            </div>
            <div className="rounded-2xl border border-brand-border bg-white px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Spent</p>
              <p className="mt-2 text-xl font-extrabold text-brand-dark">{currencyLabel(student.totalSpent ?? 0)}</p>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center md:min-w-[180px] md:pt-1">
          <div className="absolute inset-0 mx-auto h-28 w-28 rounded-[2rem] bg-brand-primary/16 blur-2xl" />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-primarySoft via-white to-white shadow-soft">
            <div className="h-14 w-14 rounded-[1.4rem] bg-gradient-to-br from-brand-primary/90 to-[#E55F3A]" />
          </div>
        </div>
      </div>

      {showSaleButtons ? (
        <div className="border-t border-brand-border bg-brand-primaryTint/60 p-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {saleItems.map((item) => (
              <Button key={`${item.name}-${item.price}`} size="sm" className="justify-between rounded-2xl" onClick={() => onAddItem?.(item)}>
                <span>{item.name}</span>
                <span className="text-white/90">{currencyLabel(item.price)}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {children ? <div className="border-t border-brand-border p-5">{children}</div> : null}
    </Card>
  )
}
