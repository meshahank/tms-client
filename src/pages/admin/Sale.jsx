import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, ShoppingBag, Save, RotateCcw, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import StudentCard from '../../components/ui/StudentCard'
import SaleItemBox from '../../components/ui/SaleItemBox'
import { SALE_ITEMS } from '../../lib/constants'
import { currencyLabel } from '../../lib/formatters'
import { buildHistoryRows, getHistoryWindow } from '../../lib/studentHistory'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { useSaleStore } from '../../store/saleStore'
import { salesApi } from '../../api/sales'

export default function Sale() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const saleState = useSaleStore()
  const lookupQuery = useStudentLookup(submitted)

  const recordSale = useMutation({
    mutationFn: (payload) => salesApi.create(payload),
    onSuccess: () => {
      toast.success('Sale recorded successfully')
      saleState.discard()
      saleState.clearStudent()
      setQuery('')
      setSubmitted('')
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to save sale'),
  })

  const historyRows = useMemo(() => {
    const history = lookupQuery.data?.history ?? []
    return buildHistoryRows(getHistoryWindow(history, 12))
  }, [lookupQuery.data?.history])

  const handleLookup = async (event) => {
    event.preventDefault()
    const admNo = query.trim()
    if (!admNo) return
    setSubmitted(admNo)
  }

  const handleAddItem = (item) => {
    saleState.addItem(item)
  }

  const handleSave = () => {
    if (!saleState.student) {
      toast.error('Lookup a student first')
      return
    }
    if (!saleState.cartItems.length) {
      toast.error('Add at least one item')
      return
    }

    recordSale.mutate({
      studentId: saleState.student.admissionNumber,
      items: saleState.cartItems.map(({ name, price }) => ({ name, price })),
      total: saleState.cartTotal(),
    })
  }

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="space-y-8 p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Sale</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">Record a student purchase</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Items in cart</p>
                <p className="mt-2 text-3xl font-black text-brand-dark">{saleState.cartItems.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Cart total</p>
                <p className="mt-2 text-3xl font-black text-brand-primary">{currencyLabel(saleState.cartTotal())}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Student</p>
                <p className="mt-2 text-3xl font-black text-brand-dark">{saleState.student ? 'Ready' : 'Pending'}</p>
              </Card>
            </div>
          </div>

          <form onSubmit={handleLookup} className="flex flex-col gap-3 lg:max-w-xl lg:flex-row">
            <InputField
              label="Student lookup"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Admission number"
              prefix={<Search size={14} />}
              className="flex-1"
            />
            <Button type="submit" size="lg">
              <Search size={16} />
              Find student
            </Button>
          </form>

          {lookupQuery.data ? (
            <StudentCard
              student={lookupQuery.data}
              saleItems={SALE_ITEMS}
              showSaleButtons
              onAddItem={handleAddItem}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Bought</p>
                    <h2 className="font-display text-2xl font-black text-brand-dark">Cart items</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-primaryTint px-4 py-2 text-sm font-semibold text-brand-dark">
                    <ShoppingBag size={14} className="text-brand-primary" />
                    {saleState.cartItems.length} items
                  </div>
                </div>

                <div className="space-y-3">
                  {saleState.cartItems.length ? (
                    saleState.cartItems.map((item) => <SaleItemBox key={item.uid} item={item} onRemove={saleState.removeItem} />)
                  ) : (
                    <Card className="border-dashed p-6 text-sm text-brand-muted">Add coffee or snack items to build the bill.</Card>
                  )}
                </div>

                <div className="flex flex-col gap-3 rounded-3xl bg-brand-primaryTint/55 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total</p>
                    <p className="mt-2 text-4xl font-black text-brand-dark">{currencyLabel(saleState.cartTotal())}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" onClick={saleState.discard}>
                      <RotateCcw size={14} />
                      Discard
                    </Button>
                    <Button onClick={handleSave} disabled={recordSale.isPending}>
                      <Save size={14} />
                      Save sale
                    </Button>
                  </div>
                </div>

                <Card className="bg-white/75 p-4 text-sm text-brand-muted">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="mt-0.5 text-brand-primary" />
                    <p>Sale validation is enforced server-side. The backend recomputes totals and updates the student balance atomically.</p>
                  </div>
                </Card>

                <Card className="p-0">
                  <div className="border-b border-brand-border px-5 py-4">
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">History</p>
                  </div>
                  <div className="p-5">
                    <HistoryPreview rows={historyRows} />
                  </div>
                </Card>
              </div>
            </StudentCard>
          ) : (
            <Card className="border-dashed p-8 text-center text-brand-muted">Search for a student to begin recording a sale.</Card>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function HistoryPreview({ rows }) {
  if (!rows.length) {
    return <p className="text-sm text-brand-muted">No transaction history for this student.</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rows.slice(0, 6).map((row) => (
        <Card key={row.id} className="p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted">Transaction</p>
          <p className="mt-2 font-semibold text-brand-dark">{row.date}</p>
          <p className="mt-1 text-sm text-brand-muted">Total {currencyLabel(row.total)}</p>
        </Card>
      ))}
    </div>
  )
}
