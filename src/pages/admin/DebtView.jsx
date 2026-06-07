import { useMemo } from 'react'
import { AlertTriangle, Users, TrendingDown } from 'lucide-react'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import StudentTable from '../../components/tables/StudentTable'
import Badge from '../../components/ui/Badge'
import { useDebtors } from '../../hooks/useDebtors'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function DebtView() {
  const { data: debtorsData, isLoading } = useDebtors()

  const columns = useMemo(
    () => [
      { accessorKey: 'index', header: '#', cell: (info) => (
        <span className="text-xs font-medium text-brand-subtle tabular-nums">{info.row.index + 1}</span>
      )},
      { accessorKey: 'name', header: 'Name', cell: (info) => (
        <span className="font-semibold text-brand-dark">{info.getValue()}</span>
      )},
      { accessorKey: 'admissionNumber', header: 'Adm. No', cell: (info) => (
        <span className="text-xs font-mono text-brand-muted">{info.getValue()}</span>
      )},
      { accessorKey: 'class', header: 'Class', cell: (info) => (
        <Badge variant="muted">{formatClass(info.getValue())}</Badge>
      )},
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => (
          <span className="font-bold text-brand-danger tabular-nums">{currencyLabel(info.getValue())}</span>
        ),
      },
    ],
    [],
  )

  const allDebtors = useMemo(() => {
    if (!debtorsData?.classes) return []
    return debtorsData.classes.flatMap((c) => c.students || [])
  }, [debtorsData])

  const totalDebt = useMemo(
    () => allDebtors.reduce((sum, s) => sum + Math.abs(Number(s.balance) || 0), 0),
    [allDebtors],
  )

  return (
    <div className="min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-page">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-danger mb-1.5">Debt View</p>
          <h1 className="font-display text-4xl font-extrabold text-brand-dark">Negative Balances</h1>
        </div>

        {/* Stat chips */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          {[
            { label: 'Total Debtors',    value: allDebtors.length,                              icon: Users,         color: 'text-brand-danger', bg: 'bg-brand-dangerTint' },
            { label: 'Total Debt',       value: currencyLabel(totalDebt),                       icon: TrendingDown,  color: 'text-brand-danger', bg: 'bg-brand-dangerTint' },
            { label: 'Classes Affected', value: debtorsData?.classes?.length ?? 0,              icon: AlertTriangle, color: 'text-brand-mid',    bg: 'bg-brand-greenTint' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-3">{label}</p>
                <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
              </div>
              <span className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={18} />
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 skeleton rounded-2xl" />
            ))}
          </div>
        ) : debtorsData?.classes?.length ? (
          <div className="space-y-5">
            {debtorsData.classes.map((classGroup) => (
              <div key={classGroup.class} className="card overflow-hidden p-0">
                {/* Class header */}
                <div className="flex items-center justify-between gap-4 border-b border-brand-borderLight bg-brand-dangerTint/30 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="red">{formatClass(classGroup.class)}</Badge>
                    <span className="text-sm font-semibold text-brand-dark">
                      {classGroup.students?.length ?? 0} student{classGroup.students?.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-brand-danger">
                    {currencyLabel(classGroup.totalDebt ?? 0)}
                  </span>
                </div>
                <StudentTable data={classGroup.students ?? []} columns={columns} />
              </div>
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center py-16 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-greenTint text-brand-green">
              <TrendingDown size={28} />
            </div>
            <p className="font-semibold text-brand-dark">No debtors found</p>
            <p className="mt-1 text-sm text-brand-muted">All students have positive or zero balances.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
