import { useMemo, useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Badge from '../../components/ui/Badge'
import GradientBlob from '../../components/ui/GradientBlob'
import HistoryTable from '../../components/tables/HistoryTable'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { buildHistoryRows, getHistoryWindow } from '../../lib/studentHistory'
import { MONTH_OPTIONS } from '../../lib/constants'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function Students() {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [months, setMonths] = useState(12)
  const [validationError, setValidationError] = useState('')

  const studentQuery = useStudentLookup(submitted)

  const historyRows = useMemo(() => {
    const history = studentQuery.data?.history ?? []
    return buildHistoryRows(getHistoryWindow(history, months))
  }, [studentQuery.data?.history, months])

  const handleSubmit = (e) => {
    e.preventDefault()
    const admNo = query.trim()
    if (!admNo) { setValidationError('Enter an admission number.'); return }
    setValidationError('')
    setSubmitted(admNo)
  }

  const student = studentQuery.data

  return (
    <div className="min-h-screen">
      <UserNavbar />

      {/* Search section — no outer card */}
      <section className="relative overflow-hidden py-16 text-center">
        <GradientBlob className="left-[-5rem] top-[-2rem] h-72 w-72 opacity-50" />
        <GradientBlob className="right-[-4rem] bottom-0 h-64 w-64 opacity-35" />

        <div className="relative mx-auto max-w-2xl px-6">
          <h1 className="font-display font-black leading-[0.9] mb-10">
            <span className="block text-5xl sm:text-6xl text-brand-dark">Search</span>
            <span className="block text-5xl sm:text-6xl text-brand-primary">Students</span>
          </h1>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your Ad no..."
              className="flex-1 rounded-full border border-black/10 bg-white/90 px-5 py-3 text-sm font-medium text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 shadow-sm"
            />
            <button
              type="submit"
              className="h-11 w-11 shrink-0 flex items-center justify-center rounded-full bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              <Search size={16} />
            </button>
          </form>

          {(validationError || studentQuery.isError) && (
            <p className="mt-3 text-sm text-brand-danger font-medium">
              {validationError || 'No student found for that admission number.'}
            </p>
          )}
        </div>
      </section>

      {/* Student profile — a single clean card */}
      {studentQuery.isSuccess && student ? (
        <section className="mx-auto max-w-2xl px-6 pb-16">
          <div className="rounded-[1.5rem] bg-white border border-black/[0.07] shadow-soft overflow-hidden">
            {/* Header row */}
            <div className="flex items-start justify-between gap-6 p-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold tracking-widest text-brand-muted">{student.admissionNumber}</span>
                  <span className="text-xs font-bold tracking-widest text-brand-muted">{formatClass(student.class)}</span>
                </div>
                <h2 className="font-display text-4xl font-black text-brand-dark leading-tight">{student.name}</h2>

                {/* Balance chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="rounded-xl border border-black/[0.07] bg-white px-4 py-2.5 min-w-[80px]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-0.5">Total</p>
                    <p className={`text-xl font-black ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-dark'}`}>
                      {currencyLabel(student.balance)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-black/[0.07] bg-white px-4 py-2.5 min-w-[80px]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-0.5">Credit</p>
                    <p className="text-xl font-black text-brand-dark">{currencyLabel(student.totalCredit ?? 0)}</p>
                  </div>
                  <div className="rounded-xl border border-brand-danger/20 bg-brand-danger/5 px-4 py-2.5 min-w-[80px]">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-danger mb-0.5">Debt</p>
                    <p className="text-xl font-black text-brand-danger">
                      {currencyLabel(Math.abs(Math.min(0, Number(student.balance))))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Avatar placeholder */}
              <div className="shrink-0 h-20 w-20 rounded-[1.25rem] bg-gradient-to-br from-brand-primarySoft to-brand-warm shadow-sm" />
            </div>

            {/* History */}
            <div className="border-t border-black/[0.06] p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-primary">History</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-brand-muted">Total</span>
                  <span className="text-xs font-medium text-brand-muted">·</span>
                  <span className="text-xs font-medium text-brand-muted">Months</span>
                  <div className="flex gap-1 ml-1">
                    {MONTH_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setMonths(opt)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          months === opt
                            ? 'bg-brand-primary text-white'
                            : 'bg-black/[0.05] text-brand-muted hover:bg-black/[0.09]'
                        }`}
                      >
                        {opt >= 12 ? 'All' : opt}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => studentQuery.refetch()}
                    className="ml-1 p-1.5 rounded-full text-brand-muted hover:text-brand-dark hover:bg-black/[0.05] transition-colors"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>
              <HistoryTable rows={historyRows} />
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </div>
  )
}
