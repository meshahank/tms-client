import { currencyLabel } from '../../lib/formatters'

const fallback = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'

export default function MenuItemCard({ item, action, actionLabel, compact = false }) {
  return (
    <div className="group flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-2xl aspect-square bg-brand-greenTint">
        <img
          src={item.image || fallback}
          alt={item.name}
          onError={(e) => { e.currentTarget.src = fallback }}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-brand-ink/80 via-brand-ink/30 to-transparent" />

        {/* Name + price overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-[13px] font-semibold text-white leading-tight">{item.name}</p>
          {item.price != null && (
            <p className="text-[11px] font-medium text-white/70 mt-0.5">{currencyLabel(item.price)}</p>
          )}
        </div>

        {/* Brand pill */}
        <div className="absolute top-2.5 left-2.5 bg-brand-dark/60 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-[9px] font-bold text-white/80 tracking-wider">Teapetti</span>
        </div>
      </div>

      {action && (
        <button
          onClick={action}
          className={`w-full rounded-lg py-2 text-xs font-semibold transition-all duration-150 ${
            actionLabel?.toLowerCase().includes('remove')
              ? 'bg-brand-dangerTint text-brand-danger hover:bg-brand-danger/15'
              : 'bg-brand-greenTint text-brand-green hover:bg-brand-greenMid'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
