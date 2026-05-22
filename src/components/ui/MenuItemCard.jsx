import Button from './Button'
import Card from './Card'
import Badge from './Badge'

const fallbackImage =
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'

export default function MenuItemCard({ item, action, actionLabel, compact = false }) {
  return (
    <Card className={`group overflow-hidden p-0 ${compact ? 'pb-3' : ''}`}>
      <div className={`relative overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-square'}`}>
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.src = fallbackImage
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-white/90 text-[10px] tracking-[0.22em] text-brand-dark">Teapetti</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-sm font-bold leading-tight">{item.name}</p>
            <p className="text-xs text-white/80">Freshly served</p>
          </div>
          {item.isActive ? <Badge className="bg-white/20 text-white">Active</Badge> : null}
        </div>
      </div>
      <div className={`flex items-center justify-between gap-3 px-4 ${compact ? 'pt-3' : 'py-4'}`}>
        <div>
          <p className="text-sm font-semibold text-brand-dark">{item.name}</p>
          <p className="text-xs text-brand-muted">Campus favorite</p>
        </div>
        {action ? (
          <Button size="sm" variant={actionLabel?.toLowerCase().includes('remove') ? 'danger' : 'success'} onClick={action}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
