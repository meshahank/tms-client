import { useMemo, useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import UserNavbar from '../../components/layout/UserNavbar'
import Footer from '../../components/layout/Footer'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import InputField from '../../components/ui/InputField'
import GradientBlob from '../../components/ui/GradientBlob'
import StudentCard from '../../components/ui/StudentCard'
import HistoryTable from '../../components/tables/HistoryTable'
import { useStudentLookup } from '../../hooks/useStudentLookup'
import { buildHistoryRows, getHistoryWindow } from '../../lib/studentHistory'
import { MONTH_OPTIONS } from '../../lib/constants'

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

  return (
    <div className="min-h-screen">
      <UserNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-10">
          <GradientBlob className="left-0 top-0 h-56 w-56" />
          <GradientBlob className="bottom-[-4rem] right-[-2rem] h-64 w-64" />
          <div className="relative text-center">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-brand-muted">Search Students</p>
            <h1 className="mt-3 font-display text-5xl font-black text-brand-dark sm:text-6xl">
              Search <span className="text-gradient">Students</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">
              Lookup by admission number, view balance, and inspect purchase history with clean month filters.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <InputField
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Enter your admission number"
                error={validationError || studentQuery.isError ? 'No student found for that admission number.' : ''}
                className="flex-1"
                prefix={<Search size={14} />}
              />
              <Button type="submit" size="lg">
                <Search size={16} />
                Search
              </Button>
            </form>
          </div>
        </section>

        {studentQuery.isSuccess && studentQuery.data ? (
          <section className="mt-8 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Student Profile</p>
                <h2 className="font-display text-3xl font-black text-brand-dark">Validated student record</h2>
              </div>
              <Button variant="secondary" size="sm" onClick={() => studentQuery.refetch()}>
                <RefreshCw size={14} />
                Refresh
              </Button>
            </div>

            <StudentCard student={studentQuery.data}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-brand-muted">History range</span>
                  <div className="flex gap-2">
                    {MONTH_OPTIONS.map((option) => (
                      <Button
                        key={option}
                        variant={months === option ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setMonths(option)}
                      >
                        {option >= 12 ? 'All' : `${option} month${option > 1 ? 's' : ''}`}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-brand-muted">
                  Showing {historyRows.length} transaction{historyRows.length === 1 ? '' : 's'}
                </div>
              </div>
              <div className="mt-5">
                <HistoryTable rows={historyRows} />
              </div>
            </StudentCard>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
