import { useMemo, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, ShoppingBag, Save, RotateCcw, AlertCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import Badge from '../../components/ui/Badge'
import SaleItemBox from '../../components/ui/SaleItemBox'
import GradientBlob from '../../components/ui/GradientBlob'
import { SALE_ITEMS } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { useSaleStore } from '../../store/saleStore'
import { salesApi } from '../../api/sales'

export default function Sale() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const saleState = useSaleStore()
  const lookupQuery = useStudentLookup(submitted)

  // Set student in store when lookup succeeds
  useEffect(() => {
    if (lookupQuery.data) {
      saleState.setStudent(lookupQuery.data)
    }
  }, [lookupQuery.data])

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

  // Calculate if daily limit would be exceeded
  const limitInfo = useMemo(() => {
    const student = lookupQuery.data
    if (!student || student.dailyLimit == null) {
      return { hasLimit: false, exceeded: false, remaining: Infinity }
    }
    
    const todaySpent = student.todaySpent ?? 0
    const cartTotal = saleState.cartTotal()
    const projectedTotal = todaySpent + cartTotal
    const remaining = student.dailyLimit - todaySpent
    
    return {
      hasLimit: true,
      exceeded: projectedTotal > student.dailyLimit,
      remaining: Math.max(0, remaining),
      todaySpent,
      dailyLimit: student.dailyLimit,
    }
  }, [lookupQuery.data, saleState.cartItems])

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
    if (limitInfo.exceeded) {
      toast.error('This sale would exceed the daily spending limit')
      return
    }

    recordSale.mutate({
      studentId: saleState.student.admissionNumber,
      items: saleState.cartItems.map(({ name, price }) => ({ name, price })),
      total: saleState.cartTotal(),
    })
  }

  const student = lookupQuery.data

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Main Sale Area */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden p-6 md:p-8">
              <GradientBlob className="right-[-3rem] top-[-2rem] h-48 w-48" />
              <div className="relative">
                <div className="mb-6">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Search</p>
                  <h1 className="font-display text-4xl font-black text-brand-dark">
                    <span className="text-gradient">Students</span>
                  </h1>
                </div>

                <form onSubmit={handleLookup} className="flex flex-col gap-3 sm:flex-row">
                  <InputField
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Enter admission number..."
                    prefix={<Search size={14} />}
                    className="flex-1"
                  />
                  <Button type="submit" size="lg">
                    <Search size={16} />
                    Search
                  </Button>
                </form>
              </div>
            </Card>

            {student ? (
              <Card className="overflow-hidden p-0">
                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{student.admissionNumber}</Badge>
                      <Badge className="bg-black/5 text-brand-dark">{formatClass(student.class)}</Badge>
                    </div>
                    <div>
                      <h2 className="font-display text-4xl font-extrabold text-brand-dark">{student.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {SALE_ITEMS.map((item) => (
                        <Button
                          key={`${item.name}-${item.price}`}
                          size="sm"
                          className={`justify-between gap-4 rounded-2xl bg-gradient-to-r ${item.tone}`}
                          onClick={() => handleAddItem(item)}
                        >
                          <span>{item.name}</span>
                          <span className="opacity-90">{currencyLabel(item.price)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="relative flex shrink-0 items-center justify-center">
                    <div className="absolute h-28 w-28 rounded-[2rem] bg-brand-primary/16 blur-2xl" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-primarySoft via-white to-white shadow-soft">
                      <div className="h-14 w-14 rounded-[1.4rem] bg-gradient-to-br from-brand-primary/90 to-[#E55F3A]" />
                    </div>
                  </div>
                </div>

                {/* Daily limit warning */}
                {limitInfo.hasLimit && (
                  <div className={`border-t border-brand-border px-6 py-4 ${limitInfo.exceeded ? 'bg-brand-danger/8' : 'bg-brand-primaryTint/50'}`}>
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={18} className={limitInfo.exceeded ? 'text-brand-danger' : 'text-brand-primary'} />
                      <div>
                        <p className={`text-sm font-semibold ${limitInfo.exceeded ? 'text-brand-danger' : 'text-brand-dark'}`}>
                          {limitInfo.exceeded ? 'Daily limit would be exceeded!' : 'Daily spending limit active'}
                        </p>
                        <p className="text-xs text-brand-muted">
                          Limit: {currencyLabel(limitInfo.dailyLimit)} · Spent today: {currencyLabel(limitInfo.todaySpent)} · Remaining: {currencyLabel(limitInfo.remaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bought section */}
                <div className="border-t border-brand-border p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Bought</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {saleState.cartItems.length ? (
                      saleState.cartItems.map((item) => (
                        <SaleItemBox key={item.uid} item={item} onRemove={saleState.removeItem} />
                      ))
                    ) : (
                      <Card className="border-dashed p-5 text-center text-sm text-brand-muted">
                        Click items above to add to cart
                      </Card>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-primaryTint/55 p-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total</p>
                      <p className="mt-1 text-3xl font-black text-brand-dark">{currencyLabel(saleState.cartTotal())}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="danger" onClick={saleState.discard}>
                        Discard
                      </Button>
                      <Button 
                        variant="success" 
                        onClick={handleSave} 
                        disabled={recordSale.isPending || limitInfo.exceeded}
                      >
                        <Save size={14} />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="relative overflow-hidden border-dashed p-10 text-center">
                <GradientBlob className="left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" />
                <div className="relative">
                  <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                    <Search size={28} />
                  </div>
                  <p className="font-semibold text-brand-dark">Search for a student to begin</p>
                  <p className="mt-1 text-sm text-brand-muted">Enter an admission number above to look up a student</p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Cart Items</p>
              <p className="mt-3 text-4xl font-black text-brand-dark">{saleState.cartItems.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Cart Total</p>
              <p className="mt-3 text-4xl font-black text-brand-primary">{currencyLabel(saleState.cartTotal())}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Student</p>
              <p className="mt-3 text-xl font-black text-brand-dark">{student ? student.name : 'Not selected'}</p>
              {student && (
                <p className={`mt-1 text-sm font-semibold ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-muted'}`}>
                  Balance: {currencyLabel(student.balance)}
                </p>
              )}
            </Card>
            <Card className="bg-brand-primaryTint/40 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-brand-primary" />
                <p className="text-xs text-brand-muted">
                  Sale validation is enforced server-side. The backend recomputes totals and updates balance atomically.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
