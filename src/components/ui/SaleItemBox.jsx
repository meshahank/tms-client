import { Trash2 } from 'lucide-react'
import { currencyLabel } from '../../lib/formatters'

export default function SaleItemBox({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-border bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div>
        <p className="font-semibold text-brand-dark">{item.name}</p>
        <p className="text-xs text-brand-muted">Selected item</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-bold text-brand-primary">{currencyLabel(item.price)}</span>
        <button type="button" onClick={() => onRemove(item.uid)} className="rounded-full p-2 text-brand-danger transition hover:bg-brand-danger/10">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
