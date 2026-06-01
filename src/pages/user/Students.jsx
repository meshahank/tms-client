import { useMemo, useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import InputField from '../../components/ui/InputField'
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

  const handleSubmit = (event) => {
    event.preventDefault()
    const admNo = query.trim()

    if (!admNo) {
      setValidationError('Enter an admission number to search.')
      return
    }

    setValidationError('')
    setSubmitted(admNo)
  }

  const student = studentQuery.data

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search Section */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-0 top-0 h-56 w-56" />
          <GradientBlob className="bottom-[-4rem] right-[-2rem] h-64 w-64" />
          <div className="relative text-center">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-muted">Search</p>
            <h1 className="mt-3 font-display text-5xl font-black text-brand-dark sm:text-6xl">
              <span className="text-gradient">Students</span>
            </h1>

            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <InputField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enter your Ad no..."
                error={validationError || studentQuery.isError ? 'No student found for that admission number.' : ''}
                className="flex-1"
                prefix={<Search size={14} />}
              />
              <Button type="submit" size="lg">
                <Search size={16} />
              </Button>
            </form>
          </div>
        </section>

        {/* Student Profile */}
        {studentQuery.isSuccess && student ? (
          <section className="mt-8">
            <Card className="overflow-hidden p-0">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{student.admissionNumber}</Badge>
                    <Badge className="bg-black/5 text-brand-dark">{formatClass(student.class)}</Badge>
                  </div>
                  <div>
                    <h2 className="font-display text-4xl font-extrabold text-brand-dark">{student.name}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-brand-border bg-white px-5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Total</p>
                      <p className={`mt-1 text-2xl font-extrabold ${Number(student.balance) < 0 ? 'text-brand-danger' : 'text-brand-dark'}`}>
                        {currencyLabel(student.balance)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-brand-border bg-white px-5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted">Credit</p>
                      <p className="mt-1 text-2xl font-extrabold text-brand-dark">{currencyLabel(student.totalCredit ?? 0)}</p>
                    </div>
                    <div className="rounded-2xl border border-brand-border bg-brand-danger/8 px-5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-danger">Debt</p>
                      <p className="mt-1 text-2xl font-extrabold text-brand-danger">
                        {currencyLabel(Math.abs(Math.min(0, Number(student.balance))))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative flex shrink-0 items-center justify-center md:min-w-[160px]">
                  <div className="absolute h-28 w-28 rounded-[2rem] bg-brand-primary/16 blur-2xl" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-primarySoft via-white to-white shadow-soft">
                    <div className="h-14 w-14 rounded-[1.4rem] bg-gradient-to-br from-brand-primary/90 to-[#E55F3A]" />
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="border-t border-brand-border p-6">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">History</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-brand-muted">Months</span>
                    <div className="flex gap-2">
                      {MONTH_OPTIONS.map((option) => (
                        <Button
                          key={option}
                          variant={months === option ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => setMonths(option)}
                        >
                          {option >= 12 ? 'All' : option}
                        </Button>
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => studentQuery.refetch()}>
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>
                <HistoryTable rows={historyRows} />
              </div>
            </Card>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
