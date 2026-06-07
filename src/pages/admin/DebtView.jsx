import { useMemo } from 'react'
import { AlertTriangle, Users, TrendingDown } from 'lucide-react'
import AdminNavbar from '../../components/layout/AdminNavbar'
import Footer from '../../components/layout/Footer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StudentTable from '../../components/tables/StudentTable'
import { useDebtors } from '../../hooks/useDebtors'
import { currencyLabel, formatClass } from '../../lib/formatters'

export default function DebtView() {
  const { data: debtorsData, isLoading } = useDebtors()

  const columns = useMemo(
    () => [
      { accessorKey: 'index', header: 'No.', cell: (info) => info.row.index + 1 },
      { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
      { accessorKey: 'admissionNumber', header: 'Adm. No' },
      { accessorKey: 'class', header: 'Class', cell: (info) => <Badge>{formatClass(info.getValue())}</Badge> },
      {
        accessorKey: 'balance',
        header: 'Balance',
        cell: (info) => (
          <span className="font-bold text-brand-danger">{currencyLabel(info.getValue())}</span>
        ),
      },
    ],
    [],
  )

  const allDebtors = useMemo(() => {
    if (!debtorsData?.classes) return []
    return debtorsData.classes.flatMap(c => c.students || [])
  }, [debtorsData])

  const totalDebt = useMemo(() => {
    return allDebtors.reduce((sum, s) => sum + Math.abs(Number(s.balance) || 0), 0)
  }, [allDebtors])

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-primary">Debt View</p>
              <h1 className="font-display text-4xl font-black text-brand-dark">Students with negative balances</h1>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total Debtors</p>
                  <p className="mt-3 text-3xl font-black text-brand-danger">{allDebtors.length}</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-danger/10 text-brand-danger">
                  <Users size={20} />
                </span>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Total Debt</p>
                  <p className="mt-3 text-3xl font-black text-brand-danger">{currencyLabel(totalDebt)}</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-danger/10 text-brand-danger">
                  <TrendingDown size={20} />
                </span>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-muted">Classes Affected</p>
                  <p className="mt-3 text-3xl font-black text-brand-dark">{debtorsData?.classes?.length ?? 0}</p>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primaryTint text-brand-primary">
                  <AlertTriangle size={20} />
                </span>
              </div>
            </Card>
          </div>

          {isLoading ? (
            <Card className="p-10 text-center text-brand-muted">Loading debtor information...</Card>
          ) : debtorsData?.classes?.length ? (
            <div className="space-y-6">
              {debtorsData.classes.map((classGroup) => (
                <Card key={classGroup.class} className="overflow-hidden p-0">
                  <div className="flex items-center justify-between gap-4 border-b border-brand-border bg-brand-primaryTint/50 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-brand-primary text-white">{formatClass(classGroup.class)}</Badge>
                      <span className="text-sm font-semibold text-brand-dark">
                        {classGroup.students?.length || 0} student{classGroup.students?.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-brand-danger">
                      Total: {currencyLabel(classGroup.totalDebt || 0)}
                    </span>
                  </div>
                  <div className="p-5">
                    <StudentTable data={classGroup.students || []} columns={columns} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed p-10 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-success/10 text-brand-success">
                <TrendingDown size={28} />
              </div>
              <p className="font-semibold text-brand-dark">No debtors found</p>
              <p className="mt-1 text-sm text-brand-muted">All students have positive or zero balances.</p>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
