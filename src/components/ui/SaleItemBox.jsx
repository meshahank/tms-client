import { X } from 'lucide-react'
import { currencyLabel } from '../../lib/formatters'

export default function SaleItemBox({ item, onRemove }) {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-brand-border bg-white px-4 py-3 transition-all hover:border-brand-green/25 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-greenTint">
          <span className="text-[11px] font-bold text-brand-green">{item.name.charAt(0)}</span>
        </div>
        <span className="text-sm font-medium text-brand-dark">{item.name}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-brand-green">{currencyLabel(item.price)}</span>
        <button
          type="button"
          onClick={() => onRemove(item.uid)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-brand-subtle hover:bg-brand-dangerTint hover:text-brand-danger transition-all"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
