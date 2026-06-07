import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, MenuSquare, LayoutGrid } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import InputField from '../../components/ui/InputField'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuStore } from '../../store/menuStore'
import { useMenuItems } from '../../hooks/useMenuItems'
import { menuApi } from '../../api/menu'

export default function MenuManagement() {
  const queryClient = useQueryClient()
  const { data: items = [], isLoading } = useMenuItems(false)
  const available    = useMenuStore((s) => s.available)
  const selected     = useMenuStore((s) => s.selected)
  const setItems     = useMenuStore((s) => s.setItems)
  const moveToSelected  = useMenuStore((s) => s.moveToSelected)
  const moveToAvailable = useMenuStore((s) => s.moveToAvailable)

  const createMutation = useMutation({
    mutationFn: (payload) => menuApi.create(payload),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['menu-items'] }); toast.success('Menu item added') },
    onError: (e) => toast.error(e.response?.data?.error || 'Unable to add item'),
  })
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => menuApi.toggleActive(id, isActive),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['menu-items'] }) },
    onError: (e) => toast.error(e.response?.data?.error || 'Update failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => menuApi.remove(id),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['menu-items'] }); toast.success('Removed') },
    onError: (e) => toast.error(e.response?.data?.error || 'Delete failed'),
  })

  useEffect(() => {
    setItems(items.filter((i) => !i.isActive), items.filter((i) => i.isActive))
  }, [items, setItems])

  const handleAdd = async (item) => {
    const id = item._id ?? item.id
    moveToSelected(id)
    try { await toggleMutation.mutateAsync({ id, isActive: true }) }
    catch { moveToAvailable(id) }
  }

  const handleRemove = async (item) => {
    const id = item._id ?? item.id
    moveToAvailable(id)
    try { await toggleMutation.mutateAsync({ id, isActive: false }) }
    catch { moveToSelected(id) }
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 animate-page">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-1.5">Menu Management</p>
          <h1 className="font-display text-4xl font-extrabold text-brand-dark">
            <span className="text-brand-mid">{available.length} Available</span>
            <span className="mx-3 text-brand-borderLight">·</span>
            <span className="text-brand-green">{selected.length} Active</span>
          </h1>
        </div>

        {/* Add new item */}
        <MenuCreateCard onCreate={(payload) => createMutation.mutate(payload)} />

        {/* Columns */}
        {isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2 mt-6">
            {[0,1].map((i) => <div key={i} className="h-64 skeleton rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2 mt-6">
            <MenuColumn
              title="Available"
              icon={LayoutGrid}
              items={available}
              actionLabel="Activate"
              onAction={handleAdd}
            />
            <MenuColumn
              title="Active Today"
              icon={MenuSquare}
              items={selected}
              actionLabel="Deactivate"
              onAction={handleRemove}
              removeMode
              onDelete={(item) => {
                if (window.confirm('Delete this menu item permanently?'))
                  deleteMutation.mutate(item._id ?? item.id)
              }}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function MenuColumn({ title, icon: Icon, items, actionLabel, onAction, removeMode = false, onDelete }) {
  return (
    <div className="card space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-1">{title}</p>
          <h2 className="font-display text-2xl font-extrabold text-brand-dark">{items.length} items</h2>
        </div>
        <div className="h-10 w-10 rounded-xl bg-brand-greenTint flex items-center justify-center">
          <Icon size={16} className="text-brand-green" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item._id ?? item.id} className="space-y-2">
            <MenuItemCard
              item={item}
              compact
              action={() => onAction(item)}
              actionLabel={actionLabel}
            />
            {removeMode && (
              <button
                onClick={() => onDelete?.(item)}
                className="w-full rounded-lg py-1.5 text-xs font-semibold text-brand-danger/70 hover:bg-brand-dangerTint hover:text-brand-danger transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={11} />
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {!items.length && (
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-brand-borderLight py-10">
          <p className="text-sm text-brand-subtle">No {title.toLowerCase()} items</p>
        </div>
      )}
    </div>
  )
}

function MenuCreateCard({ onCreate }) {
  const [name,  setName]  = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate({ name: name.trim(), image: image.trim() || undefined, price: Number(price) || 10, isActive: false })
    setName(''); setImage(''); setPrice('')
  }

  return (
    <div className="card mb-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-green mb-1">New Item</p>
      <h2 className="font-display text-xl font-extrabold text-brand-dark mb-5">Add to Menu</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_0.5fr_auto] sm:items-end">
        <InputField label="Name"      value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Masala Tea" />
        <InputField label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        <InputField label="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10" type="number" min="0" />
        <button type="submit" className="btn btn-primary h-[42px] shrink-0">
          <Plus size={14} />
          Add
        </button>
      </form>
    </div>
  )
}
