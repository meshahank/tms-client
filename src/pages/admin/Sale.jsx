import { useMemo, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Search, Save, RotateCcw, AlertCircle, AlertTriangle, ShoppingCart, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import SaleItemBox from '../../components/ui/SaleItemBox'
import { SALE_ITEMS } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { useSaleStore } from '../../store/saleStore'
import { salesApi } from '../../api/sales'

export default function Sale() {
  const [query, setQuery]         = useState('')
  const [submitted, setSubmitted] = useState('')
  const saleState                 = useSaleStore()
  const lookupQuery               = useStudentLookup(submitted)

  useEffect(() => {
    if (lookupQuery.data) saleState.setStudent(lookupQuery.data)
  }, [lookupQuery.data])

  const recordSale = useMutation({
    mutationFn: (payload) => salesApi.create(payload),
    onSuccess: () => {
      toast.success('Sale recorded!')
      saleState.discard()
      saleState.clearStudent()
      setQuery('')
      setSubmitted('')
    },
    onError: (error) => toast.error(error.response?.data?.error || 'Unable to save sale'),
  })

  const limitInfo = useMemo(() => {
    const student = lookupQuery.data
    if (!student || student.dailyLimit == null) return { hasLimit: false, exceeded: false }
    const todaySpent  = student.todaySpent ?? 0
    const cartTotal   = saleState.cartTotal()
    const remaining   = student.dailyLimit - todaySpent
    return {
      hasLimit:   true,
      exceeded:   todaySpent + cartTotal > student.dailyLimit,
      remaining:  Math.max(0, remaining),
      todaySpent,
      dailyLimit: student.dailyLimit,
    }
  }, [lookupQuery.data, saleState.cartItems])

  const handleLookup = (e) => {
    e.preventDefault()
    const admNo = query.trim()
    if (!admNo) return
    setSubmitted(admNo)
  }

  const handleSave = () => {
    if (!saleState.student)      { toast.error('Lookup a student first'); return }
    if (!saleState.cartItems.length) { toast.error('Add at least one item'); return }
    if (limitInfo.exceeded)      { toast.error('Exceeds daily spending limit'); return }
    recordSale.mutate({
      studentId: saleState.student.admissionNumber,
      items:     saleState.cartItems.map(({ name, price }) => ({ name, price })),
      total:     saleState.cartTotal(),
    })
  }

  const student   = lookupQuery.data
  const cartTotal = saleState.cartTotal()

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-page">
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

          {/* ── Left column ────────────────────────────────── */}
          <div className="space-y-6">

            {/* Student lookup card */}
            <div className="card relative overflow-hidden">
              <GradientBlob className="right-[-4rem] top-[-3rem] h-56 w-56 opacity-60" />
              <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-1">Step 1</p>
                <h2 className="font-display text-2xl font-extrabold text-brand-dark mb-5">Find Student</h2>

                <form onSubmit={handleLookup} className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Admission number..."
                    className="input-base focus-ring flex-1 rounded-xl"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={lookupQuery.isLoading}
                    className="btn btn-primary h-[42px] w-[42px] rounded-xl shrink-0 !p-0 flex items-center justify-center"
                  >
                    {lookupQuery.isLoading ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                  </button>
                </form>

                {lookupQuery.isError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-brand-danger">
                    <AlertCircle size={12} />
                    Student not found.
                  </p>
                )}

                {/* Student card */}
                {student && (
                  <div className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-brand-green/20 bg-brand-greenTint/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-greenLight flex items-center justify-center shadow-sm">
                        <span className="font-display text-base font-black text-white">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark leading-tight">{student.name}</p>
                        <p className="text-[11px] text-brand-muted mt-0.5">
                          {student.admissionNumber} · {formatClass(student.class)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Balance</p>
                      <p className={`text-lg font-black ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-green'}`}>
                        {currencyLabel(student.balance)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Daily limit banner */}
                {limitInfo.hasLimit && (
                  <div className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium ${
                    limitInfo.exceeded
                      ? 'bg-brand-dangerTint text-brand-danger'
                      : 'bg-brand-amberTint text-amber-700'
                  }`}>
                    <AlertTriangle size={13} className="shrink-0" />
                    {limitInfo.exceeded
                      ? `Daily limit (${currencyLabel(limitInfo.dailyLimit)}) exceeded`
                      : `Spent today: ${currencyLabel(limitInfo.todaySpent)} · Remaining: ${currencyLabel(limitInfo.remaining)}`}
                  </div>
                )}
              </div>
            </div>

            {/* Item selection */}
            <div className="card">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-1">Step 2</p>
              <h2 className="font-display text-2xl font-extrabold text-brand-dark mb-5">Add Items</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SALE_ITEMS.map((item) => (
                  <button
                    key={item.uid}
                    onClick={() => saleState.addItem(item)}
                    className="group flex flex-col items-start gap-1.5 rounded-xl border border-brand-border bg-brand-paper p-3.5 text-left transition-all hover:border-brand-green/30 hover:bg-brand-greenTint hover:shadow-sm active:scale-95"
                  >
                    <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-green transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-brand-green">{currencyLabel(item.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — cart ─────────────────────────── */}
          <div className="xl:sticky xl:top-24 xl:h-fit">
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-brand-greenTint flex items-center justify-center">
                    <ShoppingCart size={14} className="text-brand-green" />
                  </div>
                  <h2 className="font-display text-xl font-extrabold text-brand-dark">Cart</h2>
                  {saleState.cartItems.length > 0 && (
                    <span className="badge badge-green">{saleState.cartItems.length}</span>
                  )}
                </div>
                {saleState.cartItems.length > 0 && (
                  <button
                    onClick={saleState.discard}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-subtle hover:text-brand-danger transition-colors"
                  >
                    <RotateCcw size={11} />
                    Clear
                  </button>
                )}
              </div>

              {/* Items */}
              <div className="min-h-[120px] space-y-2">
                {saleState.cartItems.length === 0 ? (
                  <div className="flex h-28 items-center justify-center rounded-xl border-2 border-dashed border-brand-borderLight">
                    <p className="text-xs text-brand-subtle">No items added yet</p>
                  </div>
                ) : (
                  saleState.cartItems.map((item) => (
                    <SaleItemBox key={item.uid} item={item} onRemove={saleState.removeItem} />
                  ))
                )}
              </div>

              {/* Totals */}
              {saleState.cartItems.length > 0 && (
                <div className="mt-5 rounded-xl bg-brand-greenTint/60 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-mid">Total</span>
                  <span className="text-2xl font-black text-brand-green tabular-nums">{currencyLabel(cartTotal)}</span>
                </div>
              )}

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={recordSale.isPending || !saleState.cartItems.length || !student}
                className="btn btn-primary btn-lg mt-5 w-full gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {recordSale.isPending ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {recordSale.isPending ? 'Saving…' : 'Record Sale'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
