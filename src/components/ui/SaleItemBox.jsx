import { X } from 'lucide-react'
import { currencyLabel } from '../../lib/formatters'

export default function SaleItemBox({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-brand-border bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm transition hover:border-brand-primary/30">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primaryTint">
          <span className="text-xs font-bold text-brand-primary">{item.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-brand-dark">{item.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-brand-primaryTint px-3 py-1 text-sm font-bold text-brand-primary">
          {currencyLabel(item.price)}
        </span>
        <button 
          type="button" 
          onClick={() => onRemove(item.uid)} 
          className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-danger/10 text-brand-danger transition hover:bg-brand-danger hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
