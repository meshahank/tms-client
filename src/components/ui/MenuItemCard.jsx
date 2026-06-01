import { currencyLabel } from '../../lib/formatters'

const fallbackImage =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'

export default function MenuItemCard({ item, action, actionLabel, compact = false }) {
  return (
    <div className="group flex flex-col gap-2">
      {/* Image tile */}
      <div className="relative overflow-hidden rounded-[1.4rem] aspect-square bg-brand-primaryTint">
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          onError={(e) => { e.currentTarget.src = fallbackImage }}
          crossOrigin="anonymous"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* dark gradient only at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Name at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <p className="text-xs font-semibold text-white leading-tight truncate">{item.name}</p>
          {item.price !== undefined && item.price !== null && (
            <p className="text-[10px] text-white/75 font-medium">{currencyLabel(item.price)}</p>
          )}
        </div>

        {/* Teapetti label */}
        <div className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-[9px] font-bold text-brand-dark tracking-wide">Teapetti</span>
        </div>
      </div>

      {/* Action button if provided */}
      {action && (
        <button
          onClick={action}
          className={`w-full rounded-full py-1.5 text-xs font-semibold transition-colors ${
            actionLabel?.toLowerCase().includes('remove')
              ? 'bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20'
              : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
