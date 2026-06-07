import { useMemo, useState } from 'react'
import { Search, RefreshCw, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import GradientBlob from '../../components/ui/GradientBlob'
import HistoryTable from '../../components/tables/HistoryTable'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { buildHistoryRows, getHistoryWindow } from '../../lib/studentHistory'
import { MONTH_OPTIONS } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function Students() {
  const [query, setQuery]           = useState('')
  const [submitted, setSubmitted]   = useState('')
  const [months, setMonths]         = useState(12)
  const [validationError, setVErr]  = useState('')

  const studentQuery = useStudentLookup(submitted)
  const student      = studentQuery.data

  const historyRows = useMemo(() => {
    const history = student?.history ?? []
    return buildHistoryRows(getHistoryWindow(history, months))
  }, [student?.history, months])

  const handleSubmit = (e) => {
    e.preventDefault()
    const admNo = query.trim()
    if (!admNo) { setVErr('Enter an admission number.'); return }
    setVErr('')
    setSubmitted(admNo)
  }

  const isNegative = student && Number(student.balance) < 0

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Search hero */}
      <section className="relative overflow-hidden py-16 text-center">
        <GradientBlob className="left-[-6rem] top-[-2rem] h-80 w-80 opacity-70" />
        <GradientBlob className="right-[-5rem] bottom-0 h-72 w-72 opacity-50" amber />

        <div className="relative mx-auto max-w-xl px-6 animate-page">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green mb-3">Student Lookup</p>
          <h1 className="font-display font-extrabold leading-[0.9] mb-8">
            <span className="block text-[3.2rem] sm:text-[4rem] text-brand-dark">Search</span>
            <span className="block text-[3.2rem] sm:text-[4rem] text-brand-green">Students</span>
          </h1>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter admission number..."
              className="input-base focus-ring flex-1 rounded-xl"
            />
            <button
              type="submit"
              className="btn btn-primary h-[42px] w-[42px] rounded-xl shrink-0 !p-0 flex items-center justify-center"
            >
              <Search size={16} />
            </button>
          </form>

          {(validationError || studentQuery.isError) && (
            <p className="mt-3 text-sm text-brand-danger">
              {validationError || 'No student found for that admission number.'}
            </p>
          )}
        </div>
      </section>

      {/* Student profile */}
      {studentQuery.isLoading && (
        <div className="mx-auto max-w-xl px-6 pb-16">
          <div className="card p-6 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-6 skeleton rounded-lg" style={{ width: `${70 - i * 10}%` }} />)}
          </div>
        </div>
      )}

      {studentQuery.isSuccess && student && (
        <section className="mx-auto max-w-2xl px-6 pb-20 animate-page">
          <div className="card overflow-hidden">
            {/* Top strip accent */}
            <div className={`h-1 w-full ${isNegative ? 'bg-brand-danger' : 'bg-gradient-to-r from-brand-green to-brand-amber'}`} />

            {/* Profile header */}
            <div className="p-6 flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-muted">{student.admissionNumber}</span>
                  <span className="badge badge-muted">{formatClass(student.class)}</span>
                  {isNegative && <span className="badge badge-red">In Debt</span>}
                </div>
                <h2 className="font-display text-3xl font-extrabold text-brand-dark leading-tight mt-1">
                  {student.name}
                </h2>
              </div>
              {/* Avatar */}
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-brand-green to-brand-greenLight flex items-center justify-center shadow-md">
                <span className="font-display text-xl font-black text-white">{student.name.charAt(0)}</span>
              </div>
            </div>

            {/* Balance stats */}
            <div className="px-6 pb-6 grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Balance',
                  value: currencyLabel(student.balance),
                  icon: Wallet,
                  color: isNegative ? 'text-brand-danger' : 'text-brand-green',
                  bg:    isNegative ? 'bg-brand-dangerTint' : 'bg-brand-greenTint',
                },
                {
                  label: 'Total Paid',
                  value: currencyLabel(student.totalCredit ?? 0),
                  icon: TrendingUp,
                  color: 'text-brand-mid',
                  bg:    'bg-brand-greenTint',
                },
                {
                  label: 'Debt',
                  value: currencyLabel(Math.abs(Math.min(0, Number(student.balance)))),
                  icon: TrendingDown,
                  color: 'text-brand-danger',
                  bg:    'bg-brand-dangerTint',
                },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="stat-chip flex flex-col gap-1">
                  <div className={`h-7 w-7 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={13} className={color} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-subtle mt-1">{label}</p>
                  <p className={`text-lg font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* History */}
            <div className="border-t border-brand-borderLight">
              <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-green">Purchase History</p>
                <div className="flex items-center gap-1.5">
                  {MONTH_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setMonths(opt)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        months === opt
                          ? 'bg-brand-green text-white shadow-sm'
                          : 'bg-brand-greenTint/70 text-brand-mid hover:bg-brand-greenMid'
                      }`}
                    >
                      {opt >= 12 ? 'All' : `${opt}m`}
                    </button>
                  ))}
                  <button
                    onClick={() => studentQuery.refetch()}
                    className="ml-1 h-7 w-7 flex items-center justify-center rounded-lg text-brand-subtle hover:text-brand-mid hover:bg-brand-greenTint transition-all"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>
              <HistoryTable rows={historyRows} />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
