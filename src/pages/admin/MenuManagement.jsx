import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, MenuSquare, LayoutGrid } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import MenuItemCard from '../../components/ui/MenuItemCard'
import { useMenuStore } from '../../store/menuStore'
import { useMenuItems } from '../../hooks/useMenuItems'
import { menuApi } from '../../api/menu'

export default function MenuManagement() {
  const queryClient = useQueryClient()
  const { data: items = [], isLoading } = useMenuItems(false)
  const available = useMenuStore((state) => state.available)
  const selected = useMenuStore((state) => state.selected)
  const setItems = useMenuStore((state) => state.setItems)
  const moveToSelected = useMenuStore((state) => state.moveToSelected)
  const moveToAvailable = useMenuStore((state) => state.moveToAvailable)

  const createMutation = useMutation({
    mutationFn: (payload) => menuApi.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('Menu item added')
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to add menu item'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => menuApi.toggleActive(id, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['menu-items'] })
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Menu update failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => menuApi.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('Menu item removed')
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to delete menu item'),
  })

  useEffect(() => {
    const active = items.filter((item) => item.isActive)
    const inactive = items.filter((item) => !item.isActive)
    setItems(inactive, active)
  }, [items, setItems])

  const handleAdd = async (item) => {
    moveToSelected(item._id ?? item.id)
    const id = item._id ?? item.id
    try {
      await toggleMutation.mutateAsync({ id, isActive: true })
    } catch {
      moveToAvailable(id)
    }
  }

  const handleRemove = async (item) => {
    moveToAvailable(item._id ?? item.id)
    const id = item._id ?? item.id
    try {
      await toggleMutation.mutateAsync({ id, isActive: false })
    } catch {
      moveToSelected(id)
    }
  }

  const activeCount = selected.length
  const inactiveCount = available.length

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Menu</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">
                <span className="text-brand-dark">Available</span> <span className="text-brand-muted">·</span> <span className="text-brand-primary">Selected</span>
              </h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Available</p>
                <p className="mt-2 text-3xl font-black text-brand-dark">{inactiveCount}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Selected</p>
                <p className="mt-2 text-3xl font-black text-brand-primary">{activeCount}</p>
              </Card>
            </div>
          </div>

          <MenuCreateCard onCreate={(payload) => createMutation.mutate(payload)} />

          {isLoading ? (
            <Card className="p-8 text-center text-brand-muted">Loading menu items...</Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <MenuColumn
                title="Available"
                icon={LayoutGrid}
                items={available}
                actionLabel="Add"
                onAction={handleAdd}
              />
              <MenuColumn
                title="Selected"
                icon={MenuSquare}
                items={selected}
                actionLabel="Remove"
                onAction={handleRemove}
                removeMode
                onDelete={(item) => {
                  if (window.confirm('Delete this menu item?')) deleteMutation.mutate(item._id ?? item.id)
                }}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function MenuColumn({ title, icon: Icon, items, actionLabel, onAction, removeMode = false, onDelete }) {
  return (
    <Card className="space-y-5 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-muted">{title}</p>
          <h2 className="font-display text-2xl font-black text-brand-dark">{items.length} items</h2>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
          <Icon size={18} />
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item._id ?? item.id} className="space-y-3">
            <MenuItemCard
              item={item}
              compact
              action={() => onAction(item)}
              actionLabel={actionLabel}
            />
            {removeMode ? (
              <Button variant="secondary" size="sm" className="w-full" onClick={() => onDelete?.(item)}>
                <Trash2 size={14} />
                Delete
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {!items.length && (
        <Card className="border-dashed p-6 text-center text-sm text-brand-muted">
          No {title.toLowerCase()} items
        </Card>
      )}
    </Card>
  )
}

function MenuCreateCard({ onCreate }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    onCreate({ 
      name: name.trim(), 
      image: image.trim() || undefined, 
      price: Number(price) || 10,
      isActive: false 
    })
    setName('')
    setImage('')
    setPrice('')
  }

  return (
    <Card className="space-y-4 p-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Create item</p>
        <h2 className="font-display text-2xl font-black text-brand-dark">Add a new menu card</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_0.5fr_auto] md:items-end">
        <InputField label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Masala Tea" />
        <InputField label="Image URL" value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://..." />
        <InputField label="Price" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="10" type="number" min="0" />
        <Button type="submit">
          <Plus size={14} />
          Add item
        </Button>
      </form>
    </Card>
  )
}
